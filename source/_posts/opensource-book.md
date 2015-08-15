title: Gitbook——你自己的开源电子书
date: 2014-08-21 08:41:49
tags: [Software, Web]
categories: Opinion
toc: true
---
# 前言
想自己写一本开源电子书，却被各种复杂的配置，环境所困扰？Readthedocs支持的语言用得不如Markdown爽？不想没更新一次都自己构建一遍？或者，你想成就一本辉煌的开源巨著躺着挣钱？Gitbook是你最好的选择——需要配置的项目少，使用Markdown标记语言，每次提交都自动进行构建，可以对自己的书进行定价（还能接受捐赠- -，国内就算了。。）。下面我就来稍微介绍一下Gitbook以及如何进行基本的配置。

<!-- more -->

# 介绍
Gitbook项目官网：<http://www.gitbook.io/>
GitBook Github地址：<https://github.com/GitbookIO/gitbook>
Gitbook本身是一个命令行工具（基于Node.js），因此我们可以在本地运行，并使用它来生成静态的网页。不过我们今天将要介绍的，是Gitbook所提供的网页服务——通过Github的Webhook功能实现的自动构建，免去了每次修改都需要自己构建的麻烦，而且也为多地协同，异地编辑提供了方便。
Gitbook也提供了自己的一个编辑器，支持Markdown文件的实时渲染，和方便快捷的目录管理，需要的朋友可以自己去[官网下载](https://www.gitbook.io/editor/download)。这个下载是通过Github托管的，而Github又使用了亚马逊S3的云服务器，受到国情限制，下载异常艰难，我重试了N次才成功。因此我再提供一份自己的[备份下载链接](http://www.400gb.com/file/71518805)，给需要的朋友。

# 本地端配置
最简单的一本Gitbook电子书包括两个文件：`README.md`和`SUMMARY.md`。
## README.md
`README.md`控制了进入电子书页面的第一页，必须创建，否则会构建失败。内容可为空，一般用作写本书的简介。
## SUMMARY.md
`SUMMARY.md`控制了本书的目录，Gitbook会根据这个文件的内容来搜寻并且创建页面，其格式如下：
```# Summary

* [介绍](README.md)
* [几何](geometry/geometry.md)
* [组合](set/set.md)
* [结构](structure/structure.md)
   * [树状数组(BinaryIndexedTree)](structure/binary-indexed-tree.md)
```定义很简单，除去一行之外，下面通过`* [章节名](此章节MD文件所在相对目录)`这样的形式来定义。如果进行了缩进，说明此章节是上一个章节的子章节。比如上文中的`结构`是`3`，那`树状数组`的编号就是`3.1`。值得注意的是，逻辑上的结构跟存储结构是没有关联的，也就是说，你可以把所有MD文件放在同一个文件夹里面。但是如果MD文件很多，建议还是保持逻辑结构和实际存储结构的一致，方便管理。

# 网页端配置
简单的注册之后，记得要和Github进行绑定，以便Gitbook能够取得POST的权限。然后在电子书的设置中制定项目库的位置，就会自动进行构建了。电子书的地址一般为`http://yourname.gitbooks.io/yourbookname/`这样的形式。

# 评价
这样的方法构建出来电子书缺点在于可定制性不强，生成的PDF文件也是异常的丑= =，而且必须使用Gitbook的服务，在国内浏览速度不是很快。不过优点也蛮明显的：只要一个Git+一个可以编辑MD文档的编辑器就可以轻松地对文档进行编辑。最后，大家在新增章节之后千万不要忘记更新`SUMMARY.md`文件～

# 更新日志
- 2014年08月21日 初步完成Gitbook介绍。