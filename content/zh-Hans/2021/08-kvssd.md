---
categories: Code
date: 2021-09-01T01:00:00Z
title: "KVSSD: Close integration of LSM trees and flash translation layer for write-efficient KV store"
series: "Paper Reading"
tags:
- NVMe
- SSD
- Key-Value
---

> 这次的论文分享是在 PingCAP 组织的 Paper Reading 直播上完成的，本文是后续整理而成的文字稿。

- 发表于 2018 年
- 作者是
  - [Sung-Ming Wu](https://ieeexplore.ieee.org/author/37086370119)
  - [Kai-Hsiang Lin](https://ieeexplore.ieee.org/author/37086098744)
  - [Li-Pin Chang](https://ieeexplore.ieee.org/author/37733936200)
- 论文链接
  - [IEEE](https://ieeexplore.ieee.org/document/8342070)
- 其他资源
  - [Slides](https://docs.google.com/presentation/d/1AZiMBI3QMi04zRJVcMjW1WA1WAf_mJZpDl7Qbv8aj-E/edit)
  - [Bilibili 直播 (感谢 PingCAP)](https://www.bilibili.com/video/BV1Hg411L7ng/)

大家好，我是来自青云科技的存储工程师漩涡，现在主要在做跨云数据服务 [BeyondStorage](https://beyondstorage.io/)。今天想要跟大家分享的 Paper 是在 18 年的 DATE 会议上出现的 KVSSD。这篇 Paper 主要思路是在 SSD 上直接提供 KV 接口，将 LSM Tree 与 FTL 深度结合，从而避免从 LSM Tree，主机文件系统到 FTL 多个软件层的写入放大。今天拿这篇老 Paper 出来分享，一方面是蹭一蹭 KV 接口已经成功进入 NVMe 2.0 规范被标准化的热点，另一方面是为了和 TiKV / TiDB 的同学探讨未来存储硬件的更多可能性，希望能带来一些启发。

今天我们会按照这样的顺序展开，首先介绍一下问题的背景，什么是写放大，哪里产生了写放大，然后引出我们的解决方案，介绍 KVSSD 做了哪些优化，之后再介绍 KVSSD 的性能评估数据，最后再聊聊工业上的进展。

![](1.png)

## 背景

首先我们来聊聊背景。这是一个 TiKV 的架构图：

![](2.png)

我们都知道 TiKV 是一个分布式的 Key-Value 数据库，TiKV 的每一个节点都运行着一个 RocksDB 的实例，就像是这样：

![](3.png)

RocksDB 基于 Log-structed merge-tree (LSM) 开发的，LSM tree 是目前业界运用最为广泛的持久化数据结构之一。今天我们要讨论的问题就是 LSM tree 在 SSD 上遇到的写入放大问题及其解决方案。

## KV 存储系统中的写放大

从存储的视角来看，一个 KV 存储的软件堆栈大概是这样的：

![](4.png)

最顶层是一颗 LSM tree，具体的实现就不展开了。大体的思路是在内存中维护可变的 Memtable，在 SSD 上维护不可变的 SSTable。Memtable 写满后会作为 SSTable 输入存储，而所有的 SSTable 会组合成一颗分层的树，每一层写满后就会向下一层做 compaction。 LSM tree 维护过程中产生的 IO 会通过文件系统与 BIO 层的转换落到 SSD 上。

![](5.jpg)

然后看一下文件系统。显然的，文件落到文件系统上必然会有一些额外的开销，比如说我们需要维护文件的 Metadata。inode，大小，修改时间，访问时间等等都需要持久化。此外，文件系统需要能够保证在 crash 的时候不丢失已经写入的数据，所以还需要引入日志，写时复制这样的技术。

![](6.jpg)

然后再来看看 SSD 这一层。一个典型的 NAND Flash 芯片通常由 package，die，plane，block 和 page 组成。package，又叫做 chips，就是我们能在 SSD 上看到的颗粒。一个 pakage 通常由多层堆叠而成，每一层就叫做一颗 die。一颗 die 里面会被划分为多个 plane，而每个 plane 里面会包括一组 Block，每个 Block 又可以进一步细化为 Page。其中 Block 是擦除动作的最小单位，通常是 128KB 到 256 KB 不等，而 Page 是读取和写入的最小单位，通常为 2KB 到 32KB 不等。 为了维护逻辑地址到物理地址的转换，SSD 中引入了 FTL。 此外，FTL 还需要承担垃圾回收，坏块回收，磨损均衡等职责。

我们知道 SSD 设备的特性决定了它在写之前必须要进行擦除操作，设备需要将数据全部读到内存中修改并写回。为了均衡芯片损耗与性能，SSD 通常会选择标记当前 block ，寻找新的可用 block 来写入，由 FTL 来执行垃圾回收，这也就是我们常说的 SSD Trim 过程。

![](7.jpg)

从上面的分析我们不难观察到严重的写放大问题：

- LSM tree 的 compaction 过程
- 文件系统自身
- 块请求落到 FTL 上会出现的 read-modify-write 过程
- FTL 的垃圾回收

Paper 中没有考虑文件系统本身的写放大，只取了剩下三点的乘积作为总体的写入放大率。写入放大显然是个坏东西，既加大了存储设备的磨损，又降低了写入的吞吐，这些因素最终都会反映到用户的总体持有成本上。

## 如何缓解写放大？

为了解决或者说缓解这个问题，大家提出过很多不同方向的方案。

![](8.jpg)

比如说我们可以对算法做一些改造，比如 [LSM-trie](https://www.usenix.org/conference/atc15/technical-session/presentation/wu)，[PebblesDB](https://www.cs.utexas.edu/~vijay/papers/sosp17-pebblesdb.pdf) 或者 [WiscKey](https://www.usenix.org/conference/fast16/technical-sessions/presentation/lu)。WiscKey 大家可能比较熟悉一点，将 LSM tree 中的 Key 和 Value 分开存储，牺牲范围查询的性能，来降低写放大。TiKV 的 titan 存储引擎，dgraph 开源的 [badger](https://github.com/dgraph-io/badger)，还有 TiKV 社区孵化中的 [Agatedb](https://github.com/tikv/agatedb) 都是基于这个思路设计的。

或者我们也能在文件系统这一层做一些事情，比如说专门开发一个面向写方法优化的文件系统，减少在日志等环节的写入 IO，比如说开启压缩比更高的透明压缩算法，或者面向 KV 的典型负载做一些优化和调参。

但是算法上和软件上的优化终究还是有极限的，想要突破就只能不做人啦，直接对硬件下手，从固件的层面进行优化。一般的来说，系统优化都有拆抽象和加抽象两个方向的优化。 拆抽象是指我们去掉现有的抽象，将更多的底层细节暴露出来，这样用户可以更自由的根据自己的负载进行针对性优化。加抽象是指我们增加新的抽象，屏蔽更多的底层细节，这样可以针对硬件特点做优化。

存储系统的优化也不例外。

![](9.jpg)

拆抽象思路的先驱者是 Open-Channel SSD，它的思路是把固件里的 FTL 扬了，让用户自己来实现。这个思路是好的，但是 Open-Channel Spec 只定义了最通用的一部分，具体到厂商而言，他们考虑到自己 SSD 的产品特性和商业机密，往往选择在兼容 Open-Channel Spec 的同时，再加入一些自己的定义。这就导致至今都没有出现通用的 Open-Channel SSD 和针对业务的通用 FTL。对用户来说，并不通用的通用的 Open-Channel SSD 带来了更严重的 vendor-lock 问题。所以 Open-Channel SSD 迟迟无法得到大规模应用。

NVMe 工作组也看到了这样的问题，所以他们消化吸收了 Open-Channel 的精髓，提出了 Zoned Namespace (ZNS) 的新特性。ZNS 将一个 namespace 下的逻辑空间地址划分为一个个的 zone，zone 当中只能进行顺序写，需要显式的擦除操作才能再次进行覆盖写。通过这种方式 SSD 将内部结构的边界透露给外界，让用户来实现具体的地址映射，垃圾回收等逻辑。

另一个思路是加抽象，既然上层业务做不好这个事情，那就把它加到固件里面，我们硬件自己做。比如说在固件中直接实现 Key-Value 接口，或者使用计算型 SSD 将更多的计算任务下推到 SSD 上来做。

这里额外插一句感慨，三国演义开篇的“天下大势，分久必合，合久必分”真是太对了。软件定义存储发展到今天，硬件厂商也不甘于成为纯粹的供货商，他们也想加入到产业链上游，获取更多的利润。所以在存算分离已经成为大势所趋的时候，业界还孕育着一股存算融合的潮流：通过更合理更规范的抽象，充分利用自己软硬一体的优势，提供在延迟和吞吐上更具优势的产品。比如小道消息称三星开发中的 KVSSD 上搭载的芯片计算能力相当于两三年前的手机芯片。考虑到 FPGA 和 ARM 这样精简指令集的芯片的持续发展，相信这股潮流会带来更多系统架构上的可能性。

## KVSSD 设计

好的，回归正题。这篇 Paper 就是采用了加抽象的路线，在固件中直接实现 Key-Value 接口。

![](10.png)

KVSSD 采用了闪存原生的 LSM tree 实现，叫做 nLSM (NAND-flash-LSM)。nLSM tree 把 FTL 的 L2P(Logical To Physic) 层转换为了 K2P ( Key To Physic) 映射，每个树节点都代表一个 SSTable 的 Key 范围。nLSM tree 将整个闪存花费为元数据区和 KV 区，KV 区中存储排序后的 KV 对，元数据区中的每一页叫做元数据页，只包含指向 KV 页和键范围的指针。

nLSM 运用了如下设计来优化写放大：

### K2P Mapping

![](11.jpg)

首先我们来看一下 K2P 映射的设计。显然的，K2P 的抽象层次比 L2P 高很多，不可能在 SSD 的内存中直接存储所有 Key 对应的物理 Page。所以作者选择了在 K2P 中使用 Key Range Tree 来存储 彼此不相交的 key-range 到 SSTable 的映射。nLSM tree 使用 Key Range Tree 来找到一个元数据页，然后使用元数据页中的 key range 信息来找到一个 KV 页，然后再从 KV 页中检索目标 KV 对。 nLSM tree 给每个 SSTable 分配了一个闪存块，闪存块的大小是 4MB 跟 SSTable 的大小一样大，保证 SSTable 物理上连续且跟页面边界对齐。在 compaction 的时候，nLSM tree 会对旧的 SSTable 进行多向合并排序，并写入新的 SSTable，并丢弃旧的 SSTbale。之后的垃圾回收过程可以直接擦除这些块，不需要进行任何的数据复制。

### Remapping Compaction

![](12.jpg)

其次是 Remapping Compaction。

假设我们现在 Key Range 被划分为 A 到 I 这几个区间。Ta 表示的是 Level i 层的数据，Tb 和 Tc 表示 Level i+1 层的数据，现在我们要进行 Compaction 的话，就需要以某种形式将 Ta 中的数据塞进 Tb 和 Tc。Tb 和 Tc 组成一一组区间连续的 Key，而 Ta 跟他们都有一些重叠的地方。如果按照传统的方式重写这些 Page 的话，我们需要写 12 个 KV page，再加上 3 个 metadata page。但是在 Remapping Compaction 中，会选择重新写 Tx，Ty，Tz 三个 metadata page 分别指向已经存在的 KV Page。这样就把重写 page 的代价从 15 降低到了 3。

### Hot-cold Separation

最后是冷热分离。显然的，高效的垃圾回收依赖数据分布的特征。假如相对较冷的数据能分布在一起，避免重复的 gc 热数据，可以极大的降低 gc 的写入放大。在 LSM tree 的写入模型当中，上层总是比下层的数据要小，换句话来说，上层的数据参与 gc 更多，更频繁。不同层次的数据有着不同的生命周期。基于这样的特性，有一个可能优化是在垃圾回收迁移数据的时候，尽可能的在同一级别的 KV 页中写入数据，这样能保证相似寿命的页面能被分组到相似的区块中。

## KVSSD 性能分析

接下来我们看看 Paper 的性能分析环节。这篇 Paper 主要涉及三个性能方面的因素：写放大，吞吐和读放大。实验中使用的 SSD 设备是 15GB，5% 是保留空间，page size 是 32KB，block size 是 4MB。实验的方法是使用 blktrace 记录 leveldb 的 block I/O trace 然后在 SSD 模拟器上重放来收集闪存的操作数据。分别对比了

- LSM: 基于 leveldb
- dLSM: 一种 delay compaction 的优化
- lLSM: 一种轻量级 compaction 的优化
- nLSM
- rLSM(-): nLSM with remapping compaction
- rLSM: nLSM with remapping compaction and hot-cold sparation

![](13.png)

![](14.png)

根据这一组图可以看到，在给定的测试条件下 rLSM 能将写放大降低至原来的 12%，同时将吞吐提升了 4.47 倍，但是带来了 11% 的读放大。

好，到这里我们这篇 paper 的整体思路就已经介绍完了。我们来回顾一下 KVSSD 的价值，首先最明显的是 KVSSD 能带来更小写入放大，可以提高吞吐，进而降低 TCO，符合现在业界降本增效的潮流。其次从系统架构设计的角度上来看，KVSSD 能够进一步的将 I/O Offload 到 SSD 设备上。以 rocksdb 为例，使用 KVSSD 能降低 rocksdb 的 compaction 和 log 开销。此外，SSD 的计算能力实际上是在逐步提升的，未来可以在 SSD 中进行压缩，加密，校验等一系列重计算的任务。这些都为架构提供了新的可能性。

## KVSSD 在工业上的进展

最后我们来看看业界的跟进情况。

在 2019 的 SYSTOR 会议上，三星沿用这一思路，发表了论文 [Towards building a high-performance, scale-in key-value storage system](https://dl.acm.org/doi/10.1145/3319647.3325831)，在论文中提到他与 SNIA 联手制定了 Key Value Storage API 规范，基于现有的 Block SSD 实现了 KV-SSD 的原型：

![](15.png)

还发表了公开的 KVSSD 相关的 API 与驱动：https://github.com/OpenMPDK/KVSSD

根据三星的论文中的分析来看，KV-SSD 展现了非常强的线性扩展能力，随着设备数量的增加，系统整体的 TPS 成线性增长，基本不受 CPU 的限制，感兴趣的同学可以找来看看。

这里我补充一下，三星的 KV-SSD 跟今天分享的论文只是大体思路相同，具体的设计和实现上还是有很大差异，今天受主题和时间所限，就不再展开了。

在今年六月发布的 NVMe 2.0 规范中，KVSSD 相关的指令集已经被规范化为 NVMe-KV 指令集，成为新的 I/O 命令集之一，允许使用 Key 而不是 Block 地址来访问数据。考虑到业界对 NVMe 规范的广泛支持，预计完全支持 NVMe 2.0 的 SSD 很快就有商用的产品上市，希望大家保持关注。

我的分享就到这里，谢谢大家！

## Q&A

### 业界更关心 ZNS 还是 KVSSD？

ZNS 实现上要比 KVSSD 容易的多，成本也比 KVSSD 更好控制，所以目前业界对 ZNS 还是更热心一点。

### KVSSD 冷热分离的设计是不是会导致 Block 擦写不均衡？

是的，论文里面没有展开论述相关的细节。按照目前这样的设计确实会导致这个问题，需要在实现的时候讲磨损均衡的问题也考虑进来。

### kVSSD 需要占用宿主机的内存和 CPU 吗？

不需要，KVSSD 自带独立的内存和处理芯片，不依赖宿主机的资源。这也是使用 KVSSD 的意义之一：我们可以将这部分的负载 Offload 到 SSD 上，使得单一宿主机上可以接入更多的设备。
