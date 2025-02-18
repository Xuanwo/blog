---
categories: Links
date: 2025-02-18T02:00:00Z
title: "BackON v1.4.0 Released"
tags:
    - rust
    - github
    - backon
---

I am happy to announce the release of [BackON v1.4.0](https://github.com/Xuanwo/backon/releases/tag/v1.4.0) [via archive.is](https://archive.is/U9DXda).

BackON is a rust library for making retry like a built-in feature provided by Rust.

```rust
use backon::ExponentialBuilder;
use backon::Retryable;

async fn fetch() -> Result<String> {
    Ok("hello, world!".to_string())
}

let content = fetch.retry(ExponentialBuilder::default()).await?;
```

The biggest change in this release was introduced by [@wackazong](https://github.com/wackazong), who correctly added `std` support for `no-std` without requiring a global random seed. With this improvement, users on `no-std` can now use `rand` properly as well.

[@NumberFour8](https://github.com/NumberFour8) brought us `futures-timer` support, allowing `backon` to be used in an async context without relying on Tokio. [@Matt3o12](https://github.com/Matt3o12) contributed by making some functions `const`, enabling many backoff builder APIs to be used in a `const` context.

Thank you all!

---

As of the v1.4.0 release, [BackON](https://github.com/Xuanwo/backon) is now:

- Used by 1.1k projects on GitHub
- Has 39 reverse dependencies on crates.io
- Downloaded approximately 5 million times, averaging 20k downloads per day

Thank you all for your trust—let's make retries feel like a built-in feature in Rust!

![](backon-data.png)
