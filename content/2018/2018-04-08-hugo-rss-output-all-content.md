---
categories: Opinion
date: 2018-04-08T16:07:00Z
tags:
- Hugo
- Blog
title: Hugo RSS 配置输出全文
toc: true
url: /2018/04/08/hugo-rss-output-all-content/
---

在折腾 Feedly 的时候偶然发现自己的博客输出的 RSS 里面只有摘要，想要看完整的内容需要跳转。这可不符合我的初衷，于是花了一些时间配置了一下相关的内容。接下来简要的介绍一下如何配置 Hugo 的模板以生成输出全文的 RSS Feed。

<!--more-->

## R.T.F.M.

在折腾之前，首先阅读一下 Hugo 的文档： https://gohugo.io/templates/rss/ 。从文档中知道了以下两件事：

- RSS 模板的查找顺序
- Hugo 自带的 RSS 模板的内容

那么想要自定义 RSS 模板的话，只需要在合适的地方放上模板即可。

## RSS 模板的位置

Hugo 内置模板查找的优先级别是最低的，所以只要选择任意一个符合要求的位置都能覆盖它。我选择放在主题的 `layouts` 目录下，也就是 `layouts/index.rss.xml`。

## RSS 模板的内容

忽略掉一些无关的细节，导致 RSS 输出的文章内容中只有摘要的是如下模板：

```go-html-template
{{ range .Data.Pages }}
<item>
  <title>{{ .Title }}</title>
  <link>{{ .Permalink }}</link>
  <pubDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
  {{ with .Site.Author.email }}<author>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</author>{{end}}
  <guid>{{ .Permalink }}</guid>
  <description>{{ .Summary | html }}</description>
</item>
{{ end }}
```

`.Summary` 引用的是文章的摘要部分，只要将其替换为 `.Content` 就能输出文章的完整内容。但是默认情况下，Hugo 会在 RSS Feed 中输出所有文章，如果输出完整内容的话，这个 Feed 会特别大，因此需要想办法限制一下展示的文章数量。继续 RTFM，[此处](https://gohugo.io/functions/first/) 描述了一个叫 `first` 的方法，跟 `range` 搭配起来之后可以起到切片的作用。这样就能够得到如下的模板：

```go-html-template
{{ range first 10 .Data.Pages }}
<item>
  <title>{{ .Title }}</title>
  <link>{{ .Permalink }}</link>
  <pubDate>{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 -0700" | safeHTML }}</pubDate>
  {{ with .Site.Author.email }}<author>{{.}}{{ with $.Site.Author.name }} ({{.}}){{end}}</author>{{end}}
  <guid>{{ .Permalink }}</guid>
  <description>{{ .Content | html }}</description>
</item>
{{ end }}
```

完整的模板可以参见 commit: https://github.com/Xuanwo/xuanwo.github.io/commit/80347d6e7868f4443170fe926a762d496b736944

## 动态

- Feedly 上除了我自己居然要还有 5 个订阅用户，有些感动，如果有在北京的童鞋可以邮件我一起约个饭~
- 清明节去了趟苏州，看到了大裤衩，还看了金鸡湖的音乐喷泉，然后拙政园基本啥都没看着，全是人头= =，出来之后就不想再去任何园林了
- 终于下定决心买了 ThinkPad X1 Carbon 2018 (故意写全就是为了装)，等四月底到手了发一波开箱照
- 又要开工了，体会到了久违的小学生暑假开学前一天的心情，大概是因为以前一直没有好好的休假过。。。
