---
layout: post
title: 在线视频下载完整解决方案
date: 2015-12-18 12:49:49
tags: [Software, Video]
categories: Opinion
toc: true
---


因为学习需要，产生了一个这样的需求：要从Youtube上批量下载视频。自然，出于方便使用的角度来看，音画不能分离，最好带有对应的字幕。一番搜罗之后，我找到了基于Python的开源产品： [youtube-dl](https://rg3.github.io/youtube-dl/)

> 值得一提的是，youtube-dl不仅仅能下载youtube上的视频，它支持的视频链接种类多达700+种，几乎囊括了所有在线视频网站，列表参见[此处](https://rg3.github.io/youtube-dl/supportedsites.html)。让我不由得感慨开源的力量。除此以外，某些不存在的网址需要自备梯子，不再赘述。

<!-- more -->

# 获取

> checked on 2015-12-18

## Windows
Windows用户可以使用已经打包好的可执行程序：[下载链接](https://yt-dl.org/downloads/2015.12.13/youtube-dl.exe)

## UNIX like
类UNIX系统的用户可以使用curl或者wget来获取可执行文件

### curl
``` bash
sudo curl https://yt-dl.org/downloads/2015.12.13/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

### wget
``` bash
sudo wget https://yt-dl.org/downloads/2015.12.13/youtube-dl -O /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
```

## Homebrew
Homebrew用户可以使用如下命令进行安装：
``` bash
brew install youtube-dl
```

## pip
同样的，你也可以使用pip来安装它。
``` bash
sudo pip install --upgrade youtube_dl
```

## Source
自然，你可以选择下载源代码以及docs，链接[见此](https://yt-dl.org/downloads/2015.12.13/youtube-dl-2015.12.13.tar.gz)

# 使用

## 简易
最简单的方式就是直接加上视频链接地址就可以自动下载到当前文件夹：
``` bash
youtube-dl.exe url
```

## 使用代理
以常见的ss代理为例：
``` bash
youtube-dl.exe url --proxy http://127.0.0.1:1080
```

> 有一个坑点在于这个参数只支持HTTP/HTTPS代理，所以本地跑SS的话，需要在前面加上一个HTTP的前缀，否则代理不会正常工作。

## 下载列表
以Youtube Playlist为例：
``` bash
youtube-dl.exe --yes-playlist https://www.youtube.com/playlist?list=PLZlv_N0_O1gZg3dTMetmsfm_s4lb4-Tg0 --proxy http://127.0.0.1:1080
```

## 下载字幕
以Youtube Playlist为例，自动生成字幕并指定下载中文和英文字幕：
``` bash
youtube-dl.exe --yes-playlist https://www.youtube.com/playlist?list=PLZlv_N0_O1gZg3dTMetmsfm_s4lb4-Tg0 --proxy http://127.0.0.1:1080 --write-auto-sub --sub-lang en,cn
```

字幕相关设定：
``` bash
--write-sub                      写字幕文件
--write-auto-sub                 写入自动生成的字幕文件 (YouTube only)
--all-subs                       下载所有可提供的字幕
--list-subs                      列出当前视频支持的所有字幕
--sub-format FORMAT              指定字幕格式，比如 "srt" 或者 "ass/srt/best"
--sub-lang LANGS                 指定字幕语言，用`,`分隔, 使用 IETF 语言标记，比如 'en,pt'
```

> IETF语言标记参见[此处](http://www.ietf.org/assignments/language-subtag-registry/language-subtag-registry)

# 更新日志
- 2015年12月18日 首次发布