---
categories: Code
date: 2025-06-29T01:00:00Z
title: "Thank you, Databend; Hello, LanceDB"
---

TL;DR: I'm leaving [Databend](https://github.com/datafuselabs/databend/) to join [LanceDB](https://github.com/lancedb/lance).

## Thank you, Databend

I still remember the day I spoke with [Bohu](https://github.com/BohuTANG) about joining Databend. It was a winter day with the sun shining brightly (Actually, I don't really remember if it was sunny and bright). We talked a bit about data warehouses, Rust, Snowflake, and open source. It was a time before AI, lakehouses, and table formats.

In the years at Databend, I went through my fastest growth both in life and in tech.

During my years at Databend, I married my wife, who has become the center of my life. We bought a cozy house near Tianjin, where we live with our two lovely dogs *(Naihu and Theo)* . Databend witnessed every major milestone in my personal life.

At the same time, Databend stood behind every milestone in my career.

- [1,762 commits](https://github.com/databendlabs/databend/commits?author=Xuanwo)
- [548 PRs](https://github.com/databendlabs/databend/issues?q=sort%3Aupdated-desc%20state%3Amerged%20is%3Apr%20author%3A%40me)
- [opendal](https://github.com/apache/opendal), [reqsign](https://github.com/Xuanwo/reqsign), [iceberg-rust](https://github.com/apache/iceberg-rust), [backon](https://github.com/Xuanwo/backon) ...

OpenDAL entered and then graduated from the ASF Incubator; I was nominated as an ASF Member, and I was invited as a committer for iceberg-rust, etc. If QingCloud was a school that taught me how to work, then Databend is the place that allowed me to shine and fully realize my potential.

Databend is now entering a new and steadier phase, exactly what we set out to build back in that Rust-and-Snowflake conversation with Bohu. My heartbeat is still synced to the 0 → 1 phase. Designing protocols, chasing regressions, turning bold ideas into first commits. So I chose to hand over my modules while everything is smooth. I leave with deep gratitude, knowing that Databend's codebase, and the friendships behind it, will continue to grow long after I step aside.

My next adventure is LanceDB, where vector lakes meet Rust. Different waves, same ocean.

## Hello, LanceDB

Readers may know that my personal vision is [Data Freedom](https://xuanwo.io/2024/04-xuanwo-vision/), and I am currently working on [Rewriting Big Data in Rust](https://xuanwo.io/2024/07-rewrite-bigdata-in-rust/). I really don't want to work at a big tech company (honestly, I'm not sure I could pass the interview), and I also don't want to become a competitor to Databend (even though they haven't asked me to sign an NCC—I just don't want to).

LanceDB appeared: LanceDB is an open-source multimodal database designed for efficient storage, retrieval, and management of vectors and multimodal data. It's quite appealing to me to create a new format that could set the standard for the new AI era. Concretely, Lance's columnar container layout and on-disk HNSW index open a playground for Rust-level SIMD tuning, exactly the kind of hard-core storage work I've been missing. I would have the opportunity to work on low-level storage optimizations to support vector search and unstructured data storage. This would also be a great chance to learn many new things.

LanceDB is strongly committed to open source. By joining LanceDB, I could stay active in many open source communities like opendal, arrow, datafusion, iceberg, and even databend in the future. I could still connect them all to build something truly fantastic.

Joining LanceDB feels like the most straightforward way to achieve that vision of Data Freedom, one vector at a time.

---

TL;DR in one line: grateful waves goodbye, curious waves hello. See you at the next PR review — perhaps in LanceDB, perhaps back in Databend, always in open source.
