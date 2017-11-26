---
categories: Opinion
date: 2016-06-03T00:00:00Z
tags:
- QingCloud
- Software
- Work
title: 在QingCloud上部署弹性扩容的OwnCloud
toc: true
url: /2016/06/03/owncloud-on-qingcloud/
---

因为实在不满意百度云的一些缺陷，我们最终决定部署一套团队内部使用的云存储平台，用于团队协作及资料长期存储。希望能够达到如下目标：

- 数据安全性高
- 权限控制能力强
- 分享功能更强，可以设置密码和过期时间等
- 允许匿名第三方上传数据
- 没有文件上传大小限制
- 支持多平台同步功能

综合考量各开源项目之后，我最终选定基于QingCloud部署一套开源存储项目OwnCloud。

<!--more-->

# 部署

在部署之前，我们首先要考虑这套系统大概会有多少人用，会使用多大的空间，需要多少带宽，服务器的配置等问题。我们现在有几个TB的数据，10人使用，未来人数无法预估，各资源使用量也无法预估。但是非常有意思的事情是，在青云QingCloud平台上，一切都是可以动态扩容的，所以我完全可以以最少的资源验证服务是否符合需求，然后再增加服务所使用的资源。

整个部署过程概括为如下4步：

- 验证功能及预估花费
- 在QingCloud上创建主机、网络等资源并修改配置
- 安装OwnCloud环境
- 使用LVM管理分区，实现空间动态扩容
- 在网页端安装OwnCloud

## 资源编排

在实际生成需要的资源之前，我先通过青云QingCloud的提供的资源编排功能看看青云是否能够满足我们的需求以及搭建这一套服务需要多少钱：

![](/imgs/opinion/qingcloud-owncloud-1.png)

如图所示，我们在一个私有网络中创建一台主机和一个数据库，并为整个VPC网络分配了一个公网IP和防火墙。

![](/imgs/opinion/qingcloud-owncloud-tp.png)

如图，整套资源预计需要每小时0.56元。

## 创建并修改配置

生成模板之后，点击创建。等待大概一分钟之后，所有资源全部创建完毕。在SSH连接上服务器开始实际的配置工作之前，需要先修改VPC的设置。

### 添加端口转发规则

我需要将来自公网的流量转发到我的主机上，主要有两条，一个是SSH，一个是HTTP。

![](/imgs/opinion/qingcloud-owncloud-2.png)

主机的内网地址是`192.168.0.2`，所以需要把所有来自22和80的端口都转发到这个地址。

### 添加防火墙规则

出于安全性考虑，青云的防火墙默认只开放了22和ICMP。为了可以正常访问到主机，还需要添加80端口的例外规则：

![](/imgs/opinion/qingcloud-owncloud-3.png)

我们看到青云在右边提供了常用端口的配置，选择http即可。

## 安装OwnCloud

OwnCloud为CentOS平台提供了二进制的包，没有特殊需求的话，直接使用即可。
首先添加OwnCloud官方的Key文件：

```bash
rpm --import https://download.owncloud.org/download/repositories/stable/CentOS_7/repodata/repomd.xml.key
```

然后添加OwnCloud的repo：

```bash
wget http://download.owncloud.org/download/repositories/stable/CentOS_7/ce:stable.repo -O /etc/yum.repos.d/ce:stable.repo
```

更新repo之后开始安装：

```bash
yum clean expire-cache
yum install owncloud
```

yum将会自动处理依赖，如果速度不佳的话，可以直接将包下载到本地：[直接下载](http://download.owncloud.org/download/repositories/stable/CentOS_7/)

## 启用httpd，并测试是否安装正确

OwnCloud默认使用Apache作为Web服务器，上一步已经安装了Apache，接下来需要启用它：

```bash
systemctl start httpd
```

如需要开机自行启动，可以输入：

```bash
systemctl enable httpd
```

然后在浏览器中访问：`http://<your ip>/owncloud`，如果出现OwnCloud的安装界面，说明已经配置成功了。

## 使用LVM管理分区，实现空间动态扩容

OwnCloud在安装的时候只能选择一个目录，为了能够实现空间的动态扩容，需要使用LVM创建一个逻辑分区并挂载到指定的数据目录下。

首先在青云QingCloud的控制台中创建一块硬盘，然后挂载到主机中。之后，就能够通过`/dev/sdb`等形式来访问这块硬盘。

> 需要注意的是，主机在每次重启的时候硬盘的顺序可能会发生改变，所以如果需要自动挂载的话，需要使用UUID或者LABLE的方式来指定硬盘，不能使用设备名。

接下来需要在CentOS下使用LVM来配置分区，实现分区的动态扩容。

### 安装LVM工具

青云QingCloud提供的CentOS 7.2默认映像是没有LVM工具的，所以首先需要安装它：

```bash
yum install lvm2
```

### 创建物理卷（PV）

首先检测能够被作为物理卷的设备：

```bash
lvmdiskscan
```

然后在指定设备上创建物理卷，所有需要用到的设备都需要执行如下命令：

```bash
pvcreate /dev/sdb
```

然后查看已经创建好的物理卷：

```bash
pvdisplay
```

输出大概如下：

```bash
--- Physical volume ---
 PV Name               /dev/sdb
 PV Size               1000.00 GiB / not usable 4.00 MiB
 Allocatable           yes
 PE Size               4.00 MiB
 Total PE              255999
 Free PE               255999
 Allocated PE          0
 PV UUID               EHIeTJ-WBPv-rQkQ-LnuI-0IWE-SM4z-bMPAWx
```

### 创建卷组（VG）

物理卷创建完毕后，需要创建一个卷组来实现物理卷的统一管理：

```bash
vgcreate owncloud-vg /dev/sdb /dev/sdc /dev/sdd
```

后续如果需要扩展的话，可以使用如下命令：

```bash
vgextend owncloud-vg /dev/sde
```

同样地，使用`vgdisplay`来查看创建好的卷组：

```bash
--- Volume group ---
 VG Name               owncloud-vg
 Format                lvm2
 Metadata Areas        1
 Metadata Sequence No  2
 VG Access             read/write
 VG Status             resizable
 MAX LV                0
 Cur LV                1
 Open LV               1
 Max PV                0
 Cur PV                1
 Act PV                1
 VG Size               1000.00 GiB
 PE Size               4.00 MiB
 Total PE              255999
 Alloc PE / Size       230400 / 900.00 GiB
 Free  PE / Size       25599 / 100.00 GiB
 VG UUID               xCCtSR-QFcZ-StcI-HM7O-KDAz-PvMC-EgYcSV
```

### 创建逻辑卷（LV）

然后就可以开始创建逻辑卷了：

```bash
lvcreate -L 900G owncloud-vg -n owncloud-data
```

创建完毕后，就可以通过`/dev/mapper/owncloud--vg-owncloud--data`或者`/dev/owncloud-vg/owncloud-data`来访问这个设备了。

如果需要扩大逻辑卷，可以使用：

```bash
lvextend -L 1000G /dev/owncloud-vg/owncloud-data
```

确认扩展成功后，再更新文件系统：

```bash
resize2fs /dev/owncloud-vg/owncloud-data
```

### 创建文件系统并挂载

在逻辑卷上创建一个ext4分区：

```bash
mkfs.ext4 /dev/mapper/owncloud--vg-owncloud--data
```

然后将分区挂载到期望的目录下，比如`/data`

```bash
mount /dev/mapper/owncloud--vg-owncloud--data /data
```

## 修改文件夹权限

为了OwnCloud能够正确读写数据分区，需要修改`/data`的所有者和权限：

```bash
chown -R apache:apache /data
chmod 775 /data -R
```

## 网页安装OwnCloud

全部配置完毕后，可以开始在网页进行OwnCloud安装了。

管理员帐号： 自定义
管理员密码： 自定义
数据路径：`/data`
数据库用户：`root`
数据库密码：`<your password>`
数据库名称自定义，比如：`owncloud`
数据库地址：`<your rdb ip>`

> 在创建RDB时，系统会自动用相同的密码创建Root用户。OwnCloud在安装时需要创建一个新的账户来进行管理，而青云提供的默认用户没有这样的权限。因此需要使用Root用户而不是创建时指定的用户。

提示创建完毕后，就可以使用管理员用户登陆了。

# 维护

## 自动备份

一个存储类的应用，必须要有自动备份的功能，保证用户在最坏的情况下都能找回他们的数据，对于存储着工作资料的私有云存储而言更是如此。所以，需要对主机，硬盘和数据库进行定时备份。

### 主机和硬盘

青云QingCloud 提供了一个叫定时器的功能，可以设置在每天的三点重复执行备份任务。

首先创建一个定时器，每天3：00重复执行：

![](/imgs/opinion/qingcloud-owncloud-backup-1.png)

然后在该定时器中添加对应的定时器任务：

![](/imgs/opinion/qingcloud-owncloud-backup-2.png)

选中需要备份的主机和硬盘即可。

### 数据库

青云QingCloud 上的数据库自带自动备份功能，只需要开启它。

在需要备份的数据库上右击，选择`修改自动备份策略`：

![](/imgs/opinion/qingcloud-owncloud-backup-3.png)

> 青云QingCloud 首次备份是全量备份，之后是增量备份。当变化较大时，会自动创建新的备份链。

## 自动伸缩

云存储服务的一个最显著的特点是有明显的高峰期，如果能够实现高峰期时自动增加带宽，低峰期时自动降低带宽就能够节省昂贵的带宽费用的目的。青云QingCloud提供的自动伸缩就能有效地满足这一痛点。

首先创建一个自动伸缩策略：

操作类型为调整公网IP带宽上限，然后选择需要自动伸缩的资源。

![](/imgs/opinion/qingcloud-owncloud-autoscaling-1.png)

然后添加带宽提高和降低的触发条件：

以带宽提高为例，我们可以在公网进流量连续15分钟平均值大于当前带宽的80%时提高带宽。

> 青云QingCloud的监控周期为5分钟，而数据采样周期为1分钟。

![](/imgs/opinion/qingcloud-owncloud-autoscaling-2.png)

最后添加操作参数：

可以设置每次提高5Mbps，最高允许的带宽为20Mbps。

![](/imgs/opinion/qingcloud-owncloud-autoscaling-3.png)


## 硬盘扩容

硬盘扩容有两种方式，第一是硬盘自身的纵向扩容，提升硬盘的大小；第二是硬盘数量的横向扩容，提升硬盘的个数。下面分别讲一讲。

### 纵向扩容

首先暂停服务：

进入 Owncloud 所在文件夹，修改`config`文件夹下的`config.php`文件，将`maintenance`修改为`true`。这样 Owncloud 就会进入维护模式，从而防止在扩容期间出现意外的数据丢失。

然后从系统中卸载数据盘：

```
umount /data
```

然后就可以在青云的控制台中卸载这块磁盘，并执行扩容操作。**一定要先在系统中卸载，再在青云的控制台中卸载，否则会出现不可恢复的数据丢失。**

等到青云提示扩容完成后，再将这块盘挂载到主机上，并执行

```
pvresize /dev/sdx
```

来自动探测设备当前大小并将物理卷扩展到其最大容量

之后就可以扩容逻辑卷的大小了：

```
lvextend -l 100%VG owncloud-vg/owncloud-data
```

这个命令会将这个VG的所有空间分配到我们的LV当中。

然后将这个逻辑卷挂载到我们的数据分区：

```
mount /dev/mapper/owncloud--vg-owncloud--data /data
```

然后我们需要让文件系统也检测到空间的变更：

```
resize2fs /dev/mapper/owncloud--vg-owncloud--data
```

至此，空间扩容完毕，可以再将`config.php`中的`maintenance`修改为`false`，开始正常对外提供服务。

### 横向扩容

横向扩容相对比较简单一些。

首先将Owncloud置于维护模式，然后在青云的控制台上创建一块新的盘挂载到系统中，然后执行：

```bash
pvcreate /dev/sdx
```

以将这个卷转换为一个物理卷。

之后就可以将这个物理卷加入到一个VG中：

```bash
vgextend owncloud-vg /dev/sdx
```

之后的操作跟纵向扩容相似，扩大LV，重新挂载，更新文件系统，退出维护模式等，不再赘述。

# 应用

下面来聊一聊OwnCloud的一些应用。

## 分享功能

![](/imgs/opinion/qingcloud-owncloud-4.png)

分享功能是我比较看重的一个部分。OwnCloud的分享可以选择用户和组，然后还能通过链接进行分享。通过链接分享时，可以指定密码和过期时间，还能允许编辑。这样就可以实现给用户发送需要的资料以及收集来自合作伙伴的视频，文件等功能。

## 团队协作

OwnCloud内建了一个版本管理功能，同一个文件可以提供多个历史版本，这样方便大家进行版本追溯和管理，为团队协作编辑提供了便利。除此以外还有评论系统，实时性能还不错，基本可以用于对具体文档的简单协作。

![](/imgs/opinion/qingcloud-owncloud-show-1.png)

# 更新日志

- 2016年06月03日 首次发布
- 2016年06月11日 增加自动备份和自动伸缩的配置
- 2016年08月20日 增加了硬盘空间的横向与纵向扩容
