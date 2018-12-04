---
categories: Code
date: 2015-08-12T01:31:22Z
tags:
- Github
- CI
- Read
- Markdown
title: Markdown + Travis CI 构建自己的开源电子书
toc: true
url: /2015/08/12/OpenSourceBook/
---

作为一只ACMer，一个非常现实的需求就是我们需要准备自己的模板。在我的想象当中，我们的模板应当有如下的这些特性：

- 可以生成PDF格式，保证在多个平台下的一致性
- 编辑起来比较简单，我的队友无需学习LaTeX即可开始编辑
- 共同协作比较方便，我和队友无需将代码互相复制粘贴
- 代码必须要支持高亮！（很重要！）
- 代码编辑容易，因为我们的模板白手起家，经常会需要修改。

这些需求，单个实现都比较容易，但是如果想要找到一个全部符合并且简单易行的方案，就有些困难了。在[@larrycai](http://www.larrycaiyu.com/)推出的[中文开源电子书项目](https://github.com/larrycai/kaiyuanbook)的启发下，我想到了使用 `Markdown` + `Github` + `Travis CI` 的一套工具链来构建了我的开源电子书的方法。
下面我来简单地介绍一下。

<!--more-->

# 实现方法
我的思路非常简单：

1. 所有文件使用Markdown进行编辑，代码文件以代码块的形式保存在Markdown文件中。
1. 原文件通过Git进行管理，通过Travis CI进行自动构建，并将生成的PDF文件以Release形式回传到Github上
1. Travis CI调用multimarkdown将md文件转换为tex，再使用latex将tex编译为pdf

整套流程看起来需要的操作很多，但是通过Travis CI进行自动构建，我们需要做的仅仅是push我们的代码，几分钟之后，最新编译的PDF就会出现在我们代码库的Release中。下面我详细地介绍一下实现的步骤。

# 实现流程
## Fork我的模板
第一步是需要先Fork我的[模板](https://github.com/Xuanwo/OpenSourceBook)，使用git将其clone到本地方便我们进行编辑，当然，库名可以随意修改，这个无需在意。

## 配置Travis CI

### 登陆Travis CI

访问[Travis CI](https://travis-ci.org/)，点击使用Github账号登陆后，Travis CI将会获得访问你的公开库相关信息的权限。
*比较看重自己信息安全的朋友也无需担心，Travis CI默认获得的权限是非常的低的只读权限，而且只能访问你的公开库。*
然后Travis CI将会列出你所有的公开库，我们在勾选`OpenSourceBook`前面的按钮使得它打开自动构建。

### .travis.yml文件配置

上一步中，我们打开了自动构建，也就是你的每一次push和pr都会触发Travis CI的自动构建。但是如果没有配置好的脚本，自动构建的结果通常都是失败的，所以我们要配置好相应的脚本。在我的库中已经有了配置好的脚本，只需要做一些细微的修改就可以应用于不同的库。

*Travis CI十分强大，有想进一步了解Travis CI的同学可以通过[文档](http://docs.travis-ci.com/)来进一步的学习。*

### 配置Github-Release

通过前面的操作，我们已经可以通过Travis CI来自动构建我们的PDF文件，但是这个文件并不能上传到Github上来，因为Travis CI默认是不会取得这样的权限的。为了解决这个问题，我们可以使用Github的Release API以及Travis CI的加密。

首先我们需要一个ruby的环境，如果没有的话可以考虑使用[Cloud9](https://c9.io/)。
安装travis的gem包

```
xuanwo@ruby:~/workspace $ gem install travis
Fetching: addressable-2.3.8.gem (100%)
Successfully installed addressable-2.3.8
（中间省略）
Fetching: travis-1.8.0.gem (100%)
Successfully installed travis-1.8.0
18 gems installed

```
登陆Travis，需要使用Github的账号和密码。

```
xuanwo@ruby:~/workspace $ cd OpenSourceBook/
xuanwo@ruby:~/workspace/OpenSourceBook (master) $
xuanwo@ruby:~/workspace/OpenSourceBook (master) $ travis login --auto
Shell completion not installed. Would you like to install it now? |y|
We need your GitHub login to identify you.
This information will not be sent to Travis CI, only to api.github.com.
The password will not be displayed.

Try running with --github-token or --auto if you don't want to enter your password anyway.

Username: Xuanwo
Password for Xuanwo: **********
Two-factor authentication code for Xuanwo: 147447
Successfully logged in as Xuanwo!

```
使用Travis的Release-Guide生成相应的脚本代码

```
xuanwo@ruby:~/workspace/OpenSourceBook (master) $ travis setup releases
Detected repository as Xuanwo/OpenSourceBook, is this correct? |yes|
//此处错误表明这个库是新建的，Travis CI还没有同步，手动同步即可。
repository not known to https://api.travis-ci.org/: Xuanwo/OpenSourceBook
xuanwo@ruby:~/workspace/OpenSourceBook (master) $ travis setup releases
Username: Xuanwo
Password for Xuanwo: **********
Two-factor authentication code for Xuanwo: 603930
//设定需要上传的文件名
File to Upload: OpenSourceBook.pdf
//设定只从当前库进行上传
Deploy only from Xuanwo/OpenSourceBook? |yes|
//设定进行API key加密（强烈要求）
Encrypt API key? |yes|

```
到这里，我们已经实现了一本电子书由Markdown到PDF的自动构建，下面我来具体的讲解一下如何使用。

# 使用方法
## 触发Release发布
由于Github的强制要求，所有发布都必须归属于某一个Tags，所以我们在push的时候，需要带上tags，生成的文件才能够上传到Github上去。具体的操作如下：

```
git add --all
git commit -m "update content"
git tag -a v0.0.1 -m "tags content"
git push --tags
git push

```
## 文件结构介绍
所有的源代码文件都保存在`content`文件夹下，所有文件都遵循[Markdown语法](http://www.jianshu.com/p/q81RER)。图片保存在`content/img`目录下，调用时使用`![图片描述](img/pic.png)`。
每一本书分为前言，内容和目录。其中`0-prefaceX-xxx.md`表示前言的第X章，`1-chapterX-xxx.md`表示正文的第X章，`2-appendixX-xxx.md`表示附录的第X章，都是从1开始的。

*目前为止，修改封面还需要修改Tex文件*

## 跳过自动构建
只是单纯想更新内容，不想生成PDF时，只需要在commit信息中添加`[ci skip]`即可。比如

```
git commit -m "[ci skip] commit message"

```

# 更新日志
- 2015年08月12日 初步完成教程
