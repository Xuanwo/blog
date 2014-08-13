title: Hexo常见问题解决方案
date: 2014-08-14 05:20:00
tags: [software]
categories: Opinion
toc: true
---
# 介绍
Hexo是一个非常好用的静态博客生成器，但是由于很多方面的原因，导致在使用过程中经常出现错误。这些错误中，有些是因为自己的设置不当，导致程序报错；有些是因为版本更迭，导致原有的设置失效；而有些，则是Hexo程序本身的BUG。本文旨在尽可能的解决前两类问题，缓解Hexo项目大量重复issues的现象。当然，我个人的力量是有限的，因此也希望使用Hexo的大家也能一起行动起来，通过[提交PR]()，[发布issues]()或者在下方评论区评论等形式参与到本文档的编辑中来。同时，也希望有能力的人可以将本文档翻译成英文，以帮助到更多的人。浏览时，使用`Ctrl+F`搜索关键词。

**本文欢迎转载，但是恳请保留贡献者信息，谢谢。**

<!--more-->

# 常见错误
## 本地浏览没问题，Deploy报错
### Git环境配置错误
**问题描述：**
*Windows系统*出现报错信息如下
```
[info] Start deploying: git
[info] Setting up Git deployment...
[error] Error: spawn ENOENT
Error: spawn ENOENT
    at errnoException (child_process.js:1000:11)
    at Process.ChildProcess._handle.onexit (child_process.js:791:34)

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: spawn ENOENT
    at errnoException (child_process.js:1000:11)
    at Process.ChildProcess._handle.onexit (child_process.js:791:34)
```
**解决方案：**
1. 检查Git的相关配置，将git所在目录添加到系统path中去。
2. 使用`Github For Windows`的朋友，将git添加至path之后，使用`git shell.lnk`启动Hexo。在lnk文件的属性界面中`目标`项中添加`C:\Users\xuanw_000\AppData\Local\GitHub\GitHub.appref-ms --open-shell /k "C:\Program Files\nodejs\nodevars.bat"`。其中`C:\Users\xuanw_000\AppData\Local\GitHub\GitHub.appref-ms --open-shell /k`是原来的文本，`"C:\Program Files\nodejs\nodevars.bat"`是新增的，用于在shell中添加nodejs运行环境。不会配置可以点击[这里](https://github.com/Xuanwo/xuanwo.github.io/raw/blog/Git%20Shell.lnk)下载。

### Deploy设置错误
**问题描述：**
输入`hexo deploy`后，出现错误信息：
```
'github' does not appear to be a git repository
```
**解决方案：**
1. 检查`_config.yml`中deploy设置。参见<http://hexo.io/docs/deployment.html>。
2. 删除`.deploy`文件夹并且执行`hexo clean`后，重新`hexo deploy`。

## Deploy之后，页面长时间404

## Hexo命令失效
**问题描述：**
输入命令后出现如下信息：
```
localhost:~ apple$ hexo new "title"
Usage: hexo

Commands:
help Get help on a command
init Create a new Hexo folder
migrate Migrate your site from other system to Hexo
version Display version information

Global Options:
--debug Display all verbose messages in the terminal
--safe Disable all plugins and scripts

For more help, you can use hexo help [command] for the detailed information
or you can check the docs: http://zespia.tw/hexo/docs/
```
**解决方案：**
检查`_config.yml`内容，特别注意`:`后面需要有一个空格。

## 更新至2.8.X版本后，构建失败
**问题描述：**
输入`hexo g`后，报错如下：
```
[error] { name: 'HexoError',
  reason: 'incomplete explicit mapping pair; a key node is missed',
  mark:
   { name: null,
     buffer: 'categories: Categories\nsearch: Search\ntags: Tags\ntagcloud: Tag Cloud\ntweets: Tweets\nprev: Prev\nnext:
 Next\ncomment: Comments\narchive_a: Archives\narchive_b: Archives: %s\npage: Page %d\nrecent_posts: Recent Posts\ndescr
iption: Description\nread_more: Read More\n\u0000',
     position: 163,
     line: 9,
     column: 19 },
  message: 'Process failed: languages/default.yml',
  domain:
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [ [Object] ] },
  domainThrown: true,
  stack: undefined }
```
**解决方案：**
主题的languages文件夹下所有yml文件中所有有空格的字段都用双引号括起来。
![就像这样](http://xuanwo.qiniudn.com/opinion/hexo-languages-error.png)
*感谢[@dukewan](https://github.com/dukewan)提供的截图*


# 常见问题
## 如何在不同电脑（系统）上使用Hexo
## 如何为站点添加社会化评论
## 如何避免在Deploy时输入密码

# 贡献者
[@Xuanwo](http://xuanwo.tk/)

# 更新日志
- 2014年08月14日  完成大体框架，内容慢慢填充。