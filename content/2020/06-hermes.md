---
categories: Code
date: 2020-07-03T01:00:00Z
title: "ASPLOS '20: Hermes 复制协议"
series: "Paper Reading"
tags:
- Hermes
- Distributed System
---

一个遥远的城邦过着自给自足的生活，每个人都独立自主，诚实守信，互相信任，城邦中所有的事情都通过民主的方式决定。但是他们基础设施很差劲，投出去的票经常路上就丢了（丢包）；每个人又时不时的很忙，导致收到了提案也没功夫投票（节点下线）；城邦还总是发生地震，导致交通彻底断开（网络分区）。所以聪明的他们为了解决这个问题想了很多办法，一个思路是多数派原则，任何一个提案只要有多数派通过了，那它就会生效，还有一个思路是先票选出交通发达，有钱有闲，大陆架稳定的人，然后采取一票否决制，只要有一个人不同意，那提案就不会通过。

今天将要介绍的 [Hermes] 采用的是第二种思路，先通过其他的协议（比如 [Vertical Paxos](https://lamport.azurewebsites.net/pubs/vertical-paxos.pdf)）选举出一组稳定的成员，然后在成员中进行广播。

---

## 外星人问题

有一个这个遥远的城邦来了个外星人，他对这种民主体制非常感兴趣，所以他找来了一个城邦居民，问了他一些问题：

- 提案 *允许外星人加入城邦* 这个提案通过了吗？（读）
- 能不能帮我提交 *允许外星人加入城邦* 这个提案并投赞同票？（写）
- 能不能帮我看一下提案 *允许外星人加入城邦* 通过没有，如果没过就帮我提一个（原子操作: RMW，Read-Modify-Write）

外星人问题实际上对应业务中的一种常见需求：分布式 K-V 或者分布式锁。而 [Hermes] 主要关心的就是在分布式内存存储：各个节点都在同一个数据中心，客户端主要通过发送读/写请求与节点交互，通常的，这些节点还会将数据存储在内存中，并使用 RDMA 或 DPDK 来实现低延迟高吞吐。

## Hermes 协议细节

面对外星人的诚恳请求，这位城邦居民动了恻隐之心，所以他决定帮助这位外星人。按照城邦 [Hermes] 规定，作为接收这个请求的人，他成为了这个提案的发起者（Coordinator）。在完成一些 paper work 之后，他首先向议会（Followers）中的所有人发送草案，在收到了大家确认收到的请求之后，他就告诉外星人这个提案已经被通过了，然后他向议会所有人发出了最后生效的议案。

![](hermes-write.png)

### 基本概念

**Invalidations**

如上图所示，Coordinator 会向 Followers 广播两次：第一次叫做 `Invalidation` (INV)，Follower 收到 INV 之后会将这个 Key 设置为 Invalid 状态，意味着这个 Key 当前不能对外提供服务；第二次叫做 `Validation` (VAL)，Follower 收到 VAL 之后会更新这个 Key 的状态为 Valid，此时才会真的对外提供服务。只有当 Key 处在 Valid 状态时，节点才会返回这个 Key，否则都会 block 住。

为了解决并发问题，[Hermes] 引入了逻辑时间戳：

**Logical timestamps**

Hermes 中的每次写都会附加一个基于 [Lamport Timestamp](http://lamport.azurewebsites.net/pubs/time-clocks.pdf) 的逻辑时间戳，这个时间戳仅在 Coordinator 节点内部进行计算，不需要外部的服务或节点参与。这个时间戳由每个 Key 的 Version Number 和节点的 Node ID 组成。其中 Key Version Number 会在每次写的时候自增，而 Node ID 则在节点启动时进行分配。当两个时间戳进行比较的时候，遵循这样的原则：总是先比较 Key Version Number，若 Key Version Number 一致，则比较 Node ID。

> 为了避免公平性问题，论文中提出可以采用虚拟 Node ID 的方案，比如说给 Node 1 分配 {1,4,7,10}，给 Node 2 分配 {2,5,8,11}，给 Node 3 分配 {3,6,9,12}。在每次 Write 的时候随机选择一个作为本次请求的 Node ID。

### 请求处理

在 Hermes 协议中，所有的读请求都在本地完成：当 Key 处于 Valid 状态时返回，否则就 block。当 block 的时间超过给定的 `mlt` (message-loss timeout) 时，这个节点会重放自己收到的 INV 请求，开始执行一次 Write 操作，当 Write 操作完成的时候，这个 Key 会变为 Valid 状态并返回。与 Read 相似的是，只有当 Key 处于 Valid 状态时，节点才能发起一次 Write 操作，否则就会 block。当 block 的时间超过给定的 `mlt`，一样会重放自己收到的 INV 请求。

在 Wirte 操作中，Coordinator 会做如下事情：

- 更新 Key Version Number，附加上自己的 Node ID 作为本次 Write 请求的时间戳
- 广播 INV 消息，将 Key 设置为 `Write` 状态，并本地 apply 新的值
- 一旦收到所有节点的 ACK，将 Key 设置为 `Valid` 状态
- 广播 VAL 消息

Follower 则会做这些：

- 收到 INV 消息时，将消息中的时间戳和自己本地的时间戳做对比。当且仅当消息中的时间戳比本地高时将这个 Key 设置为 `Invalid` 状态并更新 Key 的时间戳和值，否则就什么都不做。
- 无论时间戳比较的结果是什么，总是返回一个 ACK
- 收到 VAL 消息时，当且仅当消息中的时间戳与本地一致时将 Key 更新为 `Valid` 状态，否则就直接忽略这个 VAL 消息。

从目前了解到的信息来看，Hermes 实现起来并不难。

### RMW 操作

为了支持 RMW 操作，[Hermes] 协议中做了如下调整：

- 在 Metadata 中加入了二进制标记 `RMW_flag` 以支持区分 RMW 操作和 Write 操作
- 在构造时间戳的时候：如果是 Write 操作，Key Version Number 会自增 `2`；如果是 RMW 操作，则会自增 `1`
- 当且仅当 Follower 收到的 INV 消息中的时间戳比本地高时才会返回对应的 ACK，否则会返回一个基于本地存储状态的 INV
- 在 Coordinator 等待 ACK 过程中如果收到了更高时间戳的 INV，则会直接放弃本次操作

构造时间戳的方式是一个很有意思的想法：假设对同一个 Key 出现了并发的 Write 和 RMW 操作，则 Write 总是会成功，这使得 Hermes 保证了两个特性：

- Write 总是会成功
- 至多有一个并发的 RMW 会成功

## 总结

我在读论文时遇到的最大问题是经常忘记 Hermes 依赖一组稳定的成员，而这组成员需要其他的协议来选举出来，所以 Hermes 实际上并不需要处理成员永远下线这种情况。

本文介绍了 [Hermes] 复制协议的读写流程与 RMW 操作的实现，其中省略了很多细节，比如故障恢复，成员变更等情况的处理还有与 [ZAB](https://zookeeper.apache.org/doc/r3.4.13/zookeeperInternals.html) 和 [CRAQ](https://www.cs.cornell.edu/home/rvr/papers/OSDI04.pdf) 等协议的对比，想了解这些细节的同学可以阅读他们的论文。Hermes 提供了 TLA+ 来证明他们的正确性，不过我对 TLA+ 缺乏研究，所以请允许我忽略这一部分的内容。

希望本文能为大家理解 [Hermes] 协议有所助益～

## 参考资料

- [@siddontang](https://www.zhihu.com/people/siddontang) 写的 [Hermes: 一个快速、容错、线性一致的复制协议](https://zhuanlan.zhihu.com/p/141616802) 让我第一次了解到这个协议
- [@chinaxing](https://www.zhihu.com/people/chinaxing) 写的 [Hermes - Linearizable Replication](https://zhuanlan.zhihu.com/p/129018759) 给出了简短但是很精准的介绍

[Raft]: https://raft.github.io/
[Hermes]: https://hermes-protocol.com/
