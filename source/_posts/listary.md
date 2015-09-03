title: Listary——让文件在指尖流动
date: 2015-7-28 21:48:32
tags: [Software, Windows]
categories: Opinion
toc: true
---
# 前言
今天想为大家介绍的是我使用了两年的神器——[Listary](http://www.listary.com/)，作为一款Windows文件浏览增强工具，它为Windows自带的资源管理器添加了很多实用的功能，包括智能命令、最近文档以及收藏功能。与此同时，它还能与很多第三方应用集成，包括鼎鼎大名的Total Commander，还有WinRAR，7zip，FileZilla等等。
值得一提的是，Listary由国人Channing开发，默认添加了简体中文支持，是不可多得的精品，典型的墙内开花墙外香的典范。可能是由于国人还并不是非常重视效率这个方面，感觉使用Listary的主要人群还是集中在国外，从Listary的论坛上也能看得出来。所以我完成了这样一篇文章，希望我也能为这样的精品应用在国内的推广做出些贡献。
恩？说我是水军？唔，谁说我不是呢？
*官网上的广告语`Keep files at your fingertips`被我翻译成了`让文件在指尖流动`，不知道Channing会怎么想~*

<!-- more -->

# 初步使用
## 基础配置
![Listary设置页面](//dn-xuanwo.qbox.me/opinion/listary-setting.png)
如果是第一次安装，Listary会有一个引导教程，建议大家都跟着操作一下。在教程的最后会让你设置一个激活Listary的快捷键，这个快捷键的设置完全可以根据自己的喜好来设置，只要不跟系统或者别的软件热键相冲突即可。我使用的是`Alt+Q`，感觉十分顺手，推荐大家也这样设置~

## 基础用法
![Listary主窗体](//dn-xuanwo.qbox.me/opinion/listary-main.png)
在任一窗体下使用快捷键`Alt+Q`即可激活Listary，同时光标会自动定位在Listary的输入窗口
，只要直接开始输入，Listary就自动进行匹配了。使用快捷键`Alt+Q`可以在启动程序模式与常规模式间进行切换。
Listary的匹配总共有三种，分别为命令，路径，启动程序，下面分别介绍一下。
- 命令：包括一些常用的系统命令，如打开命令行（基于当前路径）等。
- 路径：返回匹配的文件以及路径（只要是文件或者路径的一部分都可以识别）
- 启动程序：可以启动预先设置的路径中的程序（再次使用快捷键`Alt+Q`就可以在启动程序与常规模式间进行切换）

## 收藏功能
![Listary收藏功能](//dn-xuanwo.qbox.me/opinion/listary-loves.png)
激活Listary之后点击有爱心标识的收藏按钮，就可以打开自己的收藏列表，能够更快捷的打开自己常用的软件或者文件。

## 历史记录
![Listary历史记录](//dn-xuanwo.qbox.me/opinion/listary-history.png)
激活Listary之后点击历史记录，就可以打开自己最近打开的文件或者文件夹。

## 快捷功能
![Listary快捷功能](//dn-xuanwo.qbox.me/opinion/listary-quick.png)
激活Listary之后点击快捷功能，就可以弹出一些常用的功能，个人最喜欢的是显示隐藏文件和显示文件扩展名，相当的好用~

# 常用功能
## 智能匹配
只要输入文件名的一部分就可以找到这个文件，支持中文与英文。
比如，我输入`测试 md`就可以搜索到`测XX试OO.md`这个文件。
自然，输入的越多，返回的结果越精确。随着使用记录的积累，常用的文件或程序会获得更高的优先级。

## 全盘搜索
使用与[Everything](http://www.voidtools.com/)相似的原理，通过遍历USN journal更新索引，可以实现秒级的索引建立与搜索反馈（只支持NTFS文件系统，FAT32等不支持）。结合前面的智能匹配功能，你可以轻易地找到在你硬盘中的每一个文件。

## 快速选择
![Listary快速选择](//dn-xuanwo.qbox.me/opinion/listary-quick-switch.png)
在任意一个打开的资源管理器界面（焦点需要锁定在资源管理器界面上），输入关键字，光标会自动跳转到当前文件夹中匹配的文件或者目录上。你只要直接回车就可以打开自己想要的文件，而不需要再去使用鼠标双击打开。真正的让文件在指尖舞蹈~

# Pro版功能

# 进阶技巧

# 尾言
Channing已经跳票很久了，Listary 5 据说完成度还是不够高，连预览版都木有放出来。这篇文章写在Listary 5 发布之前，希望Channing能够加快速度，早日把这个憋了两年的大招放出来~~

# 链接
- [安装版下载](http://www.listary.com/download/Listary.exe)
- [绿色版下载](http://www.listary.com/download/ListaryPortable.zip)
- [官方论坛](http://discussion.listary.com/)

# 更新日志
- 2015年07月28日 完成初步使用介绍