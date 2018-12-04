---
categories: Code
date: 2016-11-22T00:00:00Z
tags:
- Web
title: 有趣的网页乱码问题
url: /2016/11/22/garbled-page/
---

这是来自segmentfault的一个问题：[node.js中抓取utf-8编码的网页为什么也是乱码](https://segmentfault.com/q/1010000007540588)，解答完这个问题之后，决定探讨一下网页乱码这个问题。

<!--more-->

网页乱码之所以产生，是因为我们处理数据的方式与期待的方式不一致。比如说：

- 文本编码不一致
- 数据编码不一致

下面分别来介绍一下这两种情况：

## 文本编码不一致

这个问题比较常见，常常发生在一些比较老的网站上，采用`gbk`或者`gb2312`编码，但是大多数语言都是默认使用`utf-8`进行解释，这时就会导致乱码。

这种情况解决起来比较容易，只需要使用恰当的编码去解释即可。一个比较稳妥的方案是通过`Response Headers`中的`Content-Type`去获取内容的`charset`。当然，服务器端的开发者首先需要尽可能的遵循规范，统一使用`utf-8`编码，其次，就算是采用比较特别的编码，也需要在HTML或者headers中显式指定出来，不要让用户来猜测你的编码类型。

最坑爹的一种情况是明明是使用`gbk`编码的，却标注为`utf-8`，这种坑爹的网站建议不要再使用他们的服务了，迟早要完。

## 数据编码不一致

数据是文本更为底层的表示，如果数据编解码不正确，那么文本肯定无法正常显示。这里来讲一讲我们遇到的这个问题。

### 问题介绍

请求的页面是一个纯的静态页面： <http://www.runoob.com/nodejs/nodejs-tutorial.html> ，题主使用了这样的代码来进行抓取：

```nodejs
var http=require("http");
var go=require("iconv-lite")
http.get("http://www.runoob.com/nodejs/nodejs-tutorial.html",function(res){
    var html="";
    res.on("data",function(data){
       /* html +=go.decode(data,"gb2312");*/
        html+=data;
    })
    res.on("end",function(){
        console.log(html);
    }).on("error",function(){
        console.log("获取失败")
    })
})
```

主要进行了两种尝试，第一种是直接拼接后抓取，第二种是使用了`iconv-lite`进行了网页编码的转换。
实际上，这个网页在`<head>`部分已经注明：

```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
```

其实这也是题主困惑的地方，明明编码使用的`utf-8`，为什么得不到正确的结果？

### 问题分析

问题出在`Response`的数据编码上，可以通过浏览器查看到`Response Headers`：

```html
Connection:keep-alive
Content-Encoding:gzip
Content-Length:11902
Content-Type:text/html; charset=utf-8
Date:Mon, 21 Nov 2016 23:53:49 GMT
Server:Tengine
```

可以看到这样一行：`Content-Encoding:gzip`，当前网页已经使用`gzip`进行了加密。就好比说别人发给你一个rar的压缩包，但是你直接当成`utf-8`的文本文件进行解码，当然得不到正确的结果。想要得到正确的结果的话，需要先脱鞋子再脱袜子（先解压缩再进行文本编码）：

```nodejs
var http = require("http");
var zlib = require('zlib');

http.get("http://www.runoob.com/nodejs/nodejs-tutorial.html", function(res) {
    var html = [];
    res.on("data", function(data) {
        html.push(data);
    })
    res.on("end", function() {
        var buffer = Buffer.concat(html);
        zlib.gunzip(buffer, function(err, decoded) {
            console.log(decoded.toString());
        })
    }).on("error", function() {
        console.log("获取失败")
    })
})
```

实际上大多数现代语言内部的字符串都使用了`utf-8`编码，所以此处解压缩之后就可以得到自己想要的结果。

### 问题深入

其实题主的代码中隐藏着这样的一个问题：

他认为得到数据已经是文本类型了，所以直接使用`html+=data;`这种方式来进行拼接。但实际上，服务器端传递过来的数据是二进制数据，对分块后的二进制数据进行拼接或者是编解码操作，可能会导致最后生成的字符串出现截断。所以正确的方式应该是使用内置的`Buffer`类型进行操作。

后来题主通过私信问了我这样一个问题：

> 为什么网页上都有Content-Encoding:gzip，有的需要解压gzip，而有的不需要？

我认为要看服务器端是怎么实现的，很多服务器会先检测`Request Headers`中的`Accept-Encoding`，然后再决定发送什么样的数据。`runoob.com`这个网站很有可能就是没有做这样的处理，统一返回的gzip之后的页面。

### 问题解决

这个问题已经解决了，下面需要考虑的是怎么样去避免这个问题。

从客户端开发者的角度来看，如果不能确定访问的网页的数据类型，需要自己做一下判断：

```nodejs
var contentEncoding = res.headers["content-encoding"];
...
if (contentEncoding === "gzip") {
    xxxxx;
} else if (contentEncoding === "deflate") {
    xxxxx;
} else {

}
```

从服务器端开发者的角度来看，不能假定用户会以我们期待的方式去处理数据，所以一定要显式的指定我们数据的呈现形式。

包括但不限于：

- 在`HTML`中显式指定`Content-Type`

```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
```

- 服务器端返回的`Response Headers`中要显式指定内容编码和类型

```html
Content-Encoding:gzip
Content-Type:text/html; charset=utf-8
```

## 总结

其实在web开发这个领域，规范已经非常详细了，文本的编码，Headers的定义，服务器端的返回值等等。不要把规范当成默认，一定要显式指定规范中描述的参数，不要让用户来猜测你的数据类型。作为开发者，在严格遵守相应规范的同时，也要考虑兼容用户不符合规范的行为。当然，这种兼容也要有一定的尺度，强行兼容所有可能的用户行为往往吃力不讨好，落入了过度设计与提早优化的深渊。

个中尺度的把握，往往能够看出一个程序员的火候。

以此自勉。
