---
categories: Daily
date: 2023-03-31T01:00:00Z
title: "BeyondStorage: why we failed"
tags:
    - rust
    - golang
    - opendal
---

I mentioned the story of my failure in Qingyun in my [2021 Annual Review](https://xuanwo.io/2021/11-2021-review/). At that time, I blamed the project's failure on conflicting interests with the company and left behind a bunch of vague conclusions filled with resentment. Now, more than a year has passed and I have embarked on a new journey. It is time to review the reasons for my past failures, reflect on them, and learn from those experiences.

## Background

[BeyondStorage](https://github.com/beyondstorage/go-storage) aims to create an open-source community for cross-cloud data services. The plan is to build a universal storage repository in a completely open-source manner, which can connect with various storage services and encapsulate multiple applications such as data migration, backup, and management. This way, application developers only need to develop once to run their applications on any storage service, while users can freely choose the location of their data storage.

![](architecture.svg)

Based on the unified data access interface provided by BeyondStorage, we can provide the following services:
- Provide storage gateway to support users accessing data in storage services through multiple protocols
  - Users can directly access files on a cloud host via FTP protocol
- Provide online data migration service, supporting users to migrate data between any storage services
  - Users can migrate data from private clouds to object storage
- Provide online backup service, supporting users to back up their data to storage services
  - Users can use Time Machine on macOS to back up their data to object storage.

It is not difficult to find that its vision is basically consistent with [OpenDAL](https://github.com/apache/incubator-opendal), but why do the two projects have such a big difference in development at almost the same time?

## Root cause: No users

Active users are the lifeblood of an open source project. In my opinion, the fundamental reason for BeyondStorage's failure is the lack of users. Without users, there are no real user needs, and the direction of project development can only rely on my personal feelings (which have proven to be very unreliable).

BeyondStorage built go-storage to meet migration service needs, and migration service needs come from a natural extension of go-storage capabilities. It is easy to see that this logic creates a terrible cycle where there is no real user participation in the chain, and the project has been running in the wrong direction since its inception. For quite some time, BeyondStorage has been constantly refactoring and designing new abstract frameworks for various purposes, all with the goal of more elegantly implementing specific requirements. For example, BeyondStorage designed a complete Metadata framework to describe all operations and their parameters supported by a service and developed an independent code generator to generate related code. This framework was refactored three times in just a few months. Reasonable abstraction is certainly important but it must be based on real needs. Furthermore, refactoring should be done as much as possible while implementing functionality rather than simply for refactoring's sake.

OpenDAL's luckiest aspect is that it incubated from [Databend](https://github.com/datafuselabs/databend/)'s real-world scenarios. Databend continuously presents new requirements which help me judge their necessity adjust task priorities and correct erroneous assumptions. For example, I used to think that applications would only perform continuous data reads without seeking requirements; however Databend actually requires OpenDAL to provide native read & seek support.

In addition to these requirements themselves,Databend itself has many users deployed in different environments with varying configurations who provide feedback on bugs and usability issues encountered when using OpenDAL.These feedbacks helped OpenDAL mature quickly into a production-ready project that effectively addressed user demands and could be quickly promoted to similar user scenarios.

## Secondary reason: wrong direction

The secondary reason for BeyondStorage's failure was the wrong tactical choices. BeyondStorage was not unaware of the problem of lack of users, and in fact, I also tried to propose using BeyondStorage as underlying storage for projects such as [tidb](https://github.com/pingcap/tidb), but these attempts ultimately failed.

Looking back now, I made the following mistakes in the specific execution process:

### Incorrect User

TiDB is not a suitable project for BeyondStorage at its current development stage. Often, we assume that there are high and low demands, and as long as we implement stronger versions of the requirements, weaker ones will naturally be fulfilled. Therefore, we should prioritize meeting stronger demands. The idea of choosing TiDB as the main direction is also like this: if I can handle TiDB well, aren't the requirements of other projects a piece of cake? In fact, it's not true. TiDB uses many features that BeyondStorage does not yet support. During the process of implementing these requirements, we repeatedly found problems with BeyondStorage's abstraction and started round after round of refactoring until the BeyondStorage community became completely inactive without us being able to add support for it in TiDB.

The first user actively chosen by OpenDAL was [sccache](https://github.com/mozilla/sccache/), which is a ccache-like compilation caching tool that supports uploading caches to different storage services. Its requirement for storage service capabilities is very simple - only read and write are needed - so no additional functionality needs to be added to OpenDAL to support it.

### Wrong Approach

Another major mistake was choosing the wrong integration approach. In the process of integrating BeyondStorage, I mistakenly chose a one-time replacement approach, replacing all places where TiDB accesses object storage with BeyondStorage. This introduced a lot of changes and quickly made the complexity of the entire integration work out of control. In fact, a better approach is to gradually replace it, modifying only one service at a time. On the one hand, this makes it easier to review; on the other hand, it also makes the complexity and progress of the entire project more controllable.

OpenDAL learned this lesson deeply in its integration with sccache. Each modification was limited to 100 lines and single PRs could be successfully merged within about a week. Furthermore, in its integration with Vector, OpenDAL adopted an incremental addition approach to run through complete reviews and release processes which enhanced maintainers' confidence in OpenDAL so that when users have new storage needs they will prioritize using OpenDAL for support.

## Direct Cause: Losing the Main Sponsor

The main reason for BeyondStorage's failure was losing its biggest sponsor, QingCloud Technology. All maintainers of BeyondStorage were employees of QingCloud and their salaries were paid by QingCloud. When QingCloud dissolved the team, even though the project remained open source, it effectively died because all maintainers had left. So how did BeyondStorage gradually lose its sponsor's favor?

Firstly, QingCloud had no projects that depended on BeyondStorage. As discussed earlier, as a cloud service provider, all of its businesses had no dependency on BeyondStorage. On the contrary, to some extent, the development and growth of BeyondStorage would affect QingCloud's own interests.

Secondly, although QingCloud saw potential in BeyondStorage's future prospects, this potential was realized too slowly. It took an entire year for BeyondStorage to deliver any mature products. We had a complete team with talents in research and development (R&D), front-end design and marketing; but in the end we could only barely launch a front-end that couldn't run actual business operations. The most optimistic estimate internally was that it would take another year to go online and generate revenue which seemed far-fetched.

Finally, at the end of 2021 when winter approached with budget cuts looming over them along with layoffs and organizational restructuring underway at Qingcloud Technology - there were multiple possible directions for where beyond storage could go next but none of department leaders held much hope for this project’s future prospects so I myself sounded retreats deciding not to persist anymore.

## Other reasons

In addition to the above reasons, BeyondStorage has made all the mistakes that a new open source team might make:

- Blindly expanding projects: BeyondStorage blindly started multiple branch projects such as beyond-tp, beyond-fs and beyond-ftp before go-storage had made any progress.

- Excessive community operations: In order to pursue star numbers and contributor numbers for the project, they participated in various activities to increase exposure and established PMC. However, these were just short-lived hype leaving nothing behind.

- Premature splitting of projects: The project was split into many subprojects in its early development stage, causing developers from different projects to fight against each other.

- Overemphasizing details: They focused too much on implementation details when the project was not yet mature enough and considered a large number of boundary cases which delayed the launch time of functions.

## Lessons Learned for OpenDAL

Standing on the shoulders of BeyondStorage, OpenDAL has established its own development philosophy:

- Focus on user needs: Actively integrate OpenDAL into user projects, pay attention to real needs, and reject requests for "it would be better if we had it".
- Avoid premature optimization: Do not pursue introducing large and complex frameworks or excessively pursuing implementation details unless similar user requirements arise that do not affect overall quality.
- Monorepo: Simplify workflow by maintaining a unified monorepo and reduce the burden of developers switching between different projects.
- No community operation: OpenDAL does not have dedicated community operators or organize various community activities. It focuses on meeting user needs.
- Ultra-fast feedback: Always insist on giving contributors quick feedback and completing operations such as PR review/merge/close in the shortest possible time.

## Summary

In this article, I summarized the failure of BeyondStorage as follows:

- Root cause: no users
- Secondary cause: wrong direction
- Direct cause: loss of funding

Unfortunately, like countless other open source projects, [BeyondStorage](https://github.com/beyondstorage/go-storage) has died. However, its spirit and ideas are fortunately able to continue in [OpenDAL](https://github.com/apache/incubator-opendal). I hope everyone can learn from the failures of the BeyondStorage community and help more open source projects survive. This way, BeyondStorage can achieve immortality like [RethinkDB](https://www.defmacro.org/2017/01/18/why-rethinkdb-failed.html).
