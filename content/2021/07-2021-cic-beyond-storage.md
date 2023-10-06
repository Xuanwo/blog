---
categories: Code
date: 2021-07-30T01:00:00Z
title: "2021 CIC: BeyondStorage 介绍"
tags:
- BeyondStorage
- Golang
---

大家好，我是丁皓，是 QingStor 生态开发的负责人，常用网名叫做漩涡。

随着云计算变革的逐步深入，越来越多的用户选择在云上存储数据，他们往往会使用多套存储服务来实现成本和可靠性之间的平衡。但是多套存储服务之间的互联互通就成了巨大的问题，今天想要向大家介绍的是就是由 QingStor 研发团队主导的专注于提供跨云数据服务的开源社区 [BeyondStorage](https://beyondstorage.io/)。

> 完整 [Slides](https://docs.google.com/presentation/d/1S6uUySHniD3pGvFfS81-nxa_i6XMazM_kVXVgKivfc4/edit?usp=sharing)

## BeyondStorage 开源社区

![](1.png)

BeyondStorage 这个名字一方面反应专注于跨云数据服务的立场，另一方面表达了超越现有存储局限性的美好愿景。BeyondStorage 的核心价值观是开放，中立与用户中心。

- 开放是 BeyondStorage 的基本要求。所有代码都在 Github 上托管，整个团队的开发流程都围绕着 Github 展开，在线沟通也完全开放，任何人都能随时加入讨论。
- 中立是 BeyondStorage 的立身之本。社区在设计所有功能时会平等对待所有服务，避免厂商独有的特性进入核心 API。
- 用户中心是 BeyondStorage 的独特价值。BeyondStorage 始终围绕着用户构建，满足用户提出的需求，并由用户贡献来改进和完善。

右图是我们社区的项目架构图，我们的思路是首先构建出一套统一的存储抽象，然后向下对接各种各样的存储服务，进而向上为应用提供支持。

![](2.png)

目前中心的接口层有一个 Golang 的实现，叫做 [go-storage](https://github.com/beyondstorage/go-storage)，最新的稳定版本是 v4.2.0。

目前已经支持了包括 AWS，Google，阿里云，腾讯云等在内的 9 个服务的稳定版本。此外还有 FTP，Google Drive，IPFS 等 11 个服务正由社区贡献者开发中。

在接口层之上是应用层，我们社区计划围绕着 go-storage 开发数据迁移，数据管理，FTP，FUSE 等应用。

我们的官方网站是 https://beyondstorage.io ，Github 帐号是 [BeyondStorage](https://github.com/beyondstorage)，欢迎大家关注！

## go-storage

接下来向大家介绍我们社区在过去的一年中的两项主要工作，首先是我们前面提到过的接口层 [go-storage](https://github.com/beyondstorage/go-storage)。

![](3.png)

go-storage 是一个供应商中立的 Golang 存储库，愿景是开发一次，在任何存储服务上都能运行。他的目标是供应商无关，生产就绪与高性能。

- 供应商无关是 go-storage 最重要的特性。go-storage 严格遵循中立的原则，核心 API 中没有暴露任何厂商相关的细节，通过抽象隔离的方式，为用户提供了访问服务内部特性的能力。
- 生产就绪指 go-storage 目标是集成在各个生产级别的业务中。我们维护了一个独立的集成测试项目，所有的服务都要求通过该测试后才能发布稳定版本。
- 在确保正确性的基础上，我们沿用来自 C++ 与 Rust 社区的零开销抽象思想来保障高性能。不用的东西不需要负担成本，而使用到的抽象，用户不可能手写得更好。

围绕着上述目标，我们实现了广泛的原生服务支持，分段，分块，分片上传，Append / Copy / Move 等高级操作，支持自定义元数据，服务器端加密等。

开发者不再需要针对每个服务去适配，去了解 API 的行为细节，只需要使用 go-storage 就能像右图一般一次性对接好所有存储服务。现在 go-storage 的功能已经完善，我们正在提升代码覆盖率，完善集成测试及性能测试等，欢迎大家在 Github 上标星关注我们的 go-storage ！

## BeyondTP

最后是我们基于 go-storage 开发的数据迁移服务：[BeyondTP](https://github.com/beyondstorage/beyond-tp)。TP 是 Teleport 的缩写，意为传送，我们希望让用户的数据迁移能够像游戏中的传送一样快。

![](4.png)

BeyondTP 具备如下功能，首先是批量，增量，并行的数据迁移，然后是数据传输过程的校验，压缩，加密，在基础的数据操作外，我们基于 Flutter 2.0 开发了支持多租户，高可用，可视化的管理平台。BeyondTP 基于我们刚才提到的 go-storage 开发，天然的具备了多云存储服务的能力。此外，BeyondTP 支持进行私有化部署，用户可以搭建起自己的数据迁移平台。

以上就是关于 BeyondStorage 的全部介绍，谢谢大家！
