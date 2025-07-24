---
categories: Links
date: 2025-07-24T01:00:00Z
title: "RBIR: An Aurora DSQL story"
tags:
    - rust
    - rbir
---

I've been pinged by [@vaibhaw_vipul](https://x.com/vaibhaw_vipul) to read and share my thoughts on [Just make it scale: An Aurora DSQL story](https://www.allthingsdistributed.com/2025/05/just-make-it-scale-an-aurora-dsql-story.html). It's actually quite enjoyable. I agree with [@iavins](https://x.com/iavins)'s comment that "It's less about database development and more like a love letter to Rust."

I've talked about rewrite bigdata in rust (RBIR) quite a lot, and this article offers great examples for my theory: Rust is a good choice for data-intensive infrastructure. It's time for us to rewrite bigdata in Rust.

---

> While each database service we’ve launched has solved critical problems for our customers, we kept encountering a persistent challenge: how do you build a relational database that requires no infrastructure management and which scales automatically with load? One that combines the familiarity and power of SQL with genuine serverless scalability, seamless multi-region deployment, and zero operational overhead? Our previous attempts had each moved us closer to this goal. Aurora brought cloud-optimized storage and simplified operations, Aurora Serverless automated vertical scaling, but we knew we needed to go further. This wasn’t just about adding features or improving performance - it was about fundamentally rethinking what a cloud database could be.

As a brief background, [Aurora DSQL](https://aws.amazon.com/rds/aurora/) is a serverless, distributed SQL database built on [PostgreSQL](https://www.postgresql.org/). It is well-suited for global operations and highly consistent, distributed OLTP workloads. Comparable products include [Google Cloud Spanner](https://cloud.google.com/spanner), [CockroachDB](https://www.cockroachlabs.com/), and [TiDB](https://pingcap.com/).

> To validate our concerns, we ran simulation testing of the system – specifically modeling how our crossbar architecture would perform when scaling up the number of hosts, while accounting for occasional 1-second stalls. The results were sobering: with 40 hosts, instead of achieving the expected million TPS in the crossbar simulation, we were only hitting about 6,000 TPS. Even worse, our tail latency had exploded from an acceptable 1 second to a catastrophic 10 seconds. This wasn’t just an edge case - it was fundamental to our architecture. Every transaction had to read from multiple hosts, which meant that as we scaled up, the likelihood of encountering at least one GC pause during a transaction approached 100%. In other words, at scale, nearly every transaction would be affected by the worst-case latency of any single host in the system.

GC pauses are real. We talk about GC every day, which makes it seem like a well-solved problem, but it's not. In high-load distributed systems, this can be a serious issue that renders your system unusable. As the author mentioned: "they were very real problems we needed to solve"

> The language offered us predictable performance without garbage collection overhead, memory safety without sacrificing control, and zero-cost abstractions that let us write high-level code that compiled down to efficient machine instructions.

Well, it's boring, right? I know some friends who almost experienced PTSD when it comes to "memory safety", but please let me expand the discussion about memory safety in C and C++ one last time.

Many people treat this as a skill issue, claiming that it's possible to write memory-safe code in C and C++ as well. I believe them. I trust that they can write memory safe C in **right** projects, with the **right** people, at the **right** time.

I emphasize **right** here because I also recognize that they're human (correct me if I'm wrong!). Humans make mistakes. Some projects might lack documentation, so we may not realize we need to read within a 1024-byte limit; sometimes new team members join and aren't yet familiar with the hidden context; or there are days when we simply can't think clearly.

In other words, while we can write safe code in C or C++, Rust ensures our code is safe through zero-cost abstractions. That changes everything. As a reviewer, we no longer need to catch every pointer usage. Instead, we can focus on reviewing business logic.

Returning to the title of this article: just make it scale. Rust is a scalable language; it can grow with our team and our project's size.

> Rather than tackle the complex Crossbar implementation, we chose to start with the Adjudicator – a relatively simple component that sits in front of the journal and ensures only one transaction wins when there are conflicts. This was our team’s first foray into Rust, and we picked the Adjudicator for a few reasons: it was less complex than the Crossbar, we already had a Rust client for the journal, and we had an existing JVM (Kotlin) implementation to compare against.

Good choice.

I've seen many teams fail when migrating to Rust because they try to switch everything at once. They send out a team message saying, 'Hey everyone, we're rewriting everything in Rust now!' Soon after, they find their team burning out quickly: they need to learn an unfamiliar language to build features, and they still have to be oncall for the old services. It can be really tough.

Starting with a small project or module within your existing projects is always a great idea. It allows you to evaluate Rust's value and gives developers some time to learn Rust first.

> But after a few weeks, it compiled and the results surprised us. The code was 10x faster than our carefully tuned Kotlin implementation – despite no attempt to make it faster. To put this in perspective, we had spent years incrementally improving the Kotlin version from 2,000 to 3,000 transactions per second (TPS). The Rust version, written by Java developers who were new to the language, clocked 30,000 TPS.

I've decided not to comment on this too much. THIS IS RUST, guys.

> We decided to pivot and write the extensions in Rust. Given that the Rust code is interacting closely with Postgres APIs, it may seem like using Rust wouldn’t offer much of a memory safety advantage, but that turned out not to be true. The team was able to create abstractions that enforce safe patterns of memory access.

I wonder if they are using pgrx or simply building a Rust API against Postgre's C API.

> At first, things went well. We had both the data and control planes working as expected in isolation. However, once we started integrating them together, we started hitting problems. DSQL’s control plane does a lot more than CRUD operations, it’s the brain behind our hands-free operations and scaling, detecting when clusters get hot and orchestrating topology changes. To make all this work, the control plane has to share some amount of logic with the data plane. Best practice would be to create a shared library to avoid [“repeating ourselves”](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). But we couldn’t do that, because we were using different languages, which meant that sometimes the Kotlin and Rust versions of the code were slightly different.

I wonder if they've considered implementing it in Rust and exposing it through JNI. It seems natural to me, but I'm not sure why they didn't mention this option in the post.

> Rust turned out to be a great fit for DSQL. It gave us the control we needed to avoid tail latency in the core parts of the system, the flexibility to integrate with a C codebase like Postgres, and the high-level productivity we needed to stand up our control plane. We even wound up using Rust (via WebAssembly) to power our internal ops web page.

This statement reminds me of [Niko Matsakis](https://github.com/nikomatsakis)'s [Rust in 2025: Targeting foundational software](https://smallcultfollowing.com/babysteps/blog/2025/03/10/rust-2025-intro/).

**I see Rust's mission as making it dramatically easier to create and maintain foundational software.**

Rust is an excellent fit for foundational software like DSQL and your project!

> We assumed Rust would be lower productivity than a language like Java, but that turned out to be an illusion. There was definitely a learning curve, but once the team was ramped up, they moved just as fast as they ever had.

Given the popularity of code agent tools like Claude Code, I want to point out that Rust is especially well-suited for vibe coding.

It's quite easy for Claude Code to use tools like `cargo clippy` to build and fix compiler errors in Rust code. Users just need to provide the correct instructions for code agents. Once it builds and passes all tests, we can use it with confidence, without worrying about memory safety or runtime type mismatches.

Worth a try!

## Conclusion

Rust is hyped for solid reasons. It's a foundational language. Welcome it, embrace it, enjoy it!
