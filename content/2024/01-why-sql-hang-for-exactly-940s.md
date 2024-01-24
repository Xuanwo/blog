---
categories: Code
date: 2024-01-24T01:00:00Z
title: "Why SQL hang for exactly 940s? TCP and Async Rust!"
tags:
    - rust
    - python
    - tcp
---

Time for us to start another journey. We'll delve into an SQL hang issue and explore TCP and Async Rust. Along the way, we'll discover numerous helpful tools and insights. Let's get started!

## TL;DR

Jump to [Conclusion](#conclusion) if you want to know the answer ASAP.

The reproduce code is available in [Xuanwo/tokio-tcpstream-with-busy-estab](https://github.com/Xuanwo/tokio-tcpstream-with-busy-estab).

## Databend SQL Hang

[Databend](https://github.com/datafuselabs/databend/) is an open-source, elastic, and workload-aware cloud data warehouse built in Rust, offering a cost-effective [alternative to Snowflake](https://github.com/datafuselabs/databend/issues/13059).

Databend is a cloud-native data warehouse that stores all its data in cloud storage services like AWS S3. Its performance can be significantly impacted by numerous small data files. To address this, Databend offers an `OPTIMIZE TABLE` SQL command to merge small files into larger ones for improved efficiency.

One day, a user reported that the `OPTIMIZE TABLE` command would occasionally hang for a long period. They operate a large Databend cluster on AWS with all data stored in S3. They observed that this SQL command either completes in 10 seconds or hangs for 940 seconds.

```sql
> optimize table abc compact limit 10000;
Query OK, 789893 rows affected (15 min 56.57 sec)
```

### Use [async-backtrace](https://github.com/tokio-rs/async-backtrace) to print backtrace for async stack

Databend's IO operations are entirely asynchronous, making it difficult to employ traditional backtracing to diagnose SQL hang-ups. To address this, Databend utilizes [async-backtrace](https://github.com/tokio-rs/async-backtrace) for generating async stack traces.

`async-backtrace` is a library that enables the addition of frame information to a `future`, which is extremely helpful for debugging async applications. For instance, see this [example](https://github.com/datafuselabs/databend/blob/53e795e52509073fb7ac33ff7ff9524b94f96001/src/query/storages/stream/src/stream_status_table_func.rs#L97).

```rust
#[async_backtrace::framed]
async fn read_partitions(
    &self,
    ctx: Arc<dyn TableContext>,
    push_downs: Option<PushDownInfo>,
    dry_run: bool,
) -> Result<(PartStatistics, Partitions)> {
    ...
}
```

Databend offers this feature through an HTTP API, allowing users to retrieve the current async backtrace by accessing `http://<databend_http_api_address>/debug/async_tasks/dump`. With a complete async backtrace tree available, we can observe that most threads are blocked at `block_reader_merge_io_async::merge_io_read`, as shown below:

```shell
╼ Running query b2530ac8-a9c2-4b5e-8e49-058e0186ce60 spawn task at src/common/base/src/runtime/runtime.rs:298:17
  └╼ <databend_common_storages_fuse::operations::mutation::processors::compact_source::CompactSource as databend_common_pipeline_core::processors::processor::Processor>::async_process::{{closure}} at src/query/storages/fuse/src/operations/mutation/processors/compact_source.rs:199:5
     └╼ databend_common_storages_fuse::io::read::block::block_reader_merge_io_async::<impl databend_common_storages_fuse::io::read::block::block_reader::BlockReader>::read_columns_data_by_merge_io::{{closure}} at src/query/storages/fuse/src/io/read/block/block_reader_merge_io_async.rs:133:5
        └╼ databend_common_storages_fuse::io::read::block::block_reader_merge_io_async::<impl databend_common_storages_fuse::io::read::block::block_reader::BlockReader>::merge_io_read::{{closure}} at src/query/storages/fuse/src/io/read/block/block_reader_merge_io_async.rs:45:5
           └╼ databend_common_storages_fuse::io::read::block::block_reader_merge_io_async::<impl databend_common_storages_fuse::io::read::block::block_reader::BlockReader>::read_range::{{closure}} at src/query/storages/fuse/src/io/read/block/block_reader_merge_io_async.rs:207:5
```

This function reads data from cloud storage services by invoking [Apache OpenDAL](https://github.com/apache/opendal)'s read method to simultaneously retrieve and merge multiple files together.

Our user shared more logs that point to a `connection error: Connection timed out (os error 110)`:

```shell
2024-01-18T10:52:53.170873Z  WARN opendal::layers::retry: /root/.cargo/registry/src/index.crates.io-6f17d22bba15001f/opendal-0.44.0/src/layers/retry.rs:259 operation=Reader::read path=122095485/122095884/_b/45fa2051927843ab9ec6060f93a96972_v2.parquet -> retry after 1.4625828269999999s: error=Unexpected (temporary) at Reader::read, context: { timeout: 60 } => operation timeout
2024-01-18T10:52:54.634717Z  WARN opendal::layers::retry: /root/.cargo/registry/src/index.crates.io-6f17d22bba15001f/opendal-0.44.0/src/layers/retry.rs:259 operation=Reader::read path=122095485/122095884/_b/45fa2051927843ab9ec6060f93a96972_v2.parquet -> retry after 2.244430423s: error=Unexpected (temporary) at read, context: { url: https://s3.ap-northeast-1.amazonaws.com/xx/122095485/122095884/_b/45fa2051927843ab9ec6060f93a96972_v2.parquet, called: http_util::Client::send_async, service: s3, path: 122095485/122095884/_b/45fa2051927843ab9ec6060f93a96972_v2.parquet, range: 4-523 } => send async request, source: error sending request for url (https://s3.ap-northeast-1.amazonaws.com/xx/122095485/122095884/_b/45fa2051927843ab9ec6060f93a96972_v2.parquet): connection error: Connection timed out (os error 110)
2024-01-18T10:52:54.996440Z  WARN databend_query::pipelines::executor::processor_async_task: src/query/service/src/pipelines/executor/processor_async_task.rs:92 Very slow processor async task, query_id:"79aed890-e39d-42e8-886b-cc9b3ae8ade9", processor id: NodeIndex(16), name: "CompactSource", elapsed: 940.238352197s, active sync workers: 0
```

The logs indicate that OpenDAL attempted two retries: the first due to an `operation timeout` and the second because of a `connection error`. The `operation timeout` is triggered by OpenDAL's [`TimeoutLayer`](https://opendal.apache.org/docs/rust/opendal/layers/struct.TimeoutLayer.html), while the `connection error` originates from [`hyper`](https://docs.rs/hyper/0.14.28/src/hyper/error.rs.html#483). It appears that the `connection error` is primarily responsible for this issue. 

We attempted to adjust the `TimeoutLayer` settings by reducing its timeout from 60 seconds to 10 seconds; however, this change did not affect the duration of SQL hang-ups, which persisted for nearly as long as 940s.

Why does it take 940 seconds to run this SQL?

### Use ChatGPT to analyze logs

I requested that users activate the debug level logging for Databend to investigate the cause of SQL hang-ups. The log size is overwhelming, making it difficult to extract any meaningful information. Therefore, I've asked ChatGPT to create a script to analyze the logs!

```txt
Please implement a python script that reads a very large log. Analyze the read duration for each parquet file within it. Output the results as a list sorted by read time from longest to shortest. The displayed fields should include the filename, amount of data read, and time consumed. 

The log indicating the start of reading looks like this:

2024-01-19T12:45:56.468264Z DEBUG opendal::types::operator::operator: /root/.cargo/git/checkouts/opendal-0345df785accbd56/26f4d19/core/src/types/operator/operator.rs:444 opendal::Operator start read 122095485/122095708/_b/63c7ea84a89e43d7ab7064e8e3582891_v2.parquet with range BytesRange(Some(4), Some(2579))

The log indicating the end of reading looks like this:

2024-01-19T12:45:59.040211Z DEBUG opendal::layers::logging: /root/.cargo/git/checkouts/opendal-0345df785accbd56/26f4d19/core/src/layers/logging.rs:982 service=s3 operation=read path=122095485/122095708/_b/63c7ea84a89e43d7ab7064e8e3582891_v2.parquet read=2579 -> data read finished
```

ChatGPT generates a good enough python script for me:

```python
import re
from datetime import datetime

def parse_log(log_file):
    start_pattern = re.compile(r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z).*start read (\d+/\d+/_b/[^ ]+) with range BytesRange\(Some\(\d+\), Some\((\d+)\)\)")
    end_pattern = re.compile(r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z).*path=(\d+/\d+/_b/[^ ]+) read=(\d+) -> data read finished")

    starts = {}
    ends = {}

    with open(log_file, 'r') as file:
        for line in file:
            start_match = start_pattern.match(line)
            if start_match:
                timestamp, file_name, data_size = start_match.groups()
                starts[file_name] = (datetime.fromisoformat(timestamp), int(data_size))

            end_match = end_pattern.match(line)
            if end_match:
                timestamp, file_name, _ = end_match.groups()
                ends[file_name] = datetime.fromisoformat(timestamp)

    read_times = []
    for file_name, (start_time, data_size) in starts.items():
        if file_name in ends:
            duration = (ends[file_name] - start_time).total_seconds()
            read_times.append((file_name, data_size, duration))

    read_times.sort(key=lambda x: x[2], reverse=True)

    return read_times

log_file = "path_to_your_log_file.log" 
read_times = parse_log(log_file)
for item in read_times:
    print(f"File: {item[0]}, Data Size: {item[1]}, Read Time: {item[2]} seconds")
```

I polished it a bit and run it against the log. The result is:

```txt
Total Files: 89900
Average File Size: 1762.4554393770857 bytes
Total Read Time: 82226.77976200053 seconds
File: 122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet, Data Size: 1764, Read Time: 942.634405 seconds
File: 122095485/122095708/_b/621f7d3afdbf444aae39bc318abeb835_v2.parquet, Data Size: 957, Read Time: 942.30596 seconds
File: 122095485/122095708/_b/bc79d4a64b2e4729b821cf6470a2d7d1_v2.parquet, Data Size: 2519, Read Time: 942.20898 seconds
File: 122095485/122095708/_b/6d411ab8ce944958b18d5993deb4567b_v2.parquet, Data Size: 799, Read Time: 942.012057 seconds
File: 122095485/122095708/_b/3f8f4a929138454eb4428992b9ad7705_v2.parquet, Data Size: 574, Read Time: 4.923176 seconds
File: 122095485/122095708/_b/25f9221b18294aadbfdb3f0467797f99_v2.parquet, Data Size: 577, Read Time: 4.426447 seconds
File: 122095485/122095708/_b/e968828b60d34e6790d76d551f4e8d1c_v2.parquet, Data Size: 957, Read Time: 4.368927 seconds
File: 122095485/122095708/_b/09731f086aac487e8207996d78df39b9_v2.parquet, Data Size: 1668, Read Time: 4.354719 seconds
File: 122095485/122095708/_b/730fb4b945c448c08a1690fb94c19851_v2.parquet, Data Size: 3152, Read Time: 4.218513 seconds
File: 122095485/122095708/_b/4e372f66b4cf4b9aa971a92a33e2d582_v2.parquet, Data Size: 1273, Read Time: 4.205618 seconds
```

Some extremely slow files appear to be causing the entire SQL system to hang. Let's grep the logs for the file paths to learn more.

```shell
2024-01-19T12:45:57.379901Z DEBUG opendal::raw::oio::read::range_read: /core/src/raw/oio/read/range_read.rs:211 opendal::RangeReader send read request for 122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet
2024-01-19T12:45:57.379905Z DEBUG opendal::services::s3::backend: /core/src/services/s3/backend.rs:1068 opendal::services::S3 start sending request for 122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet
2024-01-19T12:45:57.380028Z DEBUG opendal::raw::http_util::client: /core/src/raw/http_util/client.rs:101 opendal::raw::HttpClient start sending request for https://s3.ap-northeast-1.amazonaws.com/xx/122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet
2024-01-19T13:01:35.154915Z  WARN opendal::layers::retry: /core/src/layers/retry.rs:259 operation=Reader::read path=122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet -> retry after 1.914550185s: error=Unexpected (temporary) at Reader::read, context: { timeout: 10 } => operation timeout
2024-01-19T13:01:37.070655Z  WARN opendal::layers::retry: /core/src/layers/retry.rs:259 operation=Reader::read path=122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet -> retry after 2.291463494s: error=Unexpected (temporary) at read, context: { url: https://s3.ap-northeast-1.amazonaws.com/xx/122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet, called: http_util::Client::send, service: s3, path: 122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet, range: 4-1767 } => send http request, source: error sending request for url (https://s3.ap-northeast-1.amazonaws.com/xx/122095485/122095708/_b/41670d08fd7947299f2441fc803985b4_v2.parquet): connection error: Connection timed out (os error 110)
```

The log indicates that the HTTP request was sent at `12:45:57.380028Z`, with a retry occurring about 940 seconds later, at `13:01:35.154915Z`.

## TCP Timeout

All application timeouts are being ignored, which leads me to believe there's an issue with the TCP layer. I found a Cloudflare blog post titled [When TCP Sockets Refuse to Die](https://blog.cloudflare.com/when-tcp-sockets-refuse-to-die) written by [@majek](https://github.com/majek) that seems highly relevant to this case.

> Let's prepare another experiment - after the three-way handshake, let's set up a firewall to drop all packets. Then, let's do a send on one end to have some dropped packets in-flight. An experiment shows the sending socket dies after ~16 minutes:
> 
> ...
> 
> The default value of 15 yields a hypothetical timeout of 924.6 seconds and is a lower bound for the effective timeout. TCP will effectively time out at the first RTO which exceeds the hypothetical timeout.
> 
> The connection indeed died at ~940 seconds. Notice the socket has the "on" timer running. It doesn't matter at all if we set SO_KEEPALIVE - when the "on" timer is running, keepalives are not engaged.

Our users are running a large SQL query that reads about 100,000 small files from S3. The TCP connection is likely to be busy or even hang. We can confirm this assumption by reproducing the same issue with a simple rust program.

> All code mentioned in this section could be found at [Xuanwo/tokio-tcpstream-with-busy-estab](https://github.com/Xuanwo/tokio-tcpstream-with-busy-estab).

Cloudflare offers scripts at [cloudflare-blog/2019-09-tcp-keepalives](https://github.com/cloudflare/cloudflare-blog/tree/master/2019-09-tcp-keepalives) that utilize [tcpdump](https://www.tcpdump.org/) to capture TCP packets and [iptables](https://linux.die.net/man/8/iptables) to emulate packet loss. To understand the events in Rust, we integrate these with our Tokio runtime. Additionally, we can employ [pyo3](https://github.com/PyO3/pyo3) for invoking Rust functions from Python.

```rust
use pyo3::prelude::*;
use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;
use tracing_subscriber::EnvFilter;

#[pyclass]
struct PyTcpStream {
    inner: Option<TcpStream>,
}

#[pymethods]
impl PyTcpStream {
    fn send<'py>(&'py mut self, py: Python<'py>, content: Vec<u8>) -> PyResult<&PyAny> {
        let mut stream = self.inner.take().unwrap();

        pyo3_asyncio::tokio::future_into_py(py, async move {
            let ( r,mut w) = stream.split();
            w.write_all(&content).await.unwrap();

            // This future could hang about 900s on linux with `net.ipv4.tcp_retries2 = 15`
            let fut = r.readable();

            fut.await.unwrap();
            Ok(Python::with_gil(|py| py.None()))
        })
    }
}

#[pyfunction]
fn connect(py: Python<'_>, address: String, port: u32) -> PyResult<&PyAny> {
    pyo3_asyncio::tokio::future_into_py(py, async move {
        let stream = TcpStream::connect(format!("{}:{}", address, port))
            .await
            .unwrap();
        Ok(PyTcpStream {
            inner: Some(stream),
        })
    })
}

#[pymodule]
fn tcptest(_py: Python<'_>, m: &PyModule) -> PyResult<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_writer(std::io::stderr)
        .pretty()
        .init();

    m.add_function(wrap_pyfunction!(connect, m)?)?;
    m.add_class::<PyTcpStream>()?;
    Ok(())
}
```

We will create a `tokio::net::TcpStream`, send some data to the remote, and wait for it to become readable. On the Python side, we'll use Cloudflare's utilities to simulate a TCP connection that drops all packets.

```python
# Adapted from original source:
# https://github.com/cloudflare/cloudflare-blog/tree/master/2019-09-tcp-keepalives

import socket
import time
import utils
import tcptest
import asyncio

async def tokio_main():
    utils.new_ns()

    port = 1

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)

    s.bind(('127.0.0.1', port))
    s.listen(16)

    tcpdump = utils.tcpdump_start(port)

    c = await tcptest.connect('127.0.0.1', port)

    # drop packets
    utils.drop_start(dport=port)
    utils.drop_start(sport=port)

    t0 = time.time()
    await c.send(b'hello world')

    time.sleep(1)
    utils.ss(port)

    # utils.drop_stop(dport=port)
    # utils.drop_stop(sport=port)
    # time.sleep(1)
    # utils.ss(port)

    utils.ss(port)

    t1 = time.time()
    print("[ ] took: %f seconds" % (t1-t0,))

asyncio.run(tokio_main())
```

We've replicated the same TCP timeout, which is the underlying cause of our SQL hang-up. In reality, Databend's HTTP request isn't hanging; it's awaiting the `ACK` from the remote S3 servers. After adjusting the `net.ipv4.tcp_retries2` value, our user confirmed that the issue has been resolved.

Although we could adjust `net.ipv4.tcp_retries2` to a lower value, it's not advisable to ask our users to make this change. OpenDAL should be equipped to manage such timeouts effectively.

Why didn't OpenDAL's TimeoutLayer function properly?

## Async Rust

I added logs to Tokio to investigate the issue.

```shell
  2024-01-24T03:46:32.851480Z DEBUG tokio::runtime::io::scheduled_io: Readiness poll returns Pending
    at tokio/tokio/src/runtime/io/scheduled_io.rs:554
    in tokio::task::runtime.spawn with kind: task, task.name: , task.id: 36, loc.file: "/home/xuanwo/.cargo/registry/src/index.crates.io-6f17d22bba15001f/pyo3-asyncio-0.20.0/src/tokio.rs", loc.line: 94, loc.col: 23

  2024-01-24T03:46:32.851489Z TRACE tokio::task::waker: op: "waker.clone", task.id: 2252074691592193
    at tokio/tokio/src/runtime/task/waker.rs:69
    in tokio::task::runtime.spawn with kind: task, task.name: , task.id: 36, loc.file: "/home/xuanwo/.cargo/registry/src/index.crates.io-6f17d22bba15001f/pyo3-asyncio-0.20.0/src/tokio.rs", loc.line: 94, loc.col: 23

 00:00:00.000000 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [S], seq 3101788242, win 33280, options [mss 65495,sackOK,TS val 3407635471 ecr 0,nop,wscale 7], length 0
 00:00:00.000006 IP 127.0.0.1.1 > 127.0.0.1.60382: Flags [S.], seq 2567999131, ack 3101788243, win 33280, options [mss 65495,sackOK,TS val 3407635471 ecr 3407635471,nop,wscale 7], length 0
 00:00:00.000012 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [.], ack 1, win 260, options [nop,nop,TS val 3407635471 ecr 3407635471], length 0
 00:00:00.016442 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [P.], seq 1:12, ack 1, win 260, options [nop,nop,TS val 3407635488 ecr 3407635471], length 11
 00:00:00.223164 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [P.], seq 1:12, ack 1, win 260, options [nop,nop,TS val 3407635695 ecr 3407635471], length 11
 00:00:00.431162 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [P.], seq 1:12, ack 1, win 260, options [nop,nop,TS val 3407635903 ecr 3407635471], length 11
 00:00:00.839162 IP 127.0.0.1.60382 > 127.0.0.1.1: Flags [P.], seq 1:12, ack 1, win 260, options [nop,nop,TS val 3407636311 ecr 3407635471], length 11
```

The logs indicate that the `Readiness` poll is returning `Pending` and will not wake up again until a TCP timeout occurs. It's common knowledge that each time we create a new `tokio::net::TcpStream`, we register an event source with Tokio's driver. When an event is emitted, the runtime polls our futures to advance their state. However, in this scenario, no event is being emitted, causing our future to wait indefinitely. In other words, from the application's perspective, this future is hanging in the runtime.

OpenDAL's TimeoutLayer operates under a flawed assumption. It attempts to enforce timeouts by merely storing an `Instant` and checking it each time the future is polled.

```rust
fn poll_read(&mut self, cx: &mut Context<'_>, buf: &mut [u8]) -> Poll<Result<usize>> {
    match self.start {
        Some(start) => {
            if start.elapsed() > self.timeout {
                // Clean up the start time before return ready.
                self.start = None;

                return Poll::Ready(Err(Error::new(
                    ErrorKind::Unexpected,
                    "operation timeout",
                )
                .with_operation(ReadOperation::Read)
                .with_context("timeout", self.timeout.as_secs_f64().to_string())
                .set_temporary()));
            }
        }
        None => {
            self.start = Some(Instant::now());
        }
    }

    match self.inner.poll_read(cx, buf) {
        Poll::Pending => Poll::Pending,
        Poll::Ready(v) => {
            self.start = None;
            Poll::Ready(v)
        }
    }
}
```

Once `poll_read` returns `Pending`, the future cannot wake up again. To properly implement a timeout, use an asynchronous sleep, such as:

```rust
#[inline]
fn poll_timeout(&mut self, cx: &mut Context<'_>, op: &'static str) -> Result<()> {
    if let Some(sleep) = self.sleep.as_mut() {
        match sleep.as_mut().poll(cx) {
            Poll::Pending => Ok(()),
            Poll::Ready(_) => {
                self.sleep = None;
                Err(
                    Error::new(ErrorKind::Unexpected, "io operation timeout reached")
                        .with_operation(op)
                        .with_context("io_timeout", self.timeout.as_secs_f64().to_string())
                        .set_temporary(),
                )
            }
        }
    } else {
        self.sleep = Some(Box::pin(tokio::time::sleep(self.timeout)));
        Ok(())
    }
}
```

The `tokio::time::sleep` function creates a new `Sleep` instance that serves as an event source, utilizing the tokio timer. This ensures that the future is awakened once the specified timeout elapses.

## Conclusion

The underlying issue stems from TCP timeouts during heavy traffic, while the immediate cause is that opendal has not implemented async timeout logic properly.

## Final Remarks

The cause is straightforward and the solution simple to apply. However, diagnosing issues in a large system can be challenging without the right tools. In our investigation, I found the following tools to be useful:

- [async-backtrace](https://github.com/tokio-rs/async-backtrace) to print backtrace for async stack
- ChatGPT to analyze large logs
- [tcpdump](https://www.tcpdump.org/) to capture TCP packets
- [iptables](https://linux.die.net/man/8/iptables) to simulate packet loss
- [pyo3](https://github.com/PyO3/pyo3) to integrate rust program into existing python debug scripts

A big thank you to everyone who helped me with this bug fixed:

- [@yufan](https://github.com/yufan022) for the report and invaluable assistance throughout the entire debugging process.
- [@majek](https://github.com/majek) for the fantastic blog post [When TCP Sockets Refuse to Die](https://blog.cloudflare.com/when-tcp-sockets-refuse-to-die) and corresponding scripts.
- [@dantengsky](https://github.com/dantengsky) for the right direction. Sorry for not fully understand from the beginning.
- [@zhang2014](https://github.com/zhang2014) for the brainstorm. Conversing with him led me to realize that it's related to TCP timeout.

Looking forward to our next journey!
