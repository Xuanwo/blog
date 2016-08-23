---
title: nodebb-plugin-html5videoplayer 发布
date: 2016-8-22 17:53:25
tags: [Node.js, NodeBB, JavaScript]
categories: Developer
toc: true
---

[nodebb-plugin-html5videoplayer]() 是一个简单的 NodeBB 插件，可以让 NodeBB 支持在线视频观看。Fork 自 @ 开发的 [nodebb-plugin-videoplayer]， 在他的基础上做了一些微不足道的贡献，括弧笑。

<!-- more -->

# 原理

原理非常简单，将帖子中出现的：

```
<a href="xxx.mp4"></a>
```

标签转换为

```
<video preload controls>
  <source src="xx.mp4">
</video>
```

也就是完全通过 HTML5 提供的 video 标签来实现在线视频的观看功能。

# 区别

世上轮子千千万，我为什么要Fork原来的再造一个？

最关键的因素在于我跟原作者的理念不太一样，原作者除了插入 video 标签以外，还提供了一个固定在下面下方的播放器控制条。由于版本更迭，这个播放器控制条已经失效，CSS 样式也不再适用。因此我 Fork 了原作者的插件，并上传了一个新的插件，旨在提供更简单的在线视频视频集成功能。

跟原来版本的区别主要如下：

- 纯粹的播放器，没有多余的功能，不会修改任何页面外观
- 页面自适应，播放窗体会自适应当前页面大小，提供跨平台一致的体验
- 更强的外链支持，可以引用外部的链接，不需要上传到论坛

# 安装

目前还不知道怎么提交到 NodeBB 的插件的中心，因此只能通过 npm 手动进行安装：

```
npm install nodebb-plugin-html5videopalyer
```

# 使用

使用起来非常简单，只需要在帖子中拖动上传视频

```
[video](/uploads/files/xyz.mp4)
```

或者直接输入引用的视频链接

```
[video](//aa.com/bb/cc.mp4)
```

> 目前仅支持`mp4`，`ogv`,`webm`,`mov`这四种格式
> 引用的外链需要去掉协议头，否则无法正常解析

# Demo

最后显示的效果可以参考这个链接： https://community.qingcloud.com/topic/556
