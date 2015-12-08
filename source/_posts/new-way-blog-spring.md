---
title: 使用Github Pages做博客的新思路——Spring
date: 2014-06-11 14:00:00
tags: [Spring, Blog, JavaScript, Github-Pages]
categories: Opinion
toc: true
---

# 前言
很久之前就有了想要有一个自己的博客的想法，一直没有付诸于实施。整个初中到高中基本上就是在使用一个半死不活的CSDN博客，更新不多，质量不高，还有点嫌弃它丑陋，定制性不佳的界面。
前两天队长要求我们每个人都必须开通一个博客，于是，我终于开始腾出精力和时间去寻找一个合适的地方来做我的博客。现有的一些博客提供商都被否决了，网易搜狐腾讯之类的并不是适合一个程序猿，文章写出来也得不到反馈与交流，失去了它的意义。随着搜索的进行，Github Pages开始频繁的出现在页面上。之前一直在用Github，但是对它的Pages业务并不了解。根据一些教程（感谢[阮一峰先生的博客](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)），我先后使用了`Hexo`，`Jekyll`，`Octopress`等生成网站。网站的风格我很喜欢，只是不停地纠结于怎样的配置更好的问题，反而加重了我自己的负担。
无意之间，我看到了@zhaoda的博客，使用自己开发的`Spring`项目，通过抓取项目的`issues`来撰写博客，效果出奇的好。使用Github自带的`lables`进行标签管理，`issues`的评论功能直接可以当做文章的评论区，操作简单，无需复杂配置，完全符合我的要求。

<!-- more -->
----------

# 作者本人的介绍
Spring是一个通过GitHub Issues撰写内容的博客引擎，或者说是一个简单、静态化的建站系统。不需要服务器和数据库支持，你可以把它作为一个GitHub代码仓库，并托管在免费的GitHub Pages上运行，然后在这个仓库的Issues系统里撰写日志。
你可以在这个仓库的Issues系统里添加labels标签，这些标签会成为博客的分类，然后新建Issues，并用Markdown语法写日志。
Spring拥有响应式的页面设计，可以在手机、平板和桌面端完美展现；支持IE10+和所有现代浏览器，底端设备做了跳转的降级处理。
你可以快速的安装并运行这个系统。

# 构建步骤
接下来，我简单介绍一下如何应用Spring来构建自己的博客。

 1. Fork仓库[Spring](https://github.com/zhaoda/spring)
 2. 修改仓库名称为`yourname.github.io`
 3. 修改`index.html`文件（可以在Github网页端修改好之后再同步到本地）

```
$.extend(spring.config, {
// my blog title
---
title: 'Your Blog title',
// my blog description
desc: "A blog engine written by github issues [Fork me on GitHub](https://github.com/zhaoda/spring)",
// my github username
owner: 'Your Github username',
// creator's username
creator: 'Your Github username',
// the repository name on github for writting issues
repo: 'yourname.github.io',
// custom page
pages: [
]
})

```

在设置页面中打开`Issues`功能，开始写你的博客吧～

# 添加百度统计代码
复制百度提供的代码，粘贴到`index.html`中`<body>`与`<\body>`之间即可。
添加完毕后，可以在百度统计中选择`检测代码`来测试自己的代码是否安装成功。
其他统计代码也是一样。

# 更新日志

- 2014年06月11日  完成初稿
- 2014年06月12日  完成添加百度统计代码教程
- 2014年07月03日  整体博客迁移至Hexo，此文不再更新