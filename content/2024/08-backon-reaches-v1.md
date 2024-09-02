---
categories: Code
date: 2024-09-02T01:00:00Z
title: "BackON Reaches v1"
tags:
    - rust
    - open-source
---

[BackON](https://github.com/Xuanwo/backon), a crate designed to make retrying a built-in feature in Rust, has now reached v1.

This post aims to introduce the problems BackON addresses, why we need it, and what's next for the project.

## What's BackON?

BackON is a rust retry library with the following features:

- Supports retrying both blocking and asynchronous functions.
- Allows control over retry behavior, such as [when to retry](https://docs.rs/backon/latest/backon/struct.Retry.html#method.when) and [what to do before a retry](https://docs.rs/backon/latest/backon/struct.Retry.html#method.notify).
- Supports custom retry strategies like [exponential](https://docs.rs/backon/latest/backon/struct.ExponentialBuilder.html), [fibonacci](https://docs.rs/backon/latest/backon/struct.FibonacciBuilder.html), [constant](https://docs.rs/backon/latest/backon/struct.ConstantBuilder.html), etc.

What sets BackON apart from other retry libraries is its API design.

Let's take an example:

```rust
use anyhow::Result;
use backon::ExponentialBuilder;
use backon::Retryable;

async fn fetch() -> Result<String> {
    Ok("hello, world!".to_string())
}

#[tokio::main]
async fn main() -> Result<()> {
    let content = fetch
        // Retry with exponential backoff
        .retry(ExponentialBuilder::default())
        // Sleep implementation, required if no feature has been enabled
        .sleep(tokio::time::sleep)
        // When to retry
        .when(|e| e.to_string() == "EOF")
        // Notify when retrying
        .notify(|err: &anyhow::Error, dur: Duration| {
            println!("retrying {:?} after {:?}", err, dur);
        })
        .await?;
    println!("fetch succeeded: {}", content);

    Ok(())
}
```

*More examples can be found at [`backon::docs::examples`](https://docs.rs/backon/1.1.0/backon/docs/examples/index.html).*

BackON adds a `retry` function for all `FnMut() -> impl Future<Output=Result<T>>`, which returns a new `Future` that produces the same result. Users can control the retry strategy by providing a backoff, specifying the timing for retries, and defining the actions to take during retries.

BackON's vision is to make retrying as seamless as a built-in feature in Rust. It aims to become the default choice for retrying, similar to how `serde` is for serialization and deserialization in Rust.

## Why we need BackON?

Compared to other existing retry libraries, BackON offers the following advantages:

- Zero cost: No allocation occurs except in the `sleep` implementation.
- WASM compatibility: BackON can be used within a WASM target.
- `no_std` support: BackON can operate without the `std`; users only need to provide their own sleeper implementation.
- No additional errors: BackON does not introduce new errors, so users do not need to adapt their error handling logic.

BackON employs a variety of generic techniques with Rust's type system, which leads to some drawbacks:

Due to rust's limitations, BackON cannot directly `retry` a function with arguments. Users need to create a closure to capture it as a `FnMut() -> impl Future<Output=Result<T>>` instead.

```rust
use anyhow::Result;
use backon::ExponentialBuilder;
use backon::Retryable;

async fn fetch(url: &str) -> Result<String> {
    Ok(reqwest::get(url).await?.text().await?)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    let content = (|| async { fetch("https://www.rust-lang.org").await })
        .retry(ExponentialBuilder::default())
        .await?;

    println!("fetch succeeded: {}", content);
    Ok(())
}
```

Users must be aware of this pattern; otherwise, they will encounter incomprehensible errors.

## What's next?

After BackON reaches version 1.0, I promise not to disrupt users unless I decide to develop a 2.0 release.

I still have some great ideas I want to implement in `v1.x`:

- [Provide native integration with tower/axum/reqwest/...](https://github.com/Xuanwo/backon/issues/101)
- [Explore `fn_traits` / `tuple_traits`](https://github.com/Xuanwo/backon/issues/96) to see if we can retry a function with arguments
- [Explore `async_fn_traits`](https://github.com/Xuanwo/backon/issues/97) to see if we can offer better syntax for async functions
- [Potential for dynamic backoffs](https://github.com/Xuanwo/backon/issues/63) to see how we can better support dynamic backoffs, such as tracking the `Retry-After` header.

The last and most important one is [Call for maintainers](https://github.com/Xuanwo/backon/issues/100).

> I will continue to maintain this project and have no plans to stop working on it for now. However, it's crucial to bring more maintainers on board before things become unmanageable. This scenario has played out too often...

As described in the issue, there are many retry libraries left unmaintained on crates.io. I am determined not to let BackON become one of them. Please contact me if you are interested.

That's all. Please try and evaluate BackON in your use cases and provide feedback. Thanks!
