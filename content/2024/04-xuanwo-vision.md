---
categories: Code
date: 2024-07-06T01:00:00Z
title: "Xuanwo's VISION: Data Freedom"
tags:
    - rust
    - open-source
---

After many years of coding, my passion for the field has grown stronger, and I've become clearer about my interests and the areas I want to explore. I've discussed this with many friends, and today, I'm writing it down to clarify my thoughts further. This will also serve as a guideline for me to make decisions in the future.

## What

My vision is `Data Freedom`. I aim to create an ecosystem where users can access any data, across any service, using any method, in any language.

### Access ANY Data

Users SHOULD be able to access data in ANY format, including JSON, Parquet, ORC, XML, XLSX, BLOB, etc.

### Across ANY Service

Users SHOULD be able to access, transfer, and control data across ANY service such as S3, GCS, Azblob, HDFS, Google Drive, Dropbox, IPFS, WebDAV, MySQL, PostgreSQL, etc.

### By ANY Method

Users SHOULD be able to access data through ANY method, including [SQL](https://en.wikipedia.org/wiki/SQL), [DataFrames](https://en.wikipedia.org/wiki/Pandas\_\\(software\\)#DataFrames), HTTP, gRPC, [FTP](https://en.wikipedia.org/wiki/File_Transfer_Protocol), [WebDAV](https://en.wikipedia.org/wiki/WebDAV), [FUSE](https://en.wikipedia.org/wiki/Filesystem_in_Userspace), etc.

### In ANY Language

Users should be able to access data using any programming language, such as Rust, Python, Node.js, Java, C, C++, Zig, WASM etc.

## How

Talk is cheap.

How can I advance my vision instead of just dreaming and typing away? Currently, I'm focusing on `RBIR`: `Rewriting Bigdata in Rust`. I’m working hard to develop projects by using Rust in open-source for big data.

### By Rust

Although Rust has many shortcomings, I still love Rust. I believe Rust is the right choice to make vision come true. I can build a core in Rust and extend bindings to Python, Node.js, Java, and many other languages.

For the same reason I love Rust, I don’t like Java and Go. Utilizing a service developed in Java is extremely challenging. It's even more problematic if this service offers only native Java or Go clients. To use this service, I must first rewrite its client in Rust.

### In Open Source

I will develop all projects as open source. Open source is the right and only way to realize my vision. I can't impact more than one million users with private, commercial products. However, by continuing to build open-source projects, I can change the world.

I aim to work for companies that share aspects of my vision for life. For instance, [Databend Labs](https://github.com/datafuselabs/databend/) is committed to developing an open-source cloud data warehouse with fast query execution and data ingestion. I’m working with them to maintain and implement features aligned with my vision.

In addition to maintaining Databend, I also participate in the following open-source project:

- [opendal](https://github.com/apache/opendal): a unified data access layer, empowering users to seamlessly and efficiently retrieve data from diverse storage services
- [iceberg-rust](https://github.com/apache/iceberg-rust): Rust implementation of [Apache Iceberg](https://iceberg.apache.org/).
- [paimon-rust](https://github.com/apache/paimon-rust): The rust implementation of [Apache Paimon](https://paimon.apache.org/).
- [arrow-rs](https://github.com/apache/arrow-rs): Official Rust implementation of [Apache Arrow](https://arrow.apache.org/).
- [fury-rs](https://github.com/apache/fury): A blazingly fast multi-language serialization framework powered by JIT and zero-copy.

## Next

My vision is unlikely to be realized in my generation or during my lifetime. That's fine and expected. It's an incredibly exciting journey that I'm willing to dedicate my life to.

This journey will be more interesting with many friends around. So if our visions align in some part, feel free to get in touch so we can collaborate.

For example:

- I'm an ASF Member, Apache OpenDAL PMC Chair, and a mentor at the Apache Incubator. If you have projects that align with my vision and are interested in bringing them to the Apache Incubator, please contact me.
- I actively contribute to many Rust projects. If you're interested in learning Rust and joining the `RBIR` journey, please contact me.
- I'm a believer of open source. If you're developing one that aligns with my vision, please contact me; I'm willing to offer some help.
- Last but not least: I'm not a native English speaker and am currently practicing my English. If you're interested in having an English conversation with me, I would really appreciate it. Please contact me.

So, this is my VISION: `Data Freedom`. Let's rock!
