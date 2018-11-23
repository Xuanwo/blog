---
categories: Opinion
date: 2018-10-15T13:35:00Z
tags:
- Blog
- Hugo
title: 恢复博客遗失的评论 
url: /2018/10/15/revocer-lost-blog-comments/
---

最近发现自己博客的评论少了不少，于是找了一下原因并使用工具做了修复，这篇文章主要就是讲 Hugo 如何正确的配置 Disqus 以及如何使用 Disqus 提供的迁移工具来修复已经出问题的数据。

<!--more-->

## Hugo sucks

查看自己博客的 Discussions 的时候会看到很多奇奇怪怪的链接：

```
https://translate.googleusercontent.com/translate_c?act=url&depth=1&ie=UTF8&prev=_t&sl=auto&sp=nmt4&tl=en&u=https://xuanwo.io/2014/07/16/poj-1011-sticks/
https://translate.googleusercontent.com/translate_c?depth=1&sl=zh-CN&sp=nmt4&tl=en&u=https://xuanwo.io/2015/02/07/generate-a-ssh-key/&xid=17259,15700022,15700124,15700149,15700168,15700186,15700190,15700201,15700208
https://webcache.googleusercontent.com/search?q=cache:RMRC2X9nD0EJ:https://xuanwo.io/2017/11/26/enpass-intro/+&cd=1&ct=clnk&gl=jp&lr=lang_zh-CN%7Clang_zh-TW
```

当然啦，自己的博客有外国友人开着 Google 翻译看自然会觉得开心，但是为啥这些奇怪的地址会被作为这篇文章评论的 URL 存入 Disqus 呢？

首先看了下网页的源代码中与 disqus 有关的部分：

```html
<script>
    var disqus_config = function () {
    
    
    
    };
    (function() {
        if (["localhost", "127.0.0.1"].indexOf(window.location.hostname) != -1) {
            document.getElementById('disqus_thread').innerHTML = 'Disqus comments not available by default when the website is previewed locally.';
            return;
        }
        var d = document, s = d.createElement('script'); s.async = true;
        s.src = '//' + "only0god" + '.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
```

可以看到 `disqus_config` 是空的，此时首先会感到有些不对劲，接下来看一下 disqus 文档对这个 config 是如何处理的：

> When url or identifier are not defined, the Disqus embed will use the window URL as the main identifier when creating a thread. In other words, each unique URL Disqus loads on will result in a new unique thread. This works well for some sites, however, this method of creating threads can lead to duplicate “split threads” for the same page of content, especially when your site accepts many different URLs for the same page of content.

所以如果 `disqus_config` 是空的，那 disqus 就会取当前的 window URL 创建一个条目。换言之，如果用户通过多个不同的 URL 访问到你这篇博客，那么你的博客就会有多个不一样的评论条目。

现在导致 disqus 出现重复的原因知道了，那为什么会这样呢？

```html
var disqus_config = function () {
    {{with .GetParam "disqus_identifier" }}this.page.identifier = '{{ . }}';{{end}}
    {{with .GetParam "disqus_title" }}this.page.title = '{{ . }}';{{end}}
    {{with .GetParam "disqus_url" }}this.page.url = '{{ . | html  }}';{{end}}
};
```

这是 Hugo 内嵌的 disqus 模板，看得出来，Hugo 为了追求灵活性（总有人想用奇奇怪怪的 URL 作为 disqus 的 url），他选择读取当前页面的参数，而不是直接写死了一个规定的值。这就很坑了，我选择自己改一下这个模板：

```html
var disqus_config = function () {
    this.page.identifier = '{{ .URL }}';
    this.page.title = '{{ .Title }}';
    this.page.url = '{{ .Permalink }}';
};
```

- URL 是当前页面的相对路径
- Title 是当前页面的标题
- Permalink 是当前页面的完整 URL

比如说：

```js
var disqus_config = function() {
    this.page.identifier = '\/2018\/10\/03\/ingress-beijing-central-axis\/';
    this.page.title = 'Ingress 北京中轴线噩梦难度一日速刷攻略';
    this.page.url = 'https:\/\/xuanwo.io\/2018\/10\/03\/ingress-beijing-central-axis\/';
};
```

> 此处的 `\` 是 JavaScript 的转义，实际的内容中并不包括 `\`

## Disqus 的 URL Mapper

现在已经修复了问题的源头，那现在这个烂摊子如何收拾呢？好在我们有 Disqus 的 URL Mapper，这个工具可以批量的将一组 URL 映射到另外一组 URL 上：

- 将 A 映射为 B，那么 A 的评论就会迁移到 B 上
- 将 A，B 都映射为 B，那么相当于把 A 和 B 两个页面的评论合并到了 B

使用起来也非常简单，访问自己网站的控制面板 `TOOLS -> Migration Tools -> URL Mapper`，首先下载一个 csv，里面会包括网站的所有评论链接，然后按照如下规则修改即可：

- 如果想将 A 修改为 B，那么只需要增加一列，写上 B 即可
- 如果想跳过 A，那么直接将 A 这一行删除即可
- 如果 B 为空的话，我也不知道会发生什么，没试过（

我是直接将 CSV 上传到了 Google Sheet，然后用它的函数一阵操作搞定了，简单分享一哈：


- `LOWER(REPLACE(AXXX,1,4,"https"))` 可以将 protocol 修改为 https 并全部转换为小写
- `REGEXEXTRACT(AXXX, "https://xuanwo.io[\/\w-]*/")` 可以从 URL 的 Query 中提取出链接

下面将修改好的 CSV 导出并上传，等到 disqus 异步处理即可。

## 参考

- [Use Configuration Variables to Avoid Split Threads and Missing Comments](https://help.disqus.com/troubleshooting/use-configuration-variables-to-avoid-split-threads-and-missing-comments)
- [themes: Fix disqus identifier not set correctly](https://github.com/Xuanwo/xuanwo.github.io/commit/bfb38029cabe8f3a5b1c33f808644e89cb5111b9)

## 动态

- RNG 差点在小组赛翻车，最后连续干掉三星和状态火热的 C9，成功以小组第一出线（真的不容易，最后一波团真的是太刺激了），希望 EDG 和 iG 也能顺利出线~
- 不知道为啥突然开始了规律作息，每天 7:30 起床，9 点到公司，感觉很爽，仿佛自己的人生突然多出来一个上午（
- 最近成功加入了 Archlinuxcn 的打包组，并且把我常用的一些包加进了 cn 源，比如 [coredns](https://github.com/archlinuxcn/repo/tree/master/coredns)，我这个包可比 AUR 上的那个用心多了，欢迎大家使用并反馈意见~
