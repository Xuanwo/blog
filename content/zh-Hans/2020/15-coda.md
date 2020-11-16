---
categories: Code
date: 2020-11-16T01:00:00Z
title: "Coda: A Highly Available File System for a Distributed Workstation Environment"
series: "Paper Reading"
tags:
- Distributed System
- File System
- IEEE Transactions on Computers
---

## 介绍

今天要分享的论文是 `Coda: A Highly Available File System for a Distributed Workstation Environment`。

- 发表于 [IEEE Transactions on Computers](https://dblp.org/db/journals/tc/index.html), VOL. 39, NO. 4
- 发表时间为 1990 年
- 作者包括
  - [Mahadev Satyanarayanan](https://dblp.org/pid/s/MahadevSatyanarayanan.html)
  - [James J. Kistler](https://dblp.org/pid/12/56.html)
  - [Puneet Kumar](https://dblp.org/pid/09/5254-1.html)
  - [Maria E. Okasaki](https://dblp.org/pid/31/5038.html)
  - [Ellen H. Siegel](https://dblp.org/pid/46/4228.html)
  - [David C. Steere](https://dblp.org/pid/71/5709.html)
- 下载链接
  - [IEEE](https://ieeexplore.ieee.org/document/54838)
  - [SciHub](https://sci-hub.se/10.1109/12.54838)

本论文是之前介绍过的 [Andrew File System](https://xuanwo.io/2020/12-andrew-file-system/) 的后续工作。

> Coda 是 **Co**nstant **D**ata **A**vailability 的缩写，不得不说真的挺会起名字的（

## 问题

在过去多年的 AFS 实践当中，它的性能，功能和易于管理都令人满意，但是同时也暴露出服务器和网络的脆弱性——每天都会出现几个引起用户服务不可用的故障，影响时间的范围从几分钟到许多小时不等。

Coda 的出现就是为了解决这个问题。

## 假设

论文中的研究和实现主要基于以下假设

- 该文件系统主要用于科研环境，写共享不频繁，冲突更新会很少发生

由于 Coda 基本继承了 AFS 的设计，所以 AFS 论文中的假设也一并沿用：

- 大文件可能会存在，但是不多
- 数据的分布稳定，不会经常发生变化

特别的，作者强调类似数据库的应用不是 Coda 支持的目标，他认为这种应用需要作为实现一个独立系统而不是基于分布式文件系统实现。

## 概念

### Server Replication

![](server-replication-infra.jpg)

Coda 的服务器端多副本实现如上图：

最小单元是 `Volume`，由位于同一个服务器的一组文件和目录组成，是 `Namespace` 中的一个 `Subtree`。每个文件和目录都会有一个唯一的 `file identifier (FID)`，每个对象的副本都有相同 FID。

同一个 `Volume` 的不同副本组成了它的 `volume stomge group (VSG)`[1]。每个 `Volume` 的副本数和服务器地址在创建的时候指定并存储在服务器的 `volume replication databuse`[2]。这次参数后续可以调整，但是正如假设中提到的，这种变化不会经常发生。

客户端的 `Venus`（缓存管理器）会维护 `Volume` 到可访问的 `VSG` 的映射，这个子集叫做 `accessiblevolume stomge group(AVSG)`。同一个 `Volume` 的不同客户端可能会有不同的 `AVSG`。

#### 读取

当客户端出现 cache miss 的时候，`Venus` 会从 `AVSG` 中挑选一个 `prefered server` 来传输数据。这个 server 可以是随机挑选的，也可以是根据负载等情况确定的。

在下载完文件后，客户端会访问 `AVSG` 中的其他服务器以确认当前的 `prefered server` 的数据是不是有最新的，如果是的话读取流程结束，否则会将 `prefered server` 切换为有最新数据的 server 重新下载并通知整个 `AVSG` 以告知他们中有成员的副本不是最新的。

#### 写入

当客户端修改文件并 `close` 之后，这个文件会被并行的传输到 `AVSG` 的所有成员。

#### 缓存协商

当客户端缓存好一个文件之后，客户端就会与 `prefered server` 建立一个回调，当这个文件发生修改的时候通知客户端这个文件已经被更新。

根据前面的信息我们知道不同客户端的 `preferred server` 可能是不同的，那么可能会出现这样的情况：另一个客户端更新了文件，但是 `preferred server` 没能成功通知当前客户端，比如说 `preferred server` 没有收到这个变更或者 `preferred server` 与当前客户端失连了。为了能够检测到这种故障，Coda 引入了 `version vector (volume CVV)` ：每次对 `Volume` 做修改操作的时候都会去更新 `volume CVV`，而每次客户端去探活的时候都会带上这个 `volume CVV`。当客户端发现自己的 `volume CVV` 对不上的时候，说明 `ASVG` 中有错过了 `Volume` 文件的更新，此时客户端会抛弃掉这个 `Volume` 所有的 `Callback`。

`AVSG` 的扩容和锁容是通过 probe 实现的，按照固定的时间间隔（具体的实现中是 10 分钟）向 `VSG` 中的所有成员发送探活请求。

### Disconneted Operation

当某个 `Volume` 的 `VSG` 全都无法访问的时候，客户端就会执行 `disconneted` 操作。被 `disconneted` 的 `Volume` 的使用本地的缓存提供服务，只有出现 cache miss 的时候才会真正的影响到用户。而其他的 `Volume` 仍然能够正常的提供服务。为了提高缓存的命中率，Coda 引入了 LRC 和优先级列表，最高级的文件被标记为 `sticky` 并将总是保留在缓存中。在 `disconneted` 结束时，客户端会执行 `reintegration` 操作：将断连期间所有被修改的文件都上传到服务器。上传失败/遇到冲突的文件会被移动到 `covolume`，交给用户自行解决。`disconneted` 也可以被用户主动触发，比如说使用移动网络时或者在网络间移动的时候。

不难看出，在最理想的状态下——没有遇到 cache miss & 重连后没有发生冲突，`disconneted` 和 `reintegration` 对用户来说是完全无感的。

## 分析

Coda 在 AFS 的基础上主要的改进是引入了 `Server Replication` 的概念，允许 `Subtree` 分布在多个节点上，使得单个节点的故障不会影响 `Subtree` 正常提供服务。不过 `ASVG` 的设计没有考虑脑裂的情况：假如两个客户端的 `AVSG` 完全不存在交集的时候无法自愈，在最终合并的时候需要处理大量的冲突。作者可能也知道这一点，但是在其论文的假设下，这种问题的影响可能并不是非常的严重。

Coda 曾经进入内核并有多个活跃的项目尝试 port 到其他的操作系统（Windows 95/98/XP 等），但是从 2011 年开始已经没有开发记录。从历史的进程来看，硬件的跨越式发展使得真正的个人电脑出现，可以把大多数文件都直接存储在本地，论文中的假设基本上全部失效，而 Coda 将绝大部分逻辑都在本地实现的设计思路让它变得很难移植到其他平台，个人的奋斗已经很难让它起死回生。

再见， Coda

---

- [1]: `stomge` 没有找到合理的中文释义，我猜测是作者将 `storage` 和 `manager` 组合起来的词
- [2]: `databuse` 看起来应该是 `database`，但是不知道为什么作者用了这个词