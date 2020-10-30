---
categories: Code
date: 2015-03-26T00:22:43Z
tags:
- Software
- Hexo
- Github-Pages
- Blog
title: 史上最详细的Hexo博客搭建图文教程
toc: true
url: /2015/03/26/hexo-intor/
---

从2014年的八月份开始接触Hexo，一直用到现在，已经有半年的时间了。这期间，Hexo从2.X一路升级到了3.0，很多地方都发生了改变。不仅如此，很多原来使用Hexo的博主们写下了的教程并没有及时更新，导致后来人一头雾水，挫折感十足。因此，本文致力于提供一份足够简单，长期维护的基于Github Pages的Hexo博客搭建图文教程，希望能有所帮助。
当然，我个人的力量是有限的，因此也希望使用Hexo的大家也能一起行动起来，通过[提交PR](https://github.com/Xuanwo/xuanwo.github.io/pulls)，[发布issues](https://github.com/Xuanwo/xuanwo.github.io/issues)或者在下方评论区评论等形式参与到本文档的编辑中来。浏览时，使用`Ctrl+F`搜索关键词。*（是不是会有似曾相识的感觉，= =）*

<!--more-->

# 准备

你需要准备好以下软件：

- Node.js环境
- Git

## Windows

### 配置Node.js环境

下载Node.js安装文件：

- [Windows Installer 32-bit](https://nodejs.org/dist/v4.2.3/node-v4.2.3-x86.msi)
- [Windows Installer 64-bit](https://nodejs.org/dist/v4.2.3/node-v4.2.3-x64.msi)

根据自己的Windows版本选择相应的安装文件，要是不知道，就安装32-bit的吧- -。
如图所示：

![Node.js安装界面](/imgs/opinion/nodejs-install.png)

保持默认设置即可，一路Next，安装很快就结束了。
然后我们检查一下是不是要求的组件都安装好了，同时按下`Win`和`R`，打开运行窗口：

![Windows的运行界面](/imgs/opinion/win-run.png)

在新打开的窗口中输入`cmd`，敲击回车，打开命令行界面。*（下文将直接用`打开命令行`来表示以上操作，记住哦~）*
在打开的命令行界面中，输入

```
node -v
npm -v
```

如果结果如下图所示，则说明安装正确，可以进行下一步了，如果不正确，则需要回头检查自己的安装过程。

![Node.js安装测试](/imgs/opinion/nodejs-test.png)

### 配置Git环境

下载Git安装文件：

- [Git-2.6.3-64-bit.exe](https://github.com/git-for-windows/git/releases/download/v2.6.3.windows.1/Git-2.6.3-64-bit.exe)

然后就进入了Git的安装界面，如图：

![Git安装界面](/imgs/opinion/git-install.png)

和Node.js一样，大部分设置都只需要保持默认，但是出于我们操作方便考虑，建议PATH选项按照下图选择：

![Git PATH设置](/imgs/opinion/git-path-setting.png)

> 这是对上图的解释，不需要了解请直接跳过
> Git的默认设置下，出于安全考虑，只有在Git Bash中才能进行Git的相关操作。按照上图进行的选择，将会使得Git安装程序在系统PATH中加入Git的相关路径，使得你可以在CMD界面下调用Git，不用打开Git Bash了。

一样的，我们来检查一下Git是不是安装正确了，打开命令行，输入：

```
git --version
```

如果结果如下图所示，则说明安装正确，可以进行下一步了，如果不正确，则需要回头检查自己的安装过程。

![Git安装测试](/imgs/opinion/git-test.png)

## Linux

## Mac OS

# 配置Github

## 注册账号

**如果已经拥有账号，请跳过此步~**

打开[https://github.com/](https://github.com/)，在下图的框中，分别输入自己的用户名，邮箱，密码。

![Github注册](/imgs/opinion/github-sign-up.png)

然后前往自己刚才填写的邮箱，点开Github发送给你的注册确认信，确认注册，结束注册流程。

**一定要确认注册，否则无法使用gh-pages！**

## 创建代码库

登陆之后，点击页面右上角的加号，选择`New repository`：

![新建代码库](/imgs/opinion/github-create-a-new-repo.png)

进入代码库创建页面：

在`Repository name`下填写`yourname.github.io`，`Description (optional)`下填写一些简单的描述（不写也没有关系），如图所示：

![代码库设置](/imgs/opinion/github-new-repo-setting.png)

正确创建之后，你将会看到如下界面：

![新代码库的界面](/imgs/opinion/github-new-repo-look-like.png)

## 开启gh-pages功能

点击界面右侧的`Settings`，你将会打开这个库的setting页面，向下拖动，直到看见`GitHub Pages`，如图：

![Github pages](/imgs/opinion/github-pages.png)

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

![安装hexo-cli](/imgs/opinion/npm-install-hexo-cli.png)

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

![Hexo测试](/imgs/opinion/hexo-v.png)

## 初始化Hexo

接着上面的操作，输入：

```
hexo init
```

如图：

![hexo初始化](/imgs/opinion/hexo-init.png)

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

![hexo渲染](/imgs/opinion/hexo-g.png)

然后输入：

```
hexo s
```

然后会提示：

```
INFO  Hexo is running at http://0.0.0.0:4000/. Press Ctrl+C to stop.
```

在浏览器中打开`http://localhost:4000/`，你将会看到：

![hexo初体验](/imgs/opinion/hexo-first-time.png)

到目前为止，Hexo在本地的配置已经全都结束了。

# 使用Hexo

> 在配置过程中请使用[yamllint](http://www.yamllint.com/)来保证自己的yaml语法正确

## 修改全局配置文件

*此段落引用自[Hexo官方文档](http://hexo.io/zh-cn/docs/configuration.html)*

您可以在 `_config.yml` 中修改大部份的配置。


### 网站

参数 | 描述
--- | ---
`title` | 网站标题
`subtitle` | 网站副标题
`description` | 网站描述
`author` | 您的名字
`language` | 网站使用的语言
`timezone` | 网站时区。Hexo 默认使用您电脑的时区。[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。比如说：`America/New_York`, `Japan`, 和 `UTC` 。

### 网址

参数 | 描述 | 默认值
--- | --- | ---
`url` | 网址 |
`root` | 网站根目录 |
`permalink` | 文章的 [永久链接](permalinks.html) 格式 | `:year/:month/:day/:title/`
`permalink_default` | 永久链接中各部分的默认值 |

> 如果您的网站存放在子目录中，例如 `http://yoursite.com/blog`，则请将您的 `url` 设为 `http://yoursite.com/blog` 并把 `root` 设为 `/blog/`。


### 目录

参数 | 描述 | 默认值
--- | --- | ---
`source_dir` | 资源文件夹，这个文件夹用来存放内容。 | `source`
`public_dir` | 公共文件夹，这个文件夹用于存放生成的站点文件。 | `public`
`tag_dir` | 标签文件夹 | `tags`
`archive_dir` | 归档文件夹 | `archives`
`category_dir` | 分类文件夹 | `categories`
`code_dir` | Include code 文件夹 | `downloads/code
`i18n_dir` | 国际化（i18n）文件夹 | `:lang`
`skip_render` | 跳过指定文件的渲染，您可使用 [glob 表达式](https://github.com/isaacs/node-glob)来匹配路径。 |

### 文章

参数 | 描述 | 默认值
--- | --- | ---
`new_post_name` | 新文章的文件名称 | :title.md
`default_layout` | 预设布局 | post
`auto_spacing` | 在中文和英文之间加入空格 | false
`titlecase` | 把标题转换为 title case | false
`external_link` | 在新标签中打开链接 | true
`filename_case` | 把文件名称转换为 (1) 小写或 (2) 大写 | 0
`render_drafts` | 显示草稿 | false
`post_asset_folder` | 启动 [Asset 文件夹](asset-folders.html) | false
`relative_link` | 把链接改为与根目录的相对位址 | false
`future` | 显示未来的文章 | true
`highlight` | 代码块的设置 |

### 分类 & 标签

参数 | 描述 | 默认值
--- | --- | ---
`default_category` | 默认分类 | `uncategorized`
`category_map` | 分类别名 |
`tag_map` | 标签别名 |

### 日期 / 时间格式

Hexo 使用 [Moment.js](http://momentjs.com/) 来解析和显示时间。

参数 | 描述 | 默认值
--- | --- | ---
`date_format` | 日期格式 | `MMM D YYYY`
`time_format` | 时间格式 | `H:mm:ss`

### 分页

参数 | 描述 | 默认值
--- | --- | ---
`per_page` | 每页显示的文章量 (0 = 关闭分页功能) | `10`
`pagination_dir` | 分页目录 | `page`

### 扩展

参数 | 描述
--- | ---
`theme` | 当前主题名称。值为`false`时禁用主题
`deploy` | 部署部分的设置

## 配置Deployment

首先，你需要为自己配置身份信息，打开命令行，然后输入：

```
git config --global user.name "yourname"
git config --global user.email "youremail"
```

同样在`_config.yml`文件中，找到`Deployment`，然后按照如下修改：

```
deploy:
  type: git
  repo: git@github.com:yourname/yourname.github.io.git
  branch: master
```

> 如果使用git方式进行部署，执行`npm install hexo-deployer-git --save`来安装所需的插件

然后在当前目录打开命令行，输入：

```
hexo d
```

随后按照提示，分别输入自己的Github账号用户名和密码，开始上传。
然后通过http://yourname.github.io/来访问自己刚刚上传的网站。

## 添加新文章

打开Hexo目录下的`source`文件夹，所有的文章都会以md形式保存在`_post`文件夹中，只要在`_post`文件夹中新建md类型的文档，就能在执行`hexo g`的时候被渲染。
新建的文章头需要添加一些yml信息，如下所示：

```
---
title: hello-world   //在此处添加你的标题。
date: 2014-11-7 08:55:29   //在此处输入你编辑这篇文章的时间。
categories: Code   //在此处输入这篇文章的分类。
toc: true  //在此处设定是否开启目录，需要主题支持。
---
```

# 进阶
如果成功完成了上述的全部步骤，恭喜你，你已经搭建了一个最为简单且基础的博客。但是这个博客还非常简单， 没有个人的定制，操作也比较复杂，下面的进阶技巧将会让你获得对Hexo更为深入的了解。

## 更换主题
*可以在[此处](https://github.com/hexojs/hexo/wiki/Themes)寻找自己喜欢的主题*
下载所有的主题文件，保存到Hexo目录下的`themes`文件夹下。然后在`_config.yml`文件中修改：

```
# Extensions
## Plugins: http://hexo.io/plugins/
## Themes: http://hexo.io/themes/
theme: landscape //themes文件夹中对应文件夹的名称
```

然后先执行`hexo clean`，然后重新`hexo g`，并且`hexo d`，很快就能看到新主题的效果了~

## 更换域名
首先，需要注册一个域名。在中国的话，`.cn`全都需要进行备案，如果不想备案的话，请注册别的顶级域名，可以使用[godaddy](https://www.godaddy.com/)或[新网](http://www.xinnet.com/)或[万网](http://www.xinnet.com/)中的任意一家，自己权衡价格即可。
然后，我们需要配置一下域名解析。推荐使用DNSPod的服务，比较稳定，解析速度比较快。在域名注册商出修改NS服务器地址为：

```
f1g1ns1.dnspod.net
f1g1ns2.dnspod.net
```

以新网为例，首先点击域名管理进入管理页面：

![点击域名管理](/imgs/opinion/domin-setting.png)

然后点击域名后面的`管理`：

![管理](/imgs/opinion/mydomin.png)

进入域名管理的操作界面，点击`域名管理`，来到域名管理界面：

![终于来到了域名管理= =](/imgs/opinion/domin-config.png)

点击`修改域名DNS`，然后选择`填写具体信息`，在下面的空框中填入DNSPod的NS服务器：

![使用DNSPod的服务器](/imgs/opinion/domin-dnspod.png)

然后我们进入DNSPod的界面，开始真正进入域名解析的配置= =。在DNSPod中，首先添加域名，然后分别添加如下条目：

![配置DNS解析](/imgs/opinion/dnspod-setting.png)

最后，我们对Github进行一下配置。

在自己本地的hexo目录下的`source`文件夹中，新建一个`CNAME`文件*（注意，没有后缀名。）*，内容为`yourdomin.xxx`。然后再执行一下`hexo d -g`，重新上传自己的博客。
在github中打开你自己的库，进入库的setting界面，如果看到了如下提示，说明配置成功了。

![Github-pages绑定自定义域名](/imgs/opinion/github-domin.png)

在这一系列的操作中，包括修改NS服务器，设置A解析等等，都需要一定的时间。短则10分钟，长则24小时，最长不会超过72小时。如果超过72小时，请检查自己的配置过程，或者修改自己本地的DNS服务器。

# 更新日志
- 2015年03月26日 完成了基础架构，慢慢添加进阶技巧= =。
- 2015年03月31日 添加了CNAME的相关内容。
- 2015年04月30日 修复了错误的git命令。
- 2015年06月11日 更新了`.config_yml`配置
- 2015年10月12日 完善了Deployment部分操作，添加了yaml语法检测网址
- 2015年12月09日 更新软件版本，为Hexo 3.2做准备
- 2016年11月06日 修复Typo on Jekyll
