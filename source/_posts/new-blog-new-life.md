---
title: 新博客上线&Hexo主题开发入门
date: 2016-06-29 23:06
tags: [Hexo, Blog, HTML, JavaScript, Nodejs]
categories: [Develop]
toc: true
---

# 前言

曾经看过我的博客的同学大概都会发现，我的博客再一次大变样了~
这一次的更新其实酝酿了很久，早在刚开始用Hexo的时候就想着要有一个自己的主题。但是那个时候觉得这是一件很难的事情，要懂HTML，CSS，JavaScript，还要懂Swig，Ejs等模板语言，还要懂Hexo的内部原理，于是就一直搁置了。在独立实现了一个[完整的项目](https://xuanwo.org/2016/06/16/jade_ims/)之后，我认为自己已经有这样的能力了，于是决定正式开始。
在我看来的话，Hexo的使用者大概分为三个层次：第一种用别人的主题，第二种模仿现有的主题，第三种自己独立开发。我原来是第一种，在Next的基础上做了很多改动，这一次进入到了第二个层次。我找了一套自我感觉还不错的模板，然后套用它的CSS设定和页面结构，就成了我现在的主题。
利用两天学习和工作的闲暇时间，我大体上完成了这个主题。做得比较糙，很多细节还有待优化，但是我已经急不可耐地想要正式上线了，笑。在未来的话，我希望能把一些配置都能整理出来，优化一下代码，然后开源这个主题，希望大家能够喜欢~
庆祝的话已经说的差不多了，下面来讲一讲如何开发一个Hexo主题。

<!-- more -->

# 结构

## 主题结构

Hexo主题的结构大体如下：

```bash
.
├── _config.yml
├── languages
│   ├── default.yml
│   └── zh-Hans.yml
├── layout
│   ├── achieve.swig
│   ├── category.swig
│   ├── index.swig
│   ├── _layout.swig
│   ├── page.swig
│   ├── _partials
│   ├── post.swig
│   └── tag.swig
└── source
    ├── css
    ├── fonts
    ├── img
    ├── js
    └── vendors
```

首先有一个`_config.yml`负责提供主题级别的配置，可以在`layout`中通过`theme.xxx`的形式进行调用。
然后`languages`负责实现博客的i18N功能，如果博客没有多语言的需求，只需要实现一个`default.yml`即可。
其次是最为重要的`layout`文件夹，这个里面主要存放博客的结构，Hexo 引擎会使用指定的渲染引擎将`layout`文件渲染成HTML页面。
最后是`source`，把所有主题需要用到的资源，比如CSS，Fonts，JS等都存放到这个文件夹中。

这个主题使用了[swig](http://paularmstrong.github.io/swig/)。

## 页面结构

页面结构分为两个维度，一者是我要呈现哪些页面，二者是每个页面上都有哪些内容。

### 哪些页面？

作为一个博客，主要需要的页面有以下这些：

- 主页
- 单页
- 归档页面
- 分类页面
- 标签页面
- 文章页

### 哪些内容？

如果没有什么特别的设计，博客的页面大体上可以分为这几个部分：

- head：头部文件
- body：主体内容
  - header：题图，导航栏等
  - content： 内容
  - footer：尾部的联系方式等

# 实现

前面讲到了 Hexo 的结构，下面来聊一聊具体的实现。

## 原理

Hexo 渲染的入口是`_layout.swig`，所以一个主题至少需要实现一个`_layout.swig`。
然后Hexo会遍历Hexo目录下`source`文件夹中的所有Markdown文件，根据Markdown文件所指定的layout进行渲染，默认类型为`post`。

## 技巧

### _layout.swig结构

整体的结构基本如下：

```swig
<!doctype html>
<html>
<head>
    {% include '_partials/head.swig' %}
    <title>{% block title %}{% endblock %}</title>
</head>
<body id="home">
    {% include '_partials/menu.swig' %}
    <div id="wrap">
        {% include '_partials/nav.swig' %}
        {% include '_partials/header.swig' %}
        <div id="start" class="container content">
            {% block content %}{% endblock %}
        </div>
        {% include '_partials/footer.swig' %}
    </div>
</body>
</html>
```

### 实现文章渲染

这个地方主要是借鉴了NexT主题的设计，实现了一个swig的宏来生成对应的文章。这个宏主要有两个参数，第一个是post对象，第二个是是否为主页。如果是主页就只显示简略的内容，如果不是就输出全文。

判断的部分实现如下：

```swig
{% if is_index %}
    {% if post.excerpt %}
        {{ post.excerpt }}
        <a class="" href="{{ url_for(post.path) }}">Read more</a>
    {% endif %}
{% else %}
    {{ post.content }}
{% endif %}
```

用到的post页的参数可以[我翻译的中文文档](https://hexo.io/zh-cn/docs/variables.html)

### 分页插件

Hexo 自己实现了一个分页插件，直接使用paginator函数即可。

```swig
{% if page.prev or page.next %}
    <nav class="pagination">
        {{ paginator({
            prev_text: '<i class="fa fa-angle-left"></i>',
            next_text: '<i class="fa fa-angle-right"></i>',
            mid_size: 1
        }) }}
    </nav>
{% endif %}
```

### 评论系统

对于Hexo来说，评论系统就是调用一个第三方的JS。所以只需要在合适的位置插入代码即可。

```swig
<div id="disqus_thread"></div>
<script>
    var disqus_config = function () {
        this.page.url = '{{ page.permalink }}';
        this.page.identifier = '{{ page.path }}';
    };
    (function () {
        var d = document, s = d.createElement('script');
        s.src = '//abc.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
```

# 需要注意的坑

- `page.posts`是按照时间排序的，但是`site.posts`是无序的。

# 参考资料

- [Hexo 官方中文文档](https://hexo.io/zh-cn/docs/)

# 更新日志

- 2016年06月30日 首次发布
