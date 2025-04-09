---
categories: Links
date: 2025-04-09T01:00:00Z
title: "BackON v1.5.0 Released"
tags:
    - rust
    - github
    - backon
---

I am happy to announce the release of [BackON v1.5.0](https://github.com/Xuanwo/backon/releases/tag/v1.5.0).

BackON is a rust library for making retry like a built-in feature provided by Rust.

```rust
use backon::ExponentialBuilder;
use backon::Retryable;

async fn fetch() -> Result<String> {
    Ok("hello, world!".to_string())
}

let content = fetch.retry(ExponentialBuilder::default()).await?;
```

This release adds a new API called [`adjust()`](https://docs.rs/backon/latest/backon/struct.Retry.html#method.adjust), which allows you to modify the backoff time for the next retry. This is useful when you want to adjust the backoff duration based on the result of the previous attempt or implement a dynamic backoff strategy based on an HTTP `Retry-After` header.

For example:

```rust
use core::time::Duration;
use std::error::Error;
use std::fmt::Display;
use std::fmt::Formatter;

use anyhow::Result;
use backon::ExponentialBuilder;
use backon::Retryable;
use reqwest::header::HeaderMap;
use reqwest::StatusCode;

#[derive(Debug)]
struct HttpError {
    headers: HeaderMap,
}

impl Display for HttpError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "http error")
    }
}

impl Error for HttpError {}

async fn fetch() -> Result<String> {
    let resp = reqwest::get("https://www.rust-lang.org").await?;
    if resp.status() != StatusCode::OK {
        let source = HttpError {
            headers: resp.headers().clone(),
        };
        return Err(anyhow::Error::new(source));
    }
    Ok(resp.text().await?)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    let content = fetch
        .retry(ExponentialBuilder::default())
        .adjust(|err, dur| {
            match err.downcast_ref::<HttpError>() {
                Some(v) => {
                    if let Some(retry_after) = v.headers.get("Retry-After") {
                        // Parse the Retry-After header and adjust the backoff duration
                        let retry_after = retry_after.to_str().unwrap_or("0");
                        let retry_after = retry_after.parse::<u64>().unwrap_or(0);
                        Some(Duration::from_secs(retry_after))
                    } else {
                        dur
                    }
                }
                None => dur,
            }
        })
        .await?;
    println!("fetch succeeded: {}", content);

    Ok(())
}
```

Hope you enjoy this feature. Thank you, everyone!

---

As of the v1.5.0 release, [BackON](https://github.com/Xuanwo/backon) is now:

- Used by 1.5k projects on GitHub
- Has 50 reverse dependencies on crates.io
- Downloaded approximately 6.3 million times, averaging 60k downloads per day

Thank you all for your trust—let's make retries feel like a built-in feature in Rust!

![](backon-data.png)
