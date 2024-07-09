---
categories: Code
date: 2024-07-09T01:00:00Z
title: "From icelake to Iceberg Rust"
tags:
    - rust
    - open-source
    - iceberg
---

## TL;DR

[Icelake](https://github.com/icelake-io/icelake) has been sunset, use [iceberg-rust](https://github.com/apache/iceberg-rust) instead.

Iceberg-rust is a community-driven project that all icelake contributors have transitioned to. It covers all the features previously offered by icelake and is the official implementation of Apache Iceberg.

## Introducation

I'm going to share the history behind icelake and iceberg-rust. This post will serve as a record of how an open community works: people unite by a common goal and work together. It’s the original power of open source which always draws me in.

[Iceberg](https://iceberg.apache.org/) is a high-performance format for huge analytic tables. It is widely used around the world and supported by nearly all query engines. Users can write SQL to query data from an Iceberg table stored at object storage services without ingesting it into a database first.

Iceberg lacked an official Rust implementation for a long time, marking the beginning of our story.

## Icelake In Databend

We've talked a lot at [Databend](https://github.com/datafuselabs/databend/) about supporting open table formats, and I'm a huge fan of them, especially Iceberg. There are a few iceberg bindings out there, but none are quite ready to go. So, I decided to start my own project called [icelake](https://github.com/icelake-io/icelake). The main idea behind icelake is to build an open lake implementation that can work with any table format, including [Iceberg](https://iceberg.apache.org/), [Hudi](https://hudi.apache.org/), and [Delta](https://delta.io/).

This project is sponsored by [Databend Labs](https://github.com/datafuselabs/databend). Due to high demand, our initial focus will be on Iceberg support.

Thanks to the detailed [iceberg table specification](https://iceberg.apache.org/spec/). It took me about a week to implement the iceberg spec. I learned a great deal about how table formats function. I've successfully got the iceberg table read operations working in Databend!

## Icelake With RisingWave

At ASF, we often emphasize [Community Over Code](https://www.apache.org/theapacheway/). After creating a working demo, my first priority is to find another user. Fortunately, I discovered that [RisingWave](https://github.com/risingwavelabs/risingwave) is also working on Iceberg support. They have already used [Apache OpenDAL](https://github.com/apache/opendal), so we have some connections within RisingWave. I reached out to them directly to discuss icelake and invited them to join the development.

Here's how I met [Renjie](https://github.com/liurenjie1024). We both share the vision of rewriting the big data ecosystem in rust. It makes me feel great to work together with him. After several discussions, Renjie decided to incorporate icelake into RisingWave. He and [ZENOTME](https://github.com/ZENOTME) joined icelake as maintainers, where they fixed numerous bugs and added write support. RisingWave then implemented an Iceberg sink based on icelake.

## Born of Iceberg Rust

During the development of icelake, some people also recognized the need for native rust support for Iceberg. [Brian Olsen](https://github.com/bitsondatadev) initiated a discussion about [the rust support](https://lists.apache.org/thread/7njzq6b0m9qbjmbtgrtkhmj2nnmhso4t). [Jan Kaul](https://github.com/JanKaul), the maintainer of an [Iceberg Rust implementation](https://github.com/JanKaul/iceberg-rust), joined in and highlighted the existence of icelake. He also mentioned that:

> It was a great timing to start a rust project in the official apache iceberg repository that we can all work on together.

The discussion later shifted to [iceberg slack](https://apache-iceberg.slack.com/archives/C03LG1D563F/p1689284684405389), where more Iceberg PMC members and committers joined. Jan Kaul invited Renjie and me to join the conversation about Iceberg—thanks a lot!

We spent some time discussing the repository location and had an [online meeting](https://hackmd.io/@xuanwo/iceberg-rust). We met Jan Kual and [Fokko](https://github.com/Fokko). It's incredibly rewarding to connect with people who share the same goals. Although we had never met before, our common objectives allow us to collaborate effectively. What a beautiful aspect of the open source community!

Shortly after the meeting, Fokko helped us establish the [#rust Slack channel](https://join.slack.com/t/apache-iceberg/shared_invite/zt-1zbov3k6e-KtJfoaxp97YfX6dPz1Bk7A) and the iceberg-rust repository. The iceberg rust project was launched, *on my birthday* (20th July, with some time zone shifts).

## Grow of Iceberg Rust

After establishing the Iceberg Rust repository, we set up the contribution workflow, CI actions, and release scripts. We added full spec implementations and arrow integrations.

As development progressed, more people joined our team including [marvinlanhenke](https://github.com/marvinlanhenke), [sdd](https://github.com/sdd), [viirya](https://github.com/viirya), [odysa](https://github.com/odysa), along with 30 others! In less than a year, we attracted **43** contributors and made an [official ASF release](https://rust.iceberg.apache.org/download.html). Renjie was honored as the first Iceberg committer from the Iceberg Rust project. He also represented the project at the first Iceberg Summit: [Brings Apache Iceberg into Rust World](https://www.youtube.com/watch?v=B9On7iDZAdE&list=PLkifVhhWtccxBSrKFPXOmjAFFEpeYii5K&index=7)!


## Sunset of icelake

At the time of writing, Iceberg Rust covers all features previously provided by icelake and is now the official implementation of Apache Iceberg. Several major users of icelake have been or are currently transitioning to Iceberg Rust.

It's time to phase out the icelake project to make way for Iceberg Rust. On behalf of all icelake committers, I announce that we have officially sunsetted icelake. It will no longer be maintained, and all current users should now migrate to Iceberg Rust.

Thank you to all the contributors and users of icelake; it has been a great honor having your support along this journey.

## Future of Iceberg Rust

Currently, the Iceberg Rust community is working on its 0.3 release. This version will include most of the functionality users need to read and write an Iceberg table. We encourage everyone interested in using Iceberg with Rust to try it out and provide us with feedback.

In the next release, we will integrate native support for DataFusion and enhance the experience to connect other query engines with Iceberg, such as [Databend](https://github.com/datafuselabs/databend/). Perhaps we can explore new areas that support iceberg-nodejs or iceberg wasm. There are many interesting fields to discover!

## Conclusion

That's all. Thank you, everyone, for helping to build iceberg-rust. I'm looking forward to contributing more in this area. Feel free to contact me if you're interested as well; I’m happy to provide assistance.
