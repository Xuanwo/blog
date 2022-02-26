---
categories: Code
date: 2022-02-26T01:00:00Z
tags:
    - open source
    - databend
title: 如何在开源项目中做重构？
---

最近完成了 [Databend](https://github.com/datafuselabs/databend/) 存储模块的大重构，在不阻塞现有功能开发的前提下，基本无痛的完成了功能的实现。本文总结了我个人的一些经验，期望能够带来一些启发。

---

做重构不易，尤其是在一个相当活跃的 codebase 上。Databend 现在每周有 40+ PR 被 merge，在过去的一周中有 800+ 文件发生了变更，代码增加了 21K  行，删除了 12K 行。在这样的代码库上，毕全功于一役的代价是高到可怕的。所以在整个重构的生命周期中，我们都需要跟社区保持密切沟通，让社区知道你想做什么，怎么做，现在的进展如何。在这一次的重构中我总结出了如下经验：

## 撰写提案

正如 The Apache Way 所说：`Community over code`。一个好的开源项目不仅仅是由代码组成，抛开开源共同体谈抽象的技术和代码是没有意义的。因此向开源项目提交大型的变更之前，我们必须要阐述清楚自己的想法，解释动机，让开源共同体知道自己想做什么，想怎么做。

这些落到纸面上的文档在讨论时能够补充信息，完善想法，构建出更好的设计。从长期角度看，文档能够帮助后来者理解当时为什么要提出这样的设计，从而避免重复踩坑。不仅如此，一份好的设计文档往往还能够影响、启发其他开源项目的设计，从而促进整个行业进步。

[@tison](https://github.com/tisonkun/) 在 [如何参与 Apache 项目社区](https://zhuanlan.zhihu.com/p/93334196) 提到过：

> 对于任何 non-trivial 的改动，都需要有一定的描述来表明动机；对于大的改动，更需要设计文档来留存记忆。人的记忆不是永久的，总会忘记最初的时候自己为什么做某一件事情，设计文档的沉淀对于社区摆脱人的不确定性演化有至关重要的作用。

在本次重构之前，我在 Databend 的 [Discussions](https://github.com/datafuselabs/databend/discussions) 中向全体社区成员公开地阐述了自己的愿景和希望: [proposal: Vision of Databend DAL](https://github.com/datafuselabs/databend/discussions/3662)。然后跟多位相关的模块的维护者取得了沟通，达成了广泛的一致意见，之后才开始了本次的重构。我认为跟维护者取得一致是非常关键的步骤，否则极有可能出现工作到一半时维护者发现想法冲突导致工作被终止或者重来，这是非常沮丧的。

此外，开源共同体本质上都在奉行**基于开源贡献**的精英主义原则。贡献者必须要通过贡献来证明自己的价值，取得社区的信任，然后才能推行自己的主张。所以在提出一个大型改动之前，最好先通过参与一些 good first issue 加入到社区中来，了解社区的规范，熟悉社区的编译流程，跟模块的维护者保持联系，建立自己在社区中的影响力。在本次重构之前，我帮助 Databend 社区完成了新的社区官网上线，改造了全新的 CI Pipeline，跟各个模块的维护者基本都刷了个脸熟。

值得注意的是，Databend 像很多新生的开源项目一样，还没有完善的提案流程，但是这并不意味着我们就不能或者不需要提交提案。提交 Proposal 的意义就在于跟社区沟通达成一致，不要被形式所束缚，只要能最终达成一致就是可以接受的。与此同时，开源项目的治理流程本身也在不断完善和演进。事实上，绝大多数项目中正式的提案处理流程正是在社区在不断的接受和处理一份份提案的过程中被搭建起来的。

## 创建 Tracking Issue

在提交了 Proposal 通过之后，最好能创建一个 Tracking Issues 来跟踪 Proposal 的实现情况。

通常我们会命名成 `Tracking Issue for Xxxx`，在这个 Issue 中，我们需要

- 链接到之前通过的 Proposal 以便于社区成员了解当前工作的上下文
- 列出自己的工作计划和 TODO List
- 随进度更新自己的进展

除了自己的规划安排之外，还有一种比较常见的情况是在 PR review 时维护者经常会提出一些后续的改进建议，我们可以统一汇总到 Tracking Issue 中来。

Tracking Issues 的意义在于让社区了解当前的进展并在适时的时候提供需要的帮助，社区通过查看 Tracking Issue 就能了解 Proposal 目前是处于活跃开发还是停滞状态，对 Proposal 实现感兴趣的成员也能够通过 Tracking Issue 反馈自己的想法和参与意愿。

在本次重构中，我通过 [Tracking issue for Vision of Databend DAL](https://github.com/datafuselabs/databend/issues/3677) 来跟踪 Proposal 的进展情况。除了自己的规划的特性之外，我还记录了很多维护者 review 时提供的反馈意见和一些长期的不成熟想法，这些都是未来项目可以改进的方向。

## 拆分 Pull Requests

在实现 Proposal 的时候要根据实际的情况拆分 PR。

PR 拆的太细会给维护者带来额外的负担，由此产生的大量无用 CI 任务也不利于低碳环保；PR 太大则会导致维护者难以 review，要么草草通过了事，要么迟迟没人 review，这都不利于工作的推进，更不必说大 PR 有更大的概率出现代码冲突。

每个 PR 应当是一个完整的个体，可以实现某个特定的目标。以我的两个 PR 为例：

- [dal2: Eliminate type parameters in DAL](https://github.com/datafuselabs/databend/pull/4001)： 消除 DAL 中的类型参数
- [dal2: Implement DAL Layer support](https://github.com/datafuselabs/databend/pull/4067)： 实现 DAL Layer 支持

这里的每个 PR 都只做了一件很明确的事情，维护者通过阅读 PR 的标题和描述就能迅速理解这个 PR 在做什么，这样代码 review 的时候就会事半功倍。

PR 的拆分更多依赖于个人的经验和风格，当怎么拆分比较好时，可以请维护者帮忙出主意。

## 保持专注

在实现 Proposal 的过程中需要保持专注，不要无限制地延拓工作边界。

实现过程中往往会遇到一些新的待解决问题，又往往与当前的 Proposal 相关联，此时最好采用最小化的原则，优先保证当前的 Proposal 能够成功交付。一方面，人的能力是有极限的，不能因为当前负责实现这个 proposal，就去承担所有相关的任务，这往往会导致相关模块的任务都阻塞在自己身上，没有最大化地利用来自开源共同体的力量；另一方面，望山跑死马，无限制地拓展工作边界会导致自己的成果没有一个清晰的交付时间点，自己会感到精力在不断被耗尽，社区的耐心和期待也在不断地被消磨。

所以我们需要保持专注，努力抗拒新功能和新特性的诱惑，优先保证当前的 proposal 中承诺的功能交付。等到 proposal 完全实现并合并之后，给自己放一个小假，然后再开启新的 proposal 并实现，如此循环。有交付才有激励，才有动力去完成更多的工作，不要设定一个永远无法企及的目标。

## 寻求帮助

在实现 Proposal 的过程中，要积极地跟社区交流，向社区寻求帮助。

时刻牢记我们不是一个人在战斗，我们背后是整个开源社区。遇到问题的时候不要一个人闷头苦想，积极的向社区寻求帮助，小到语言特性(尤其是你在使用 Rust 时)，大到功能模块。一个问题查了一天资料也没有结果，问问维护者往往能给出更合理的解决方案或者可行的 work around。

不用担心暴露自己的不足，大家都是这么过来的。开源共同体中的成员往往利益趋向于一致，所以维护者有意愿有动力来帮助解决问题。我最喜欢的 Rust 开发者 [dtolnay](https://github.com/dtolnay) 就是一个极为优秀的典范：在 PR [Add try_reserve and try_reserve_exact for OsString](https://github.com/rust-lang/rust/pull/92338) 中，dtolnay 给出了细致而明确的 review 意见，帮助我理解了这部分逻辑的细节。

在实现 [query: Replace dal with dal2, let's rock!](https://github.com/datafuselabs/databend/pull/4081) 的过程中，我遇到了一个想了很久也没有想明白的问题，于是提交了[评论](https://github.com/datafuselabs/databend/pull/4081#issuecomment-1034590367) 向维护者 [@dantengsky](https://github.com/dantengsky) 寻求帮助。在评论中，我给出了问题的描述，完整的 backtrace，还有最简化的复现步骤。在 [@dantengsky](https://github.com/dantengsky) 的帮助下，这个问题很快就得到了解决。

阅读 [提问的智慧](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/main/README-zh_CN.md) 会很有帮助，但是完全没读过也没关系，核心的要旨是互相尊重。不要颐指气使，也不要低声下气。我们尊重维护者是因为他们过往的贡献而非如今的社区地位，相比于大佬之类的无意义恭维，在解决问题后的一声 Thanks 往往更让人感到开心。

---

总得来说，在开源项目中做大规模的重构，最重要的就是保持交流，持续沟通。撰写 Proposal，创建 Tracking Issue，拆分 PRs 都是为了交流服务的。再此基础上，我们需要注意一些实现中的技巧，保持专注，并适时地向社区寻求帮助。以上就是我在本次重构中总结出来的一些经验，希望能够帮助到你，欢迎在评论区一同交流~
