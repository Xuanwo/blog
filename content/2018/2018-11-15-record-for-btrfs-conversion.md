---
categories: Opinion
date: 2018-11-15T13:05:00Z
tags:
- Archlinux
- Btrfs
title: 记一次 btrfs 的在线转换
url: /2018/11/15/record-for-btrfs-conversion/
---

在 archcn 群里听 [fc 教授](https://farseerfc.me/) 安利了有一段时间了，终于在一个心情不是非常美好的晚上决定上一波 btrfs ，这篇文章主要分享这次转换中遇到的一些有趣的故事~

<!--more-->

---

## btrfs 是什么以及为什么？

> Btrfs（B-tree文件系统，通常念成Butter FS，Better FS或B-tree FS），一种支持写入时复制（COW）的文件系统，运行在Linux操作系统，采用GPL授权。Oracle于2007年对外宣布这项计划，并发布源代码，在2014年8月发布稳定版。目标是取代Linux目前的ext3文件系统，改善ext3的限制，特别是单个文件的大小，总文件系统大小或文件检查和加入ext3未支持的功能，像是可写快照（writable snapshots）、快照的快照（snapshots of snapshots）、内建磁盘阵列（RAID），以及子卷（subvolumes）。Btrfs也宣称专注在“容错、修复及易于管理”。

之所以想要换成 btrfs ，主要是因为以下几个原因：

- btrfs 支持快照，可以方便备份和恢复
- btrfs 支持透明压缩
- btrfs 支持子卷，结合快照功能，可以作为启动 `systemd-nspawn` 容器的模板
- btrfs 支持数据和元数据的校验
- btrfs 支持就地从 ext4 转换
- 那天晚上心情不是很好，需要有个足够好玩的事情来吸引我的注意力
- 这是我自己的电脑，我乐意（

其实我之前一直是坚定的 ext4 党，觉得 ext4 非常稳定，性能优秀，文件系统的高级功能平时也不怎么会用到，所以并不觉得 btrfs 好，反而经常在别人报告自己的 btrfs 翻车的时候在一旁吃瓜，滑稽的喊两句毫无营养的 *我选择 ext4* 。但是后来我的想法慢慢的发生了变化，一方面是 fc 老师的持续安利和讲解，另一方面是自己对事物，或者说世界的看法也在变化：

### 不要迷醉于虚假的安全之中

ext4 可能确实是稳，确实是快，但是这是因为它默认没有开启 checksum 。 *（虽然没有横向对比过，但此处应使用肯定语气表示强调，只要你不说出来别人也不会去查）* 如果出现了静默错误，ext4 毫无修复的能力，而 btrfs 则会在读取的时候进行校验并尝试去进行修复。

### 吃瓜群众没有什么可骄傲的

以前可能习惯的去当一个吃瓜群众，静静的围观各种事件的反转并自诩 *机智如我* ，*我就知道会这样* 。但是现在渐渐明白了，吃瓜群众只不过是没脑子罢了，被铺天盖地的信息轰炸的多了，失去了自己去查明真相的能力，只能被动的随着信息的浪潮四处漂游。醒醒吧，世界的发展和技术的进步并不是吃瓜群众推动的，如果我们不亲自下场去尝试，最后留在自己手中的只有瓜皮而已。

## 匹夫之勇

啊，废话说的有点多了，下面开始正题。

首先熟读并背诵 Archwiki 中 btrfs 相关的条目，英文的也都仔细读一遍，防止有什么新的信息被遗漏了。敢于尝试新鲜事物是勇者，但是 archwiki 都不好好看，那就是莽夫了。确认重要的信息都 get 到之后，插上 U 盘进入 live 环境。

在开始之前有几个比较重要的 Tips：

- **备份**，**备份**，**备份**。如果是在没有条件全盘备份，起码把自己的 `ssh_key`，`gpg_key` 等重要文件都备份好，数据是你自己的，为了帅这一下，不值得。
- `btrfs-convert` 会保留原来 ext4 中的 metadata，并作为一个单独的子卷。因此只要保留着这个子卷，你就可以恢复成 ext4 。但是这是有条件的，显然的，btrfs 不可能去在线维护 btrfs 和 ext4 两个 metadata，在 convert 之后的 btrfs 分区中做出的变更将不会同步到 ext4 的 metadata 中。因此请在确认数据都没有问题的情况下再开机进入系统。

首先执行一次 fsck，避免带病上阵：

```bash
fsck.ext4 /dev/nvme0n1p2
```

然后深呼吸三次，开始执行 `btrfs-convert`

```bash
btrfs-convert /dev/nvme0n1p2
```

![](convert.jpg)

在经过漫长的等待后，convert 没有翻车，已经成功一半啦！

![](success.jpg)

接下来把分区挂在上来，检查一下是否有问题：

```bash
mount /dev/nvme0n1p2 /mnt
mount /dev/nvme0n1p1 /mnt/boot
```

随机抽查了一些文件发现都 OK 之后，下面开始修改一些引导相关的配置。

- 修改 `/etc/fstab`，把 `type` 修改为 `btrfs`，把最后一行的 `fs_passno` 修改为 `0`，因为 btrfs 不在开机的时候做检查
- 如果使用的是 UUID 之类的话，还可能会需要修改 UUID，不过我是用的 PARTUUID，信息存储在 GPT 分区表中，修改文件系统并不会变化，因此不需要修改
- 因为转换的是根目录，因此还需要执行 `mkinitcpio -p linux` 以重建内存盘，我使用的是 `linux-zen` 内核，因此我还执行了 `mkinitcpio -p linux-zen`
- 如果用的是 `systemd-boot` 的话，不需要做什么额外的配置，用 grub 的同学要按照 wiki 的指示重新生成 `grub.config`

接下来就是我做的一些很勇的事情了，请各位同学不要模仿：为了能够充分用上 btrfs 的透明压缩功能，我对全盘执行了一次压缩并修改了 `/etc/fstab` 的挂载参数：

```bash
btrfs filesystem defragment -r -v -clzo /mnt
```

最后提示有两个 failure，只是当时我还没有明白这意味着什么。

![](failure.jpg)

## 弱者之愁

在压缩完毕后我重启并成功进入系统，于是高兴的在 archcn 的群中宣扬了一番：

![](alive.png)

后来 fc 教授提醒我需要删除 `ext2_saved` 并执行 `balance`，然后真正的故事开始了：

```bash
[ 1868.392801] BTRFS warning (device nvme0n1p2): csum failed root -9 ino 465 off 1048576 csum 0x9302c07f expected csum 0x98f94189 mirror 1
[ 1868.393966] BTRFS warning (device nvme0n1p2): csum failed root -9 ino 465 off 1048576 csum 0x9302c07f expected csum 0x98f94189 mirror 1
```

我的心情毫无波动，甚至有点想笑。

![](csum-failed.png)

之后在 fc 教授的指导下，查看了 btrfs 相关的各种信息，最后通过 inode 跟踪到了这个对应的错误文件，那是一个 golang 项目的 vendor 文件，所以我直接把这个文件删掉并执行了 `scrub` 任务。

```bash

Nov 14 23:16:03 thinkpad-x1-carbon systemd[1]: Started Btrfs scrub on /.
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]: ERROR: there are uncorrectable errors
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]: scrub done for 86fd5394-5a32-43cd-8ef5-5f3fbd46056e
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]:         scrub started at Wed Nov 14 23:16:03 2018 and finished after 00:00:44
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]:         total bytes scrubbed: 72.40GiB with 16 errors
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]:         error details: csum=16
Nov 14 23:16:47 thinkpad-x1-carbon btrfs[15376]:         corrected errors: 0, uncorrectable errors: 16, unverified errors: 0
Nov 14 23:16:47 thinkpad-x1-carbon systemd[1]: btrfs-scrub@-.service: Main process exited, code=exited, status=3/NOTIMPLEMENTED
Nov 14 23:16:47 thinkpad-x1-carbon systemd[1]: btrfs-scrub@-.service: Failed with result 'exit-code'.
```

虽然场面上很慌，但是我的心态出奇的好，感觉非常刺激。

![](scrub-failed.png)

后来通过 `dmesg` 查到了具体的出错信息：

```bash
[ 3392.226163] BTRFS warning (device nvme0n1p2): checksum error at logical 253848715264 on dev /dev/nvme0n1p2, physical 21546885120, root 5, inode 8127262, offset 3928064, length 4096, links 1 (path: var/log/journal/22c7d33d64ee4991ab100bf6abeb7ac7/user-1000@00056c232173e076-2815baa2d7d959be.journal~)
[ 3392.226167] BTRFS error (device nvme0n1p2): bdev /dev/nvme0n1p2 errs: wr 0, rd 0, flush 0, corrupt 1, gen 0
[ 3392.226169] BTRFS error (device nvme0n1p2): unable to fixup (regular) error at logical 253848715264 on dev /dev/nvme0n1p2
```

这个文件是 `systemd` 的一个日志文件，于是直接把这个文件删掉了（解决问题最快的方式就是搞定有问题的那个人~），然后重新执行 `scrub` 的任务，但是：

```bash
[ 3857.669742] BTRFS error (device nvme0n1p2): bdev /dev/nvme0n1p2 errs: wr 0, rd 0, flush 0, corrupt 25, gen 0
[ 3857.669743] BTRFS error (device nvme0n1p2): unable to fixup (regular) error at logical 253848748032 on dev /dev/nvme0n1p2
[ 3857.669861] BTRFS warning (device nvme0n1p2): checksum error at logical 253848752128 on dev /dev/nvme0n1p2, physical 21546921984, root 5, inode 8127262, offset 3964928: path resolving failed with ret=1
```

感觉坏的更严重了，通过 `logic number` 和 `inode` 号都查不到这个文件的信息：

```bash
:) sudo btrfs inspect-internal logical-resolve 253848752128 /
ERROR: logical ino ioctl: No such file or directory
:) sudo btrfs inspect-internal inode-resolve 8127262 /
ERROR: ino paths ioctl: No such file or directory
```

后来还是 fc 老师点醒了我：

> 我的意思是，scrub 發現了之後可能已經幫你刪掉了

于是我重新执行了一下 `scrub`：

```bash
scrub done for 86fd5394-5a32-43cd-8ef5-5f3fbd46056e
        scrub started at Wed Nov 14 23:35:39 2018 and finished after 00:00:44
        total bytes scrubbed: 72.37GiB with 0 errors
```

哈哈，修好啦！ **btrfs 真香！**

## 收工之喜

在全盘检查没有问题之后，我重新执行了 `balance`，并且顺利完成了。在庆祝收工之余，还进行了如下配置：

启用每月一次的全盘校验任务：

```bash
:) sudo systemctl enable btrfs-scrub@-.timer
:) sudo systemctl start btrfs-scrub@-.timer
```

因为我使用了 [`tlp`](https://wiki.archlinux.org/index.php/TLP)，按照 wiki 上的说法，我需要修改一个配置以避免文件系统损坏：

修改 `/etc/default/tlp` 文件中的 `SATA_LINKPWR_ON_BAT` 属性。wiki 要求是修改成 `max_performance`，但是配置文件中的注释提到：

```
# AHCI link power management (ALPM) for disk devices:
#   min_power, med_power_with_dipm(*), medium_power, max_performance.
# (*) Kernel >= 4.15 required, then recommended.
# Multiple values separated with spaces are tried sequentially until success.
```

因此我设置成了如下的值：

```
SATA_LINKPWR_ON_BAT="med_power_with_dipm max_performance"
```

## 参考

- [Btrfs 维基百科](https://zh.wikipedia.org/wiki/Btrfs)
- [Btrfs archwiki](https://wiki.archlinux.org/index.php/Btrfs_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))
- [Conversion from Ext3](https://btrfs.wiki.kernel.org/index.php/Conversion_from_Ext3)

## 动态

- iG 成功夺得 S8 世界总冠军，恭喜！iG 牛逼！
- 上个周末去了一趟红领巾公园，绕着转了三圈，完成了夜刷红领巾的任务
  - 第一圈的时候有点蒙圈，因为各种找不到 Po，走了不少回头路
  - 第二圈的时候感觉自己超强，身体和大脑都非常巅峰
  - 第三圈的时候累成傻逼，唯一的想法就是这任务怎么还没做完 = =
  - 后来去了朝阳大悦城，在一堆情侣中一个人吃了顿[越打星](http://www.dianping.com/shop/93355360)，我觉得海星
- 这周我的母上来了一趟北京
  - 我带着我最好的两个朋友过去一起吃了顿[四季民福](http://www.dianping.com/shop/10338660)
  - 期间多次提及找对象，买房，成家立业
  - 哎，我觉得我的心理年龄才 16 岁，总觉得结婚买房什么的好遥远啊
- 最近比较迷茫，干什么都有点提不起兴趣，是时候去寻找更好玩的东西了？
