title: 史上最详细的Hexo博客搭建图文教程
date: 2015-3-26 00:22:43
tags: [Software, Hexo, Github-Pages, Blog]
categories: Opinion
toc: true
---
# 前言
从2014年的八月份开始接触Hexo，一直用到现在，已经有半年的时间了。这期间，Hexo从2.X一路升级到了3.0，很多地方都发生了改变。不仅如此，很多原来使用Hexo的博主们写下了的教程并没有及时更新，导致后来人一头雾水，挫折感十足。因此，本文致力于提供一份足够简单，长期维护的基于Github Pages的Hexo博客搭建图文教程，希望能有所帮助。
当然，我个人的力量是有限的，因此也希望使用Hexo的大家也能一起行动起来，通过[提交PR](https://github.com/Xuanwo/xuanwo.github.io/pulls)，[发布issues](https://github.com/Xuanwo/xuanwo.github.io/issues)或者在下方评论区评论等形式参与到本文档的编辑中来。浏览时，使用`Ctrl+F`搜索关键词。*（是不是会有似曾相识的感觉，= =）*

<!-- more -->

# 准备
你需要准备好以下软件：
- Node.js环境
- Git

## Windows
### 配置Node.js环境
下载Node.js安装文件：
- [Windows Installer 32-bit](http://nodejs.org/dist/v0.12.1/node-v0.12.1-x86.msi)
- [Windows Installer 64-bit](http://nodejs.org/dist/v0.12.1/x64/node-v0.12.1-x64.msi)
根据自己的Windows版本选择相应的安装文件，要是不知道，就安装32-bit的吧- -。
如图所示：
![Node.js安装界面](http://xuanwo.qiniudn.com/opinion/Nodejs-install.png)
保持默认设置即可，一路Next，安装很快就结束了。
然后我们检查一下是不是要求的组件都安装好了，同时按下`Win`和`R`，打开运行窗口：
![Windows的运行界面](http://xuanwo.qiniudn.com/opinion/win-run.png)
在新打开的窗口中输入`cmd`，敲击回车，打开命令行界面。*（下文将直接用`打开命令行`来表示以上操作，记住哦~）*
在打开的命令行界面中，输入
```
node -v
npm -v
```
如果结果如下图所示，则说明安装正确，可以进行下一步了，如果不正确，则需要回头检查自己的安装过程。
![Node.js安装测试](http://xuanwo.qiniudn.com/opinion/Nodejs-test.png)

### 配置Git环境
下载Git安装文件：
- [Git-1.9.5-preview20150319.exe](https://github.com/msysgit/msysgit/releases/download/Git-1.9.5-preview20150319/Git-1.9.5-preview20150319.exe)
然后就进入了Git的安装界面，如图：
![Git安装界面](http://xuanwo.qiniudn.com/opinion/Git-install.png)
和Node.js一样，大部分设置都只需要保持默认，但是出于我们操作方便考虑，建议PATH选项按照下图选择：
![Git PATH设置](http://xuanwo.qiniudn.com/opinion/Git-path-setting.png)
> 这是对上图的解释，不需要了解请直接跳过
> Git的默认设置下，出于安全考虑，只有在Git Bash中才能进行Git的相关操作。按照上图进行的选择，将会使得Git安装程序在系统PATH中加入Git的相关路径，使得你可以在CMD界面下调用Git，不用打开Git Bash了。
一样的，我们来检查一下Git是不是安装正确了，打开命令行，输入：
```
git --version
```
如果结果如下图所示，则说明安装正确，可以进行下一步了，如果不正确，则需要回头检查自己的安装过程。
![Git安装测试](http://xuanwo.qiniudn.com/opinion/Git-test.png)

## Linux

## Mac OS

# 配置Github
## 注册账号
**如果已经拥有账号，请跳过此步~**
打开[https://github.com/](https://github.com/)，在下图的框中，分别输入自己的用户名，邮箱，密码。
![Github注册](http://xuanwo.qiniudn.com/opinion/Github-sign-up.png)
然后前往自己刚才填写的邮箱，点开Github发送给你的注册确认信，确认注册，结束注册流程。
**一定要确认注册，否则无法使用gh-pages！**
## 创建代码库
登陆之后，点击页面右上角的加号，选择`New repository`：
![新建代码库](http://xuanwo.qiniudn.com/opinion/Github-create-a-new-repo.png)
进入代码库创建页面：
在`Repository name`下填写`yourname.github.io`，`Description (optional)`下填写一些简单的描述（不写也没有关系），如图所示：
![代码库设置](http://xuanwo.qiniudn.com/opinion/Github-new-repo-setting.png)
正确创建之后，你将会看到如下界面：
![新代码库的界面](http://xuanwo.qiniudn.com/opinion/Github-new-repo-look-like.png)
## 开启gh-pages功能
点击界面右侧的`Settings`，你将会打开这个库的setting页面，向下拖动，直到看见`GitHub Pages`，如图：
![Github pages](http://xuanwo.qiniudn.com/opinion/Github-pages.png)
点击`Automatic page generator`，Github将会自动替你创建出一个gh-pages的页面。
如果你的配置没有问题，那么大约15分钟之后，`yourname.github.io`这个网址就可以正常访问了~
如果`yourname.github.io`已经可以正常访问了，那么Github一侧的配置已经全部结束了。

# 配置Hexo
## 安装Hexo
在自己认为合适的地方创建一个文件夹，然后在文件夹空白处按住`Shift`+鼠标右键，然后点击在此处打开命令行窗口。*（同样要记住啦，下文中会使用`在当前目录打开命令行`来代指上述的操作）*
在命令行中输入：
```
npm install hexo-cli -g
```
然后你将会看到:
![安装hexo-cli](http://xuanwo.qiniudn.com/opinion/npm-install-hexo-cli.png)
可能你会看到一个`WARN`，但是不用担心，这不会影响你的正常使用。
然后输入
```
npm install hexo --save
```
然后你会看到命令行窗口刷了一大堆白字，下面我们来看一看Hexo是不是已经安装好了。
在命令行中输入：
```
hexo -v
```
如果你看到了如图文字，则说明已经安装成功了。
![Hexo测试](http://xuanwo.qiniudn.com/opinion/hexo-v.png)
## 初始化Hexo
接着上面的操作，输入：
```
hexo init
```
如图：
![hexo初始化](http://xuanwo.qiniudn.com/opinion/hexo-init.png)
然后输入：
```
npm install
```
之后npm将会自动安装你需要的组件，只需要等待npm操作即可。
## 首次体验Hexo
继续操作，同样是在命令行中，输入：
```
hexo g
```
如图：
![hexo渲染](http://xuanwo.qiniudn.com/opinion/hexo-g.png)
然后输入：
```
hexo s
```
然后会提示：
```
INFO  Hexo is running at http://0.0.0.0:4000/. Press Ctrl+C to stop.
```
在浏览器中打开`http://localhost:4000/`，你将会看到：
![hexo初体验](http://xuanwo.qiniudn.com/opinion/hexo-first-time.png)
到目前为止，Hexo在本地的配置已经全都结束了。

# 使用Hexo
## 修改全局配置文件
在你的目录下，将会存在一个名为`_config.yml`的文件，这个文件保存了Hexo全局的配置，下面先修改其中的一部分：
```
# Hexo Configuration
## Docs: http://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: Hexo   //站点标题
subtitle:	//站点副标题
description:	//站点描述，会被搜索引擎识别
author: John Doe   	//站点作者
language:	//站点语言，一般不用设置
timezone:   //时区，一般不用设置

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com   //请设置为http://yourname.github.io
root: /   //保持默认，无需设置
permalink: :year/:month/:day/:title/  //保持默认，无需设置
permalink_defaults:  //保持默认，无需设置
```

## 配置Deployment
同样在`_config.yml`文件中，找到

# 更新日志
- 2015年03月26日 完成了Hexo的配置，总算写完一半了= =。