---
categories: Develop
date: 2018-05-01T13:30:00Z
tags:
- Golang
- Blog
series: "Self-made Wheels"
title: Xuanzang —— 一款开箱即用的全文搜索引擎
url: /2018/05/01/xuanzang-intro/
---

[Xuanzang](https://github.com/Xuanwo/xuanzang), 中文名：玄奘，是一个支持中文分词的开源全文搜索引擎。其目标是做一个开箱即用，不需要复杂的部署和配置，可以方便的嵌入静态网站的全文搜索引擎。

<!--more-->

## 使用

Xuanzang 的使用非常简单，只需要在 [releases](https://github.com/Xuanwo/xuanzang/releases) 处下载实现编译好的二进制文件。按照要求填写一些配置文件，比如：

```yaml
host: localhost
port: 8080
db_path: /project/xuanzang/database
index_path: /project/xuanzang/index

source:
  type: sitemap
  url: https://xuanwo.io/sitemap.xml
  duration: 3600

dictionary: /project/xuanzang/dictionary.txt
stop_tokens: /project/xuanzang/stop_tokens.txt

logger:
  level: debug
  output: /project/xuanzang/log
```

上述的配置文件将会监听本地的 `8080` 端口，并使用 `/project/xuanzang/database` 存放数据库，使用 `/project/xuanzang/index` 目录存放索引。接下来的 `source` 指定了源站的类型和两次抓取的间隔时间。对于个人博客而言，一个小时的抓取间隔已经足够了。下面的 `dictionary` 和 `stop_tokens` 是 Xuanzang 使用的字典和停止词，如果没有特殊的需求，可以使用项目自带的，在[此处](https://github.com/Xuanwo/xuanzang/tree/master/data)下载。`logger` 则指定了 log 文件的位置和级别。

接下来就只需要启动 Xuanzang：

```bash
:) xuanzang -c /path/to/config.yaml
```

以搜索我的朋友 [Aspire](https://pjw.io/) 为例：

```bash
:) curl 127.0.0.1:8080?text=aspire
{"tokens":["aspire"],"docs":[{"title":"友情链接 // Xuanwo's Blog","url":"https://xuanwo.io/blogroll/","content_text":""}],"total":1}
```

接入博客十分容易，只需要通过 Ajax 向 Xuanzang 发出请求，并解析返回的 JSON 插入正确的 DOM，比如：

```js
function search() {
  var text = decodeURI(window.location.search.substring(1).split("&")[0].split("=")[1]);
  $(".archive-category").text(`"${text}" 的搜索结果`);
  $.getJSON("/search?text=" + text, function(result) {
    $.each(result.docs, function(i, field) {
      $(".archives").append(`<a href="${field.url}">${field.title}</a>`);
    });
  });
};
```

在 Search 页面的 Body 中设置 `onload="search()"` 并在 form 表单中设置 `action="/search_result" method="get"`。

具体的实现可以参考[这个 Commit](https://github.com/Xuanwo/xuanwo.github.io/commit/3a7049df0a8fb9d685704283cfc0f6fdc264035d)。

目前本博客的全文搜索就是通过 Xuanzang 实现的，感兴趣的朋友可以试用一下~

## 实现

Xuanzang 解决中文全文搜索的思路非常简单：

1. 通过事先指定的 sitemap 文件来遍历 & 抓取网页
2. 使用一个支持中文分词的全文搜索引擎来做索引
3. 对外暴露一个简化的 API 接口

接下来我们分别介绍一下这三个部分。

### 抓取网页

现在静态网站的生成工具多如牛毛，每个工具采用的模板都不大一样，因此不可能走为每种静态网站生成工具适配模板的道路。那有没有一种方法可以实时的获取到网站内容的变更呢？那就是 [Sitemap](https://www.sitemaps.org/protocol.html)，又叫做站点地图。几乎所有的静态网站生成工具都支持生成 Sitemap，这解决了获取网站内容的问题。同时 Sitemap 除了网址以外，还有 `lastmod` 属性，可以获取到对应页面的最后修改时间。因此只需要抓取 Sitemap 文件，我们就可以知道整个网站都有哪些页面以及他们上次更新是什么时候了，这样就解决了获取网站内容变更的问题。同时我们可以在本地记录一下索引更新的时间，如果索引更新的时间比网页更新的时间要晚，那就可以直接跳过这个页面，从而避免每次都需要抓取。

### 中文分词

Xuanzang 底层使用了 [@huichen](https://github.com/huichen) 开发的 [wukong](https://github.com/huichen/wukong)。中文分词这一块没有做什么大的改进，基本上就是直接拿过来用了。虽说搜索的精度还不是很高，但是马马虎虎还能用，对于个人博客而言已经足够了。

### API 接口

目前对外只提供了一个 `GET` 接口，返回的数据结构如下：

```go
// Response is the response for search.
type Response struct {
	Tokens []string   `json:"tokens"`
	Docs   []Document `json:"docs"`

	Total int `json:"total"`
}

// Document is the document that scored.
type Document struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	ContentText string `json:"content_text"`
}
```

预留了 `ContentText` 属性，以后会用做提供搜索到的关键字附近的内容。

## 对比

接下来简单的讲一讲 Xuanzang 和市面上其它全文搜索工具的区别。

### Lunr.js

Lunr.js 是一个非常 Cool 的项目，但是 Lunr.js 不支持中文分词。不少人通过引入一个分词库并修改 Lunr.js 的 tokenizer 方法解决这个问题，其代价就是不能在浏览器端直接使用，还是需要在服务器端去提供一个服务。从我的角度来看是是已经偏离了它的目标：`A bit like Solr, but much smaller and not as bright.` ，因此我的博客没有采用这个方案。其他的基于 js 的方案也都或多或少有这样的问题，比如在本地生成一个索引，然后搜索的时候使用 js 去 load 等等，在使用体验上都不是很好，在网站不是部署在国内时，这个问题尤为严重。

### Elasticsearch

（首先， Elasticsearch 是 Java 的，我这个 512M 内存的机器咋跑。。。）

Elasticsearch 很棒，但是用来做博客的全文搜索，总有一种拿着大炮打蚊子的感觉。我个人只是使用过 API ，没有实际的进行过 ES 的部署和维护，这里就不多说了。

### Google Site Search

这大概是接入最方便的方案了，只需要直接跳转到 google 的 `site:xuanwo.io %s` 即可。缺点是无法控制 Google 的索引行为，也没有办法做到实时的抓取和更新。

### Algolia etc.

还有很多商业化的全文搜索服务，其中最出名的莫过于 `Algolia` 和 `Swiftype`。之前试用过他们的服务，搜索效果很赞，但是免费用户限制颇多： algolia 的免费服务最多只能有一万条记录，swiftype 则是只提供了一段时间的免费试用，同时还限制了抓取的频率。

## 总结

Xuanzang 在前人已有工作的基础上提供了一套简单易用的中文网站全文搜索解决方案，不需要复杂的参数调节和运维工作，按照文档部署即可使用，兼容市面上绝大多数静态网站生成工具，各位朋友了解一下？

## 动态

- 本周给大家推荐的小说： [《雪中悍刀行》](http://book.zongheng.com/showchapter/189169.html)，烽火戏诸侯的作品，布局精细，结构宏大，人物刻画生动，文字功底深厚，适合所有喜欢武侠小说的同学~
- 背后故事：4 月 29 号睡前有了为自己博客增加全文搜索支持的 Idea，30 号写了一天，并于当天的晚上九点发出了第一个 Release。
- 今天去簋街胡大饭馆吃了麻辣小龙虾，麻辣扇贝，馋嘴蛙仔，现在肚子在疯狂的翻腾。。。
