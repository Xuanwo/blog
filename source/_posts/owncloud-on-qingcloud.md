---
title: 在QingCloud上部署弹性扩容的OwnCloud
date: 2016-06-03 08:00
categories: Opinion
tags: [QingCloud, Software, Work]
toc: true
---

## 前言

因为不满意百度云的一些缺陷，我们决定部署一套自己使用的云存储平台。希望得到的特性如下：

- 数据安全性高
- 权限控制能力强
- 分享功能更强，可以设置密码和过期时间等
- 允许匿名第三方上传数据
- 没有文件上传大小限制
- 支持多平台同步功能

综合考量之后，我们决定部署一套OwnCloud。

<!-- more -->

## 部署

在部署之前，我们首先要考虑这套系统大概会有多少人用，会使用多大的空间，需要多少带宽，服务器的配置等问题。但是非常有意思的事情是，在青云QingCloud平台上，一切都是可以动态扩容的，所以我们完全可以以最少的资源验证服务是否符合需求，然后再增加服务所使用的资源。

### 资源编排

在实际生成需要的资源之前，我们先通过青云QingCloud的提供的资源编排功能看看青云是否能够满足我们的需求以及搭建这一套服务需要多少钱：

![](/imgs/Opinion/qingcloud-owncloud-1.png)

如图所示，我们在一个私有网络中创建了一台主机和一个数据库，并为整个VPC网络分配了一个公网IP和防火墙。整套资源预计需要每小时0.57元。

### 创建并修改配置

生成模板之后，我们点击创建。等待大概一分钟之后，所有资源全部创建完毕。在我们SSH连接上服务器开始实际的配置工作之前，我们先修改VPC的设置。

#### 添加端口转发规则

我们需要将来自公网的流量转发到我们的主机上，主要有两条，一个是SSH，一个是HTTP。

![](/imgs/Opinion/qingcloud-owncloud-2.png)

首先我们知道主机的内网地址是`192.168.0.2`，所以需要把所有来自22和80的端口都转发到这个地址。

#### 添加防火墙规则

出于安全性考虑，青云的防火墙默认只开放了22和ICMP。为了可以正常访问到主机，我们还需要添加80端口的例外规则：

![](/imgs/Opinion/qingcloud-owncloud-3.png)

我们看到青云在右边提供了常用端口的配置，选择http即可。

### 安装OwnCloud

OwnCloud为CentOS平台提供了二进制的包，没有特殊需求的话，我们直接使用即可。
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

### 启用httpd，并测试是否安装正确

OwnCloud默认使用Apache作为Web服务器，上一步我们已经安装了Apache，接下来我们需要启用它：

```bash
systemctl start httpd
```

如需要开机自行启动，可以输入：

```bash
systemctl enable httpd
```

然后在浏览器中访问：`http://<your ip>/owncloud`，如果出现OwnCloud的安装界面，说明已经配置成功了。

### 使用LVM管理分区，实现空间动态扩容

OwnCloud在安装的时候只能选择一个目录，为了能够实现空间的动态扩容，我们需要使用LVM创建一个逻辑分区并挂载到指定的数据目录下。

首先我们在青云QingCloud的控制台中创建一块硬盘，然后挂载到主机中。之后，我们就能够通过`/dev/sdb`等形式来访问这块硬盘。

> 需要注意的是，主机在每次重启的时候硬盘的顺序可能会发生改变，所以如果需要自动挂载的话，需要使用UUID或者LABLE的方式来指定硬盘，不能使用设备名。

接下来我们需要在CentOS下使用LVM来配置分区，实现分区的动态扩容。

#### 安装LVM工具

青云QingCloud提供的CentOS 7.2默认映像是没有LVM工具的，所以我们首先需要安装它：

```bash
yum install lvm2
```

#### 创建物理卷（PV）

首先检测能够被作为物理卷的设备：

```bash
lvmdiskscan
```

然后在指定设备上创建物理卷，所有需要用到的设备都需要执行如下命令：

```bash
pvcreate /dev/sdb
```

然后查看我们已经创建好的物理卷：

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

#### 创建卷组（VG）

物理卷创建完毕后，我们需要创建一个卷组来实现物理卷的统一管理：

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
 System ID             
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

#### 创建逻辑卷（LV）

然后我们可以开始创建逻辑卷了：

```bash
lvcreate -L 900G owncloud-vg -n owncloud-data
```

创建完毕后，我们就可以通过`/dev/mapper/owncloud--vg-owncloud--data`或者`/dev/owncloud-vg/owncloud-data`来访问这个设备了。

如果需要扩大逻辑卷，我们可以使用：

```bash
lvextend -L 1000G /dev/owncloud-vg/owncloud-data
```

确认扩展成功后，我们再更新文件系统：

```bash
resize2fs /dev/owncloud-vg/owncloud-data
```

#### 创建文件系统并挂载

我们在逻辑卷上创建一个ext4分区：

```bash
mkfs.ext4 /dev/mapper/owncloud--vg-owncloud--data
```

然后将分区挂载到我们期望的目录下，比如`/data`

```bash
mount /dev/mapper/owncloud--vg-owncloud--data /data
```

### 修改文件夹权限

为了OwnCloud能够正确读写我们的数据分区，我们需要修改`/data`的所有者和权限：

```bash
chown -R apache:apache /data
chmod 775 /data -R
```

### 网页安装OwnCloud

全部配置完毕后，我们可以开始在网页进行OwnCloud安装了。

管理员帐号： 自定义
管理员密码： 自定义
数据路径：`/data`
数据库用户：`root`
数据库密码：`<your password>`
数据库名称自定义，比如：`owncloud`
数据库地址：`<your rdb ip>`

> 你在创建RDB时，系统会自动用相同的密码创建Root用户。OwnCloud在安装时需要创建一个新的账户来进行管理，而青云提供的默认用户没有这样的权限。因此我们需要使用Root用户而不是创建时指定的用户。

提示创建完毕后，就可以使用管理员用户登陆了。

## 应用

下面我们来聊一聊OwnCloud的一些应用。

### 分享功能

![](/imgs/Opinion/qingcloud-owncloud-4.png)

分享功能是我比较看重的一个部分。OwnCloud的分享可以选择用户和组，然后还能通过链接进行分享。通过链接分享时，可以指定密码和过期时间，还能允许编辑。这样就可以实现给用户发送需要的资料以及收集来自合作伙伴的视频，文件等功能。

### 团队协作

OwnCloud内建了一个版本管理功能，同一个文件可以提供多个历史版本，这样方便大家进行版本追溯和管理，为团队协作编辑提供了便利。除此以外还有评论系统，实时性能还不错，基本可以用于对具体文档的简单协作。

# 更新日志

- 2016年06月03日 首次发布
