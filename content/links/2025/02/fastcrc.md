---
categories: Links
date: 2025-02-18T01:00:00Z
title: "Start building fastcrc"
tags:
    - rust
    - github
---

I wrote [Why should fastcrc exist?](https://github.com/fast/fastcrc/issues/1) [via archive.is](https://archive.is/x7oha) to start building fastcrc.

---

I encountered this problem while implementing `crc64/nvem` for S3 storage. However, I found that the existing implementations were all in poor shape. Instead of simply forking and fixing a single crate, I decided to improve the entire Rust CRC ecosystem by creating fastcrc—a repository that consolidates all CRC implementations, similar to [RustCrypto/hashes](https://github.com/RustCrypto/hashes).

In this way, we can ensure that:

> All CRC implementations will share the same core (if possible), the same dependencies, provide the similiar API, and will be maintained by the same group.

By the way, [the Fast Labs](https://github.com/fast) is a real thing. We have built many fast projects like [fastrace](https://github.com/fast/fastrace), [fastimer](https://github.com/fast/fastimer), [fastant](https://github.com/fast/fastant) and [logforth](https://github.com/fast/logforth). Welcome to join us!
