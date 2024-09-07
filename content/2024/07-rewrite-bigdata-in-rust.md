![image](https://github.com/user-attachments/assets/ac07c4ca-e820-44ec-a22e-1a7e9c755c38)---
categories: Code
date: 2024-08-16T01:00:00Z
title: "Rewrite Bigdata in Rust"
tags:
    - rust
    - open-source
---

Rust is gaining popularity in data infrastructure, with more new systems being built using it. I refer to this trend as "Rewrite Bigdata in Rust" (RBIR) and am [fully dedicating my energy to it](https://xuanwo.io/2024/04-xuanwo-vision/). This post aims to explain what RBIR is, why it occurred, and how to join.

## What RBIR is

RBIR plans to build a big data ecosystem using Rust. RBIR includes three methods.

### New project

The most straightforward approach is to start a new project written in Rust. Most of the time, these projects are alternatives to existing ones.

For example:

- [tikv](https://github.com/tikv/tikv): Distributed transactional key-value database.
- [databend](https://github.com/datafuselabs/databend/): a rust data warehouse, alternative to [Snowflake](https://www.snowflake.com/en/).
- [quickwit](https://github.com/quickwit-oss/quickwit): a rust search engine, alternative to [Elasticsearch](https://www.elastic.co/elasticsearch).
- [risingwave](https://github.com/risingwavelabs/risingwave): a rust streaming processing engine.
- [Apache DataFusion](https://github.com/apache/datafusion): a fast, extensible query engine built in rust.
- [influxdb](https://github.com/influxdata/influxdb): scalable datastore for metrics, events, and real-time analytics.
- [greptimedb](https://github.com/GreptimeTeam/greptimedb): time series database for metrics, logs and events.
- [horaedb](https://github.com/apache/horaedb): a high-performance, distributed, cloud native time-series database.
- [paradedb](https://github.com/paradedb/paradedb): Postgres for Search and Analytics
- [glaredb](https://github.com/GlareDB/glaredb): An analytics DBMS for distributed data
- [fluvio](https://github.com/infinyon/fluvio): Lean and mean distributed stream processing system
- [lancedb](https://github.com/lancedb/lancedb): Developer-friendly, database for multimodal AI
- [slatedb](https://github.com/slatedb/slatedb): A cloud native embedded storage engine built on object storage
- [daft](https://github.com/Eventual-Inc/Daft): Distributed DataFrame for Python designed for the cloud, powered by Rust

RBIR will develop numerous new Rust projects in bigdata area. Consider this: most of the projects in the upcoming [CMU Database Building Blocks Seminar Series](https://db.cs.cmu.edu/seminar2024/) are written in Rust!

### New implementation

RBIR is also involved in having new implementations for existing projects.

For instance:

- [arrow-rs](https://github.com/apache/arrow-rs): Rust implementation of [Apache Arrow](https://arrow.apache.org/).
- [iceberg-rust](https://github.com/apache/iceberg-rust/): Rust implementation of [Apache Iceberg](https://iceberg.apache.org/).
- [paimon-rust](https://github.com/apache/paimon-rust): Rust implementation of [Apache Paimon](https://paimon.apache.org/).
- [hudi-rs](https://github.com/apache/hudi-rs): Rust implementation of [Apache Hudi](https://hudi.apache.org/).
- [parquet-rs](https://github.com/apache/arrow-rs/tree/master/parquet): Rust implementation of [Apache Parquet](https://parquet.apache.org/).
- [avro-rust](https://github.com/apache/avro/tree/main/lang/rust): Rust implementation of [Apache Avro](https://avro.apache.org/).
- [orc-rs](https://github.com/datafusion-contrib/datafusion-orc): Rust implementation of [Apache ORC](https://orc.apache.org/).

RBIR will introduce native Rust support for a wider range of longstanding big data projects.

### New integration

The least obvious, but perhaps the most versatile way, is to build integration using Rust.

For example, export to another language using Rust core.

- [Apache OpenDAL](https://github.com/apache/opendal) provides python, nodejs, java, go bindings.
- Iceberg is now working on [building rust core for pyiceberg](https://github.com/apache/iceberg-rust/pull/518).
- Paimon is going to [build paimon-py by its rust core](https://lists.apache.org/thread/q3zxcomfq441t6o8y8dslos1qvb984j0).
- [Apache DataFusion Comet](https://github.com/apache/datafusion-comet) is a high-performance accelerator for Apache Spark.

RBIR will introduce a rust-powered core for other languages, enabling the larger data ecosystem to benefit from this trend.

## Why RBIR Occurred

So why did RBIR happen? Let's skip the marketing jargon about memory safety, performance, and thread safety. I know all readers of this post must have seen those countless times.

The aspect I think about RBIR is the community supporting it.

Rust is HOT. Developers want to learn Rust. There are many talented individuals, companies, and resources in this field. The production rate in the Rust community is extremely high, capable of powering numerous new projects.

Let’s use Arrow as a simple example. The [Arrow](https://github.com/apache/arrow) project, which has C++, C#, Go, Java, JavaScript, and Python implementations, has 1,078 contributors. However, [arrow-rs](https://github.com/apache/arrow-rs), the repository with only a Rust implementation, has 856 contributors. It’s much easier for a Rust project to attract contributors.

Another perspective is that RBIR offers an excellent ROI (return on investment).

First, building things in Rust is simple, thanks to its excellent toolchain: Cargo, rustfmt, and Clippy. The community is welcoming, making it easy to join a project and start building immediately. There's no need for Make, CMake, Ninja, or Maven—just Cargo.

Secondly, exposing things from Rust is simple. Once the community has established a Rust core, it can be exposed to Python via [PyO3](https://pyo3.rs/), to Node.js via [NAPI](https://napi.rs/), to Ruby via [magnus](https://github.com/matsadler/magnus), to Java via [jni-rs](https://github.com/jni-rs/jni-rs), and to C via [cbindgen](https://github.com/mozilla/cbindgen). This allows the community to avoid spending time developing from scratch while still sharing native performance.



## How to join RBIR

All people are welcome to join RBIR. Here are some ways to get involved:

- To those already working in this area, you are doing great; just keep up the good work.
- To those interested in joining RBIR, please feel free to check out the projects mentioned in this post or contact me directly. I'm eager to work with you.
- For those who prefer to work with languages they are familiar with, that's still great. RBIR doesn't aim to replace your positions. Instead, it offers you another option. For instance, what if part of the project is written in Rust? Like the FileIO, the Catalog, or even the SDKs? Feel free to reach out; I'm happy to collaborate.

RBIR aims to solve real problems and benefit the public. This post is not a challenge to other languages, nor is it suggesting that Rust will replace them. Rather, this post is a call for collaboration: how can we improve our systems? What about RBIR even for the smallest module?

Thank you all for reading; I look forward to building the future together with you all.
