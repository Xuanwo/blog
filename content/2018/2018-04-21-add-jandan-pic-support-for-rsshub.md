---
categories: Develop
date: 2018-04-21T07:30:00Z
tags:
- Node.js
title: 为 RSSHub 增加煎蛋无聊图支持
toc: true
url: /2018/04/21/add-jandan-pic-support-for-rsshub/
---

[RSSHub](https://github.com/DIYgod/RSSHub) 是 [@DIYgod](https://diygod.me/) 开发的一个项目，其目标是：“使用 RSS 连接全世界”，实现的方式是抓取某个网页或者 API 后解析数据并生成符合标准的 RSS Feed。这个项目十分有意思，可以通过 RSS 去订阅 B 站的番剧或者网易云音乐的歌单，比如我最近正在追的一部动漫：[DARLING in the FRANXX](https://rss.now.sh/bilibili/bangumi/21680)。我最近为这个项目增加了煎蛋无聊图的支持，这篇文章主要就是讲一讲如何抓取并解析煎蛋无聊图。

<!--more-->

## 准备工作

先了解一下 RSSHub 这个项目的大概构成。RSSHub 基于 [Koa](http://koajs.com/) 开发，请求进来之后就会被直接路由到对应的模块，然后每个模块中实现自己的逻辑。如果想增加新的支持，只需要修改 `router.js` 并在 `routes` 目录中增加对应的模块就可以了。项目中主要使用 [axios](https://github.com/axios/axios) 来做异步请求，使用 [art-template](https://aui.github.io/art-template/) 来渲染 RSS Feed 的模板，使用 [cheerio](https://cheerio.js.org/) 来解析 HTML。其中 axios 和 art-template 使用起来都比较简单，只要模仿其它模块的写法就行了，只有 cheerio 对不怎么熟悉 jQuery 语法的同学来说会比较麻烦一些（对，就是我），需要花一些时间了解一下如何获取自己需要的内容。

## 抓取无聊图

煎蛋网作为常年被爬的目标，早就已经练就了一身反爬虫的骚操作。在我写这篇文章的时候，煎蛋的反爬策略是这样的：在每个 comment 当中返回一个 `img-hash`，同时会生成一个不定期会变的 magic string，在脚本中使用这两个值算出真正的图片链接，再操作 DOM 把 img 标签塞进去。

举个例子吧，会有这样的一个 comment（已经去掉了无关的一些元素）：

```html
<li id="comment-3784888">
  <div>
    <div class="row">
      <div class="text"><span class="righttext"><a href="//jandan.net/pic/page-226#comment-3784888">3784888</a></span>
        <p>辣个屁<br />
          <img src="//img.jandan.net/img/blank.gif" onload="jandan_load_img(this)" /><span class="img-hash">80e6w5mrZ3HEpVzkZXyOhd9DYgF9F2cXvgMQ6PPgofGuHui2Dqrhh9fDcWrRGQEtB7l+GKuPqhQCGsHil1luTUVYNEpXiKUzh3ck/P91sr6ht9gsISFBXQ</span></p>
      </div>
    </div>
  </div>
</li>
```

可以看到 img 标签中载入的是 `img.jandan.net/img/blank.gif`，然后在加载的时候会去执行 `jandan_load_img`。让我们来看一下 `jandan_load_img` 这个函数都做了什么：

```javascript
function jandan_load_img(b) {
	var d = $(b);
	var f = d.next("span.img-hash");
	var e = f.text();
	f.remove();
	var c = jdTzcXZnL0V2WZZ8eq9786xeOdkyoBXlDR(e, "tRoGWVi9aW3cMYuqXmV9S1SweVfNzJf3");
	var a = $('<a href="' + c.replace(/(\/\/\w+\.sinaimg\.cn\/)(\w+)(\/.+\.(gif|jpg|jpeg))/, "$1large$3") + '" target="_blank" class="view_img_link">[查看原图]</a>');
	d.before(a);
	d.before("<br>");
	d.removeAttr("onload");
	d.attr("src", location.protocol + c.replace(/(\/\/\w+\.sinaimg\.cn\/)(\w+)(\/.+\.gif)/, "$1thumb180$3"));
	if (/\.gif$/.test(c)) {
		d.attr("org_src", location.protocol + c);
		b.onload = function() {
			add_img_loading_mask(this, load_sina_gif)
		}
	}
}
```

抛开跟我们抓取无关的 DOM 操作，很容易发现这个函数实际上就是做了一次 `jandan_decode(img_hash, magic_string);`。接下来我们只要搞清楚这里的 `jdTzcXZnL0V2WZZ8eq9786xeOdkyoBXlDR` 函数是什么可以了，用 ES6 的语法简单的翻译一下就是下面这样：

```javascript
const jandan_decode = (m, r) => {
    let q = 4;
    r = md5(r);
    let o = md5(r.substr(0, 16));
    let n = md5(r.substr(16, 16));
    let l = m.substr(0, q);
    let c = o + md5(o + l);
    let k;
    m = m.substr(q);
    k = base64_decode(m);

    const h = new Array(256);
    for (let g = 0; g < 256; g++) {
        h[g] = g;
    }
    const b = new Array(256);
    for (let g = 0; g < 256; g++) {
        b[g] = c.charCodeAt(g % c.length);
    }
    for (let f = 0, g = 0; g < 256; g++) {
        f = (f + h[g] + b[g]) % 256;
        [h[g], h[f]] = [h[f], h[g]];
    }

    let t = '';
    k = k.split('');
    for (let p = 0, f = 0, g = 0; g < k.length; g++) {
        p = (p + 1) % 256;
        f = (f + h[p]) % 256;
        [h[p], h[f]] = [h[f], h[p]];
        t += chr(ord(k[g]) ^ h[(h[p] + h[f]) % 256]);
    }
    if ((t.substr(0, 10) == 0 || t.substr(0, 10) - time() > 0) && t.substr(10, 16) == md5(t.substr(26) + n).substr(0, 16)) {
        t = t.substr(26);
    }
    return t;
};
```

我们并不需要理解这个函数都做了什么，只需要保证我们自己实现的 `jandan_decode` 能够跟 `jdTzcXZnL0V2WZZ8eq9786xeOdkyoBXlDR` 函数等价。

到这里，我们已经可以拿到原图了，接下来只需要按照 RSSHub 的要求填充模板即可。

## 踩过的坑

### 会变的 magic string

一开始以为 magic string 是一个常量，结果睡了一觉之后起床发现昨晚写好的代码不 work 了。查看了一下代码之后发现是煎蛋会不定期的就改这个 magic string 的值，所以我们需要下载最新的 js 文件，并获取写死在里面的那个 magic string。

实现的原理也非常简单，首先加载页面，找到最新的 js 文件：

```javascript
let script_url = '';
$('script').each((index, item) => {
		let s = $(item).attr('src');
		if (s && s.startsWith('//cdn.jandan.net/static/min/')) {
				script_url = s;
		}
});
```

然后下载这个 js 文件并使用正则找出里面的 magic string：

```javascript
const jandan_magic = async (url) => {
    const script = await axios({
        method: 'get',
        url: 'http:' + url,
        headers: {
            'User-Agent': config.ua,
            'Referer': 'http://jandan.net'
        }
    });
    const regex = /e,"([a-zA-Z0-9]{32})"/;
    return script.data.match(regex)[1];
};
```

### windows.atob 的实现

这个坑踩了很久。

最开始写好了 `jandan_decode` 之后发现结果始终是乱码，但是在浏览器端运行的时候却是正常的。这说明逻辑没有问题，但是引用的一些方法可能因为环境差异出了。经过反复的调试之后定位到问题出现在 `base64_decode` 这个函数：

```javascript
const base64_decode = (i) => new Buffer(i, 'base64').toString();
```

煎蛋的浏览器端实现是这样的：

```javascript
function base64_decode(a) {
  return window.atob(a)
}
```

一开始不明白问题出在哪里，直到看到了一个 [Node.js 的 windows.atob polyfill](https://gist.github.com/jmshal/b14199f7402c8f3a4568733d8bed0f25)：

```javascript
module.exports = function atob(a) {
    return new Buffer(a, 'base64').toString('binary');
};
```

原来 Buffer 的 toString 函数默认采用的编码是 `utf-8` 但是浏览器端的 `atob` 使用的编码却是 `binary`。

## 总结

- 多年过去了，我的 Node.js 还是一如既往的半吊子，只能借着别人写的项目蹭蹭贡献才能混下去这样子的。
- 目前[这个实现](https://github.com/DIYgod/RSSHub/commit/2b91689bd57f83987f10058f7fd6e0e17d328f2d)已经被合并到了 Master 分支，大家可以订阅煎蛋无聊图的 Feed 啦~

## 动态

- 最近重新开始看猫腻的《间客》，写得真好，看的时候感觉自己也跟许乐一样，永远牛逼，永远正义，永远是那个来自东林的三有青年。
