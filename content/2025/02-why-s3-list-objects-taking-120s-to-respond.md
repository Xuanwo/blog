---
categories: Daily
date: 2025-05-13T01:00:00Z
title: "Why S3 ListObjects Taking 120s to Respond?"
---

Everyone knows that AWS S3 ListObjects is slow, but can you imagine it being so slow that you have to wait 120 seconds for a response? I've actually seen this happen in the wild.

## TL;DR

The deleted markers really affect list performance. Make sure to enable lifecycle management to remove them.

## Background

[Databend](https://github.com/databendlabs/databend) is a cloud-native data warehouse that supports S3 as its storage backend. It includes built-in vacuum functions to delete orphaned objects. Essentially, it loads table snapshots to determine all objects that are still referenced and deletes any objects not referenced by any snapshot. As an optimization, Databend writes data blobs to paths containing time-sortable UUIDs (specifically, UUIDv7). This enables Databend to take advantage of the ListObjects behavior, where all keys are sorted in lexicographical order. So, Databend can simply compute a `delete_until` key and remove all objects with keys less than `delete_until`.

One day, users reported that the `vacuum` operation failed due to an opendal list timeout.

```rust
6e8a1700-f629-4df4-9596-f9a6508c5f4b: http query has change state to Stopped, reason Err(StorageOther. Code: 4000, Text = Unexpected (persistent) at List::next => io operation timeout reached

Context:
   timeout: 60
```

[OpenDAL](https://github.com/apache/opendal) is a Rust library that offers a unified interface for accessing various storage backends, including S3. It features a built-in [`TimeoutLayer`](https://docs.rs/opendal/0.53.1/opendal/layers/struct.TimeoutLayer.html) that helps prevent problematic requests from hanging forever. The default timeout is set to 60 seconds, and the `vacuum` operation failed because it exceeded this limit.

Databend has become a complex system, and we've encountered [many SQL hang issues](https://xuanwo.io/2024/01-why-sql-hang-for-exactly-940s/) in the past. So, my initial thought when addressing this ticket was whether there might be areas where we haven't handled things properly, potentially causing problems for tokio.

## Debugging

After a quick review of the codebase, I didn’t spot anything obviously wrong. With no clear culprit in sight, I decided to try and reproduce the issue myself. The affected table had been in use for over a year and had accumulated a significant amount of data. Of course, I couldn’t hope to replicate the user’s dataset exactly, but my aim was to capture the general pattern. If I could demonstrate a significant slowdown in ListObjects under certain conditions, the precise scale would just be a matter of degree.

I direct the AI to use OpenDAL to assist me in generating the code.

> By the way, I'm using [Zed](https://zed.dev/) and [Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet) through [Github Copilot](https://github.com/features/copilot).

The code is mostly like this:

```rust
// S3 configuration
let mut builder = S3::default();
builder = builder.bucket("s3-invalid-xml-test");
builder = builder.region("us-east-2");

let operator = Operator::new(builder)?
    .layer(RetryLayer::new().with_jitter())
    .finish();

...

// Generate a time-ordered UUIDv7
let uuid = Uuid::now_v7();
let key = format!("{}{}", PREFIX, uuid);

// Create an small file with the generated key
match op.write(&key, "hello, world").await {
    Ok(_) => {
        written.fetch_add(1, Ordering::Relaxed);
        Ok(())
    }
    Err(e) => {
        Err(anyhow::anyhow!("Failed to create key {}: {}", key, e))
    }
}
```

I've tried various patterns, so let's save time by not repeating them and go straight to the problematic one:

- Have a bucket with versioning enabled.
- Generate a large number of files (millions or even billions).
- Delete all of them.

At this point, the bucket is empty. Listing the bucket with the prefix `/` or `/z` should, in theory, produce the same result.


What I found was that listing the entire bucket is much slower than listing with the `/z` prefix. For example, in a bucket where 10 million objects had been deleted, a full list operation would take over `500ms`, while listing with `/z` took only about `8ms`. In some cold-start cases, the initial list could take more than 30 seconds to return.

For example：

```txt
Starting comparison of latency differences in listing operations with different prefixes
Test parameters: Up to 1000 objects listed per operation, 5 test rounds (including 2 warm-up rounds)

Testing the entire bucket...
Performing 2 warm-up rounds...
  Warm-up #1: Listed 0 objects, time taken: 542.618835ms
  Warm-up #2: Listed 0 objects, time taken: 525.818171ms
Starting 5 official test rounds...
  Test #1: Listed 0 objects, time taken: 536.598969ms
  Test #2: Listed 0 objects, time taken: 539.10924ms
  Test #3: Listed 0 objects, time taken: 531.185516ms
  Test #4: Listed 0 objects, time taken: 536.617262ms
  Test #5: Listed 0 objects, time taken: 537.548909ms
  Average latency for entire bucket: 536.211979ms
  Median latency for entire bucket: 536.617262ms

Testing prefix 'z'...
Performing 2 warm-up rounds...
  Warm-up #1: Listed 0 objects, time taken: 9.004738ms
  Warm-up #2: Listed 0 objects, time taken: 7.567935ms
Starting 5 official test rounds...
  Test #1: Listed 0 objects, time taken: 7.752857ms
  Test #2: Listed 0 objects, time taken: 10.301437ms
  Test #3: Listed 0 objects, time taken: 8.822386ms
  Test #4: Listed 0 objects, time taken: 8.266962ms
  Test #5: Listed 0 objects, time taken: 8.190696ms
  Average latency for prefix 'z': 8.666867ms
  Median latency for prefix 'z': 8.266962ms

====== Latency Comparison Results ======
Entire bucket: Average 536.211979ms
Prefix 'z': Average 8.666867ms
Listing the entire bucket is 61.87 times slower than listing with prefix 'z'
=========================
```

Also, I can find the cold start of the same bucket can be quiet slow. In some cases, I can find that the warmup needs over 30s:

```txt
Testing the entire bucket...
Performing 2 rounds of warm-up...
  Warm-up #1: Listed 0 objects, took 31.881571371s
  Warm-up #2: Listed 0 objects, took 1.243807263s
Starting 5 rounds of formal testing...
  Test #1: Listed 0 objects, took 4.264687095s
  Test #2: Listed 0 objects, took 542.109058ms
  Test #3: Listed 0 objects, took 537.914204ms
  Test #4: Listed 0 objects, took 529.365008ms
  Test #5: Listed 0 objects, took 528.04485ms
  Average latency for the entire bucket: 1.280424043s
  Median latency for the entire bucket: 537.914204ms
```


Why? Why list objects can be so slow?

## Analysis

Let's date back to [How S3 Versioning works](https://docs.aws.amazon.com/AmazonS3/latest/userguide/versioning-workflows.html). After enabling versioning, S3 will create a delete marker for each object you delete. When calling `ListObjects`, S3 filters out all delete markers and returns only the current versions of the objects.

For example, here is a simple bucket containing only two objects: `x` and `y`. `x` has only one version, while `y` has two versions.

```txt
Actual Storage   ListObjects Results
--------------   -------------------
x (v1)           x (v1)
y (v1)
y (v2)           y (v2)
```

Obviously, `ListObjects` will only return `x (v1)` and `y (v2)`. If we delete `y`, the result will be:

```txt
Actual Storage        ListObjects Results
--------------        -------------------
x (v1)                x (v1)
y (v1)
y (v2)
y (v3: delete marker)
```

S3 will add a delete marker as `v3` for `y` and exclude it from the results. The key point is that the delete marker still exists in the bucket, so S3 still needs to check for it when listing objects. I believe the AWS S3 team has explored various optimization methods, but this can still be an issue if your bucket contains a large number of delete markers.

In the most severe cases, such as the following:

```txt
Actual Storage       ListObjects Results
-----------------    -------------------
t1 (delete marker)
t2 (delete marker)
t2 (delete marker)
...
t9999999 (v1)        t9999999 (v1)
```

S3 needs to scan a large number of delete markers before it can return the results. This is why listing object can be very slow, and may even appear as if the HTTP connection is hanging.

S3 has mentioned this in their documentation [performance degradation after enabling bucket versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshooting-versioning.html#performance-degradation) but they didn't provide a detailed explanation about how the performance degradation happens.

## Conclusion

Based on this analysis, we asked users to run `aws s3 ls` on the same prefix, and they reported that it took 120 seconds to receive the first response. We are aware that AWS S3 ListObjects can be slow, but in certain cases, it can be so slow that it triggers our timeout controls.

My takeaway from this lesson:

- S3 versioning is not free; only enable it when necessary.
- Enable lifecycle to remove delete markers and old non-current versions.
