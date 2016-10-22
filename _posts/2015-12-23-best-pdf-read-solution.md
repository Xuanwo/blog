---
layout: post
title: 最佳跨平台PDF阅读解决方案
date: 2015-12-23 16:15:20
tags: [Software, Read, Windows, Android]
categories: Opinion
toc: true
---
# 前言
最近因为学习需要，要大量阅读纯文字的PDF文档。然后我惊讶地发现市场上居然没有哪家提供一套完整可用的跨平台PDF阅读解决方案，于是我在尝试了市面几乎所有叫得上名字的各类阅读器之后，形成了一套自己的跨平台PDF阅读解决方案。本文记录了这套方案的详细内容，希望会有所益处。

<!-- more -->

# 目标
- 跨平台（目前支持Windows和Android）
- 阅读记录同步
- 支持标准PDF的批注和高亮等功能
- 对PDF文件管理方便

# 思路
标准PDF的批注和高亮功能是内嵌在PDF文件中的，只要同步了PDF文件，也就同步了所有在PDF文件上的批注和高亮。因此这个问题很大程度上就变成了解决跨平台文件双向同步问题。

> 跨平台双向同步在很多人看来是一个已经被Dropbox以及Google Drive解决了问题，但是实际上，它们在PC和移动端的行为是不一样的。PC端是完整的双向同步，而在移动端，为了节省流量和空间，它们都是提供了一个File list，你必须要自己下载指定文件。不仅如此，这个下载下来的文件大多是Read-Only的，用阅读器批注之后，你会发现这个文件无法保存，这样的话，PDF跨平台批注就无从谈起。

# 解决方案
按照上面思路中的讨论，我在每一个平台上的解决方案都分成两个部分，第一是解决PDF阅读、批注问题，第二是解决PDF文件双向同步问题。

## Windows
### Goodsync

![Goodsync](/imgs/opinion/goodsync.png)
[**Goodsync**](http://www.goodsync.com/)是一款非常强大的同步工具，我们通过它来提供本地到Google Drive的双向同步功能。

> 如果通过SS艹墙，配置Google Drive时请勾选`基于WinInet`，如图：![Goodsync Proxy Setting](/imgs/opinion/goodsync-proxy-setting.png)

### Foxit Reader

![Foxit Reader](/imgs/opinion/foxit-reader.png)
[**Foxit Reader**](http://www.foxitsoftware.cn/)，也就是福昕阅读器，不多说了，新版的界面还是可以的。（尽管我觉得颜值没有Adobe Reader DC高）

> 为什么不选Adobe？Adobe最新版本的批注功能在特定的PDF上好像有点问题，我尝试了几个都不能正常保存，总是提示错误110，无奈放弃。

## Android
### Flodersync

![Flodersync](/imgs/opinion/Flodersync.png)
[**Flodersync**](https://play.google.com/store/apps/details?id=dk.tacit.android.foldersync.lite)是一款基于安卓平台的非常棒的一款应用，我们通过它来实现安卓平台的双向同步。

> 开启双向同步请取消勾选`不同步删除`

### Moon+

![Moon+](/imgs/opinion/Moon.png)
[**Moon+**](https://play.google.com/store/apps/details?id=com.flyersoft.moonreader)，静读天下，安卓平台上首屈一指的阅读器，支持格式众多，速度流畅，除了免费版有些功能阉割和广告之外，没有别的问题。

# 更新日志
- 2015年12月23日 初始发布
