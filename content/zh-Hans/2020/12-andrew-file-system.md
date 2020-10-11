---
categories: Code
date: 2020-10-11T01:00:00Z
title: "Andrew: a distributed personal computing environment"
series: "Paper Reading"
tags:
- Distributed System
- File System
- CACM
---

## 介绍

今天主要想介绍的是论文 `Andrew: a distributed personal computing environment` 里面描述的 `Andrew File System`（通常简写为 AFS）。

- 发表于 [ACM 通讯(Communications of the ACM)](https://dl.acm.org/magazine/cacm)
- 发表时间为 1986 年
- 作者包括
  - [James H. Morris](https://dblp.org/pid/94/280.html)
  - [Mahadev Satyanarayanan](https://dblp.org/pid/s/MahadevSatyanarayanan.html)
  - [Michael H. Conner](https://dblp.org/pid/53/6441.html)
  - [John H. Howard](https://dblp.org/pid/84/488.html)
  - [David S. H. Rosentha](https://dblp.org/pid/84/5520.html)
  - [F. Donelson Smith](https://dblp.org/pid/s/FDonelsonSmith.html)
- 下载链接
  - [ACM.org](https://dl.acm.org/doi/10.1145/5666.5671)
  - [SciHub](https://sci-hub.se/10.1145/5666.5671)

显然的，发表于 1986 年的文章已经很难应用于当今的业界，参考价值也不高。我之所以将这篇文章翻出来，是想从本文出发看看这三十年间分布式存储的演进，或许能够对分布式存储领域有更深刻的理解。

> 从本文开始，Paper Reading 系列的文章将会尽量符合彭明辉教授的《硕士班研究所新生手册》中论文报告的要求，并根据实际的情况做调整

## 问题

在 1982 年十月的时候，CMU 和 IBM 打算合作创建 ITC (Information Technology Center) 机构，该机构会维护一套全新的系统以支持学校的教学。该系统计划使用个人工作站（毕竟 IBM 参与了设计）而不是分时系统，因为前者的性能稳定，可预测，不会受到其他用户的活动影响，最重要的是便宜。

当时主要流行的是分时系统，大家轮流上机，共享一个文件很容易：用户只需要在下机之后跟其他人说下文件名，另一个用户上机就能直接访问到。但是整个系统一旦转为分布式的个人工作站，共享文件开始变得麻烦起来：

- 每个工作站都有自己独立的地址，访问文件需要知道该地址
- 用户使用文件之前需要运行程序把文件下载到自己所在的节点
- 用户对文件的修改需要自行上传
- 用户也不能随意移动，无法在 A 节点创建文件然后在 B 节点访问

这些问题都是分时系统中没有遇到的，为此，ITC 需要设计一套分布式存储文件系统来解决上述的问题。

## 假设

论文中研究和涉及主要基于以下假设：

- 大文件可能会存在，但是不多
- 数据的分布稳定，不会经常发生变化

基本上类似于现在很多企业/学校内网私有云一写多读场景。


## 观念

### Naming

AFS 将文件划分为两个 namespace: local 与 shared，local 文件存储于工作站本地，而 shared 文件则存储于远端的文件服务器。在 UNIX 系统下，local namespace 基本可以看作工作站的 rootfs，而 shared namespace 则会被挂载到类似于 `/cmu` 这样的目录。特别的，论文里面还提到通过软链接的方式将 `/usr/local/bin` 链接到 `/cmu/unix/sun/usr/local/bin`，这样就能够尽可能少的在工作站本地存储文件并且简化系统软件的部署。

### Cache

工作站会在调用 open syscall 的时候尝试 cache 整个文件，后续 IO 操作都不会涉及到网络。Cache 的逻辑比较朴素：如果没有 Cache 或者 Cache 不是最新的就去服务器上获取最新的，如果有的话就当作本地文件打开。在调用 close syscall 的时候会检查文件是否会修改过，如果是的话，会将这个文件再上传到文件服务器。这样做的考虑一方面是减少读写性能上的开销，另一方面是实现起来比较容易。

正如前面的假设总结的，本文的一个大前提就是大文件不多，所以目前的设计还没有支持大文件（比工作站的 Cache 空间大的文件）的操作，需要独立的机制。Cache Write Through 的涉及必然会需要处理并发写，论文没有专门的设计，不过在实现中引入了一个独立的 Lock Server 进程将并发写转为序列化的写入操作，可能在作者看来这个冲突不会特别频繁。

### Custodian

shared namespace 是一个树状的结构，会划分为不相交多个 Subtree，每个 Subtree 会由一个服务器提供服务，文中把这样的一个服务器叫做 `Custodian`，也就是保管者。每个 `Custodian` 都会维护全局的 `Subtree -> Custodian` 的映射，文中叫做 `location database`。修改这样的映射成本会很高，数据需要完整的迁移，所有服务器上的映射也都需要更新。文中列举了两点来证明这种修改不怎么会出现：首先是绝大多数的文件创建和删除操作层级都很低，其次是重新分配 `Custodian` 的操作不常见而且需要管理员手动发起。这个论证实际上依赖一个数据分布稳定的假设，一方面是 Subtree 不会频繁的创建和修改，另一方面是服务器本身不会频繁故障。

文中还说明了两种优化：

- 对很少发生变化的 Subtree 可以由管理员创建多个只读副本
- 根据用户的需求，Custodian 可以就近分布从而加快访问速度

### Security

AFS 在目录级别实现了 ACL，可以指定 users 和 groups 的权限。ACL 中的 users 和 groups 存储在一个受保护的 database 中，这个 database 会在集群服务器之间做副本。

## 分析

AFS 是第一代分布式文件系统的代表，深度影响了后续 NFSv4 和 DFS 等文件系统的设计。它的主要创新是把 namespace 划分为多个 subtree，将数据分布到多个服务器上，同时对用户暴露出一个统一的视图，用户不需要关心数据具体的存储位置。缺点是没有考虑容灾的情形，某台节点宕机不会导致整个服务不可用，但是会使得特定的 subtree 无法访问，严重还会丢失整个 subtree 的数据。