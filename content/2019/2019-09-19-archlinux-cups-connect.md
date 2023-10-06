---
categories: Daily
date: 2019-09-19T01:00:00Z
tags:
- Archlinux
series: "Satisfy Curiosity"
title: Archlinux 连接并使用打印机
url: /2019/09/19/archlinux-cups-connect/
---

一直觉得折腾打印机很麻烦，所以每次都是让朋友 F 帮我打印各种材料。但是现在朋友 F 已经离职了，所以只能自己想办法搞了。本文会首先介绍操作系统与打印机通讯的原理，然后讲解如何在 Archlinux 连接并使用打印机，最后介绍常见的故障排除手段。

## 打印系统

### 假脱机(spool)

> 在信息学中，假脱机（外部设备联机并行操作，SPOOL,Simultaneous Peripheral Operations On-line）是一种数据缓冲，指传输数据的过程中，将数据存放在临时工作区中。其它程序可以在之后的任意时间点对其存取。通常英语动词 spool 可以指储存设备的行为，具体表现为物理意义上的缠或卷，就比如说磁带机。最常见的假脱机的应用是打印缓存，即把打印任务加入到队列。

UNIX 和 Linux 系统会为每一个打印机创建一个任务队列，交由一个假脱机程序来管理。其他程序将打印任务提交给这个假脱机程序，然后它就会进行一系列的过滤操作最后发送到打印机上。最初大家都是用的 BSD 打印子系统，其中包含一个守护进程 lpd 和客户端命令 lpr。这个系统由 IETF 实现标准化，成为 [RFC 1179](https://www.ietf.org/rfc/rfc1179.txt) 中所述的行式打印机守护程序协议。随着打印技术的不断发展，大家也在不断的对打印系统做改进，比如 [LPRng](http://lprng.sourceforge.net/) 和 [CUPS](https://www.cups.org/)，可以支持在同一个页面上使用不同字体，支持打印图像，支持打印变宽字体，支持字距调整和连字等。

目前使用最广泛的打印系统是 CUPS，也是 Archlinux 和很多其他 Liunx 发行版缺省的打印系统。

### PostScript

PostScript 是主要用于电子产业和桌面出版领域的一种页面描述语言和编程语言，在 1984 年由 Adobe 开发并推向市场，在乔布斯的敦促下被改进为驱动激光打印机的语言，后来加入到 Conon 打印机中，带来了 [Apple LaserWriter](https://en.wikipedia.org/wiki/LaserWriter)，引发了二十世纪八十年代中期的桌面印刷革命，并由此成为业界标准。其后继者是同样由 Adobe 开发的 [PDF(Portable Document Format)](https://en.wikipedia.org/wiki/PDF)。

### CUPS

CUPS 打印系统会在本地启动一个名为 cupsd 的守护进程，它将会维护打印机和打印队列，自带 Web 管理工具(http://localhost:631)。

CUPS 通过 AppSocket，IPP，LPD 等多种协议来连接到打印机并创建任务队列，之后应用程序将文件发送给 CUPS 守护进程，CUPS 通过 MIME 类型来确定文件的转换过滤器，将输入文件转换为 PostScript 格式或者其他类型，然后再发送给打印机。

## 连接并使用

### 安装 CUPS

```bash
pacman -S cups
```

可选择安装的其他包：

- [`cups-pdf`](https://www.archlinux.org/packages/extra/x86_64/cups-pdf/) 包可以在本地启动一个打印为 PDF 的虚拟打印机。
- [`print-manager`](https://www.archlinux.org/packages/extra/x86_64/print-manager/) 是 KDE 提供的打印机和打印任务图形化管理界面
- [`system-config-printer`](https://www.archlinux.org/packages/extra/x86_64/system-config-printer/) 是 GTK 下的图形化管理界面，还有 applet 支持

### 启动守护进程

```bash
systemctl start org.cups.cupsd.service
```

默认情况下无需其他配置，可以访问 localhost:631 来查看服务是否正常启动

### 添加打印机

> 以 KDE 下使用 print-manager 为例，其他的平台应该大同小异

点击添加打印机开始添加，第一步是选择打印机协议和输入 IP 地址，根据自己打印机的实际情况进行选择：

![](1st.png)

第二步选择打印机驱动：

![](2nd.png)

没有找到对应的驱动，则需要自行安装，可以按照如下顺序寻找：

- [AUR](https://aur.archlinux.org/)，google 搜索 `AUR + 设备型号` 一般就能找到
- [Printer Listings](http://www.openprinting.org/printers)，OpenPrinting 提供的打印机驱动，放在 `/usr/share/cups/model/` 下
- 设备供应商网站，放在 `/usr/share/cups/model/` 下

最后填写一些打印机的相关描述信息即可，建议写清楚一些，以免以后分不清不同打印机的位置：

![](3rd.png)

打印机添加完毕后可以选择打印测试页来进行测试。

### 使用打印机

只需要在应用程序的菜单中点击打印然后选择刚才添加的打印机即可。

## 常见故障

### 无法连接上打印机

检查网络，防火墙等配置，检查 IP 地址是否输入错误。

### 连接上打印机，但是提交任务时报错 "Print job was not accepted."

首先检查自己选择的协议是否正确，然后检查自己选择的驱动是否正确

## 相关资料

- [学习 Linux，101: 管理打印机和打印](https://www.ibm.com/developerworks/cn/linux/l-lpic1-108-4/index.html) 教程从 [LPIC-1](http://www.lpi.org/) 备考的角度介绍了管理和使用打印机的相关知识
- [OpenPrinting](https://wiki.linuxfoundation.org/openprinting/start) 提供了驱动程序，打印机支持等资源和信息
- 维基百科词条 [PostScript](https://zh.wikipedia.org/wiki/PostScript) 详细地介绍了 PostScript 的前世今生
