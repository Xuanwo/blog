---
categories: Code
date: 2020-06-01T01:00:00Z
title: go-mime 介绍以及踩坑记录
---

上周花了一天时间写了一个 [MIME 检测](https://github.com/qingstor/go-mime) 的库，作用是能够根据后缀名来检测对应的 Media Type 类型，比如说输入 `pdf` 能够返回  `application/pdf`。本文介绍一下这个库以及开发过程中的踩坑记录。

## 背景

服务器端检测文件 `Media Type` （之前经常被叫做 `MIME types`）的方法通常有三种：第一是看请求中携带的 `content-type`，第二是读取文件开头的 `Magic Number`，第三则是看请求中携带的文件名。

其中只有第一种根据 `content-type` 判断是在 [RFC7273](https://tools.ietf.org/html/rfc7231#section-3.1.1.5) 中标准化过的行为，剩下的两种都是约定俗成：提供/使用这种 `Media Type` 的软件/服务自行规定 `Magic Number` 和后缀名。

以常见的 PDF 为例，它的 `Media Type` 模板中会有这样的内容：

```
Magic number(s): All PDF files start with the characters "%PDF-"
followed by the PDF version number, e.g., "%PDF-1.7" or
"%PDF-2.0".  These characters are in US-ASCII encoding.

File extension(s): .pdf
```

这些是在 PDF 相关的 [RFC 8188: The application/pdf Media Type](https://tools.ietf.org/html/rfc8118) 中规定的，考虑的比较周到，不管是 `Magic Number` 还是文件后缀名都给出了明确的说明。

而根据 [BCP 13](https://www.rfc-editor.org/info/bcp13)，任何人和组织都能够注册 `Media Type`，因此文件后缀名撞车也是常有的事情，尤其是在 `vnd.` 前缀下的 `Media Type`，我也数不清有多少 `Media Type` 注册了 `json` 和 `xml`。还有很多 `Media Type` 没有注册 `Magic Number`，其中有大部分是纯文本类型。

所以 `Meida Type` 与文件后缀名和 `Magic Number` 之间并没有明确的一一映射，大家只能自行归纳和整理，这也是为什么每个操作系统和语言都有一套自己的 `mime-types` 集。

其中 golang 的实现是自己有一个比较小的内置类型映射：

```go
var builtinTypesLower = map[string]string{
	".css":  "text/css; charset=utf-8",
	".gif":  "image/gif",
	".htm":  "text/html; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".jpeg": "image/jpeg",
	".jpg":  "image/jpeg",
	".js":   "text/javascript; charset=utf-8",
	".mjs":  "text/javascript; charset=utf-8",
	".pdf":  "application/pdf",
	".png":  "image/png",
	".svg":  "image/svg+xml",
	".wasm": "application/wasm",
	".webp": "image/webp",
	".xml":  "text/xml; charset=utf-8",
}
```

除此之外的类型会读取系统中以下三个文件：

- `/etc/mime.types`
- `/etc/apache2/mime.types`
- `/etc/apache/mime.types`

## 问题

用户在调用 `Pub Object` 等 API 的时候如果没有指定 `content-type` 的话，服务器端会根据文件后缀名来尝试检测对应的 `Media Type`。之前的实现是使用 go 自带的 [`mime`](https://golang.org/pkg/mime/) 包，但是在测试中遇到了相同文件后缀返回的 `Media Type` 不一致的问题。经过排查后发现是服务器上的 `/etc/mime.types` 文件不一致，有些节点安装了对应的包，有些则没有。避免这种不一致最好的方式不要依赖系统提供这个文件，因此我们决定替换掉 `mime` 包，改成自己的实现。

看了下社区的实现，主要有以下两个：

[cubewise-code/go-mime](https://github.com/cubewise-code/go-mime)

数据源来自 [micnic/mime.json](https://github.com/micnic/mime.json)，而 `micnic/mime.json` 提取自一个 Node.js 社区的项目 [jshttp/mime-db](https://github.com/jshttp/mime-db)。功能上能够满足我们的需求，但是维护的质量堪忧，用于生成 `mimeTypes` 的代码并没有一并开源出来（虽然肯定非常简单）。原始数据也倒了很多层次，一方面是增加了出错的可能性，另一方面是影响更新的及时性。

[gabriel-vasile/mimetype](https://github.com/gabriel-vasile/mimetype)

看起来比上一个好不少，但是这个库专注于通过 `Magic Number` 来判断文件的 `Media Type`，而我们的业务场景决定了我们不能读取用户上传的数据来获取 `Magic Number`。此外这个库只支持了少量文件类型（147 种），数据源也不是非常明确。

所以需要自己造一个轮子。

## 设计

我们需要一个这样的 `MIME` 库：

- 没有第三方依赖
- 不依赖系统行为
- 尽可能直接处理原始数据
- 支持多种方式检测（首先支持文件后缀名）

最难的地方在于找到合适的数据源。正如前面所提到的，当今的各种规范中都没有明确定义 `Media Type` 到文件后缀名的一一映射。经过一番搜寻之后，只能找到如下相对可信的来源：

- [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)
- [Nginx conf/mime.types](http://hg.nginx.org/nginx/file/tip/conf/mime.types)
- [Apache httpd docs/conf/mime.types](http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)
- [mailcap mime.types](https://pagure.io/mailcap/blob/master/f/mime.types)

其中很多发行版会使用 `mailcap` 提供的 `mime.types` 作为 `/etc/mime.types`，已知的有 [archlinux](https://www.archlinux.org/packages/extra/any/mailcap/)。

所以最后决定第一期解析 IANA 的 `Media Type Template` 和 `mailcap` 提供的 `mime.types` 并生成一个 `map[<file-extension>]<media-type>`。

## 实现

具体的实现没有什么值得说的，值得一提的是 IANA Media Types Registry 中居然还有个 template 404 了，好在他们的响应速度还挺快的，周五给他们发了邮件，周日就 Fix 了。

> 我真心觉得 IANA 应该尽快采用结构化数据，这 Meida Type Template 也太傻了。。

## Showtime

目前 `go-mime` 只提供了两个接口：`DetectFileExt` 和 `DetectFilePath`。

```go
import (
    "github.com/qingstor/go-mime"
)

func main()  {
    // Get mime type via file extension.
    mimeType := mime.DetectFileExt("pdf")
    // Get mime type via file path or name.
    mimeType := mime.DetectFilePath("/srv/http/a.pdf")
}
```

做了一些简单的 Benchmark：

```go
goos: linux
goarch: amd64
pkg: github.com/qingstor/go-mime
BenchmarkDetectFilePath
BenchmarkDetectFilePath-8                	64920656	        18.1 ns/op
BenchmarkDetectFileExt
BenchmarkDetectFileExt-8                 	98209147	        10.9 ns/op
BenchmarkDetectFileExtWithMissingExt
BenchmarkDetectFileExtWithMissingExt-8   	98105074	        11.8 ns/op
BenchmarkGoMime
BenchmarkGoMime-8                        	25084992	        47.7 ns/op
BenchmarkGoMimeWithMissingExt
BenchmarkGoMimeWithMissingExt-8          	10683265	       104 ns/op
PASS
```

## 下一步规划

目前只实现了最基础的功能，接下来考虑在以下的方面做一些改进

- 目前的 Generator 实现比较难看，之后考虑重构的更加清晰
- 支持读取 `Magic Number`，多种方式判断
- 支持 `Media Type Parameters`，比如说 `charset`
- 支持给定 `Media Type` 返回可能的文件后缀名

## 参考资料

- [RFC 7273](https://tools.ietf.org/html/rfc7231#section-3.1.1.5) 中规定的 HTTP Header Content-Type
- [The application/pdf Media Type](https://tools.ietf.org/html/rfc8118) 中规定了 PDF 的 `Media Type`
- [BCP 13](https://www.rfc-editor.org/info/bcp13) 包括两个 RFC：[RFC 6838: Media Type Specifications and Registration Procedures](https://tools.ietf.org/html/rfc6838) 和 [RFC 4289](https://tools.ietf.org/html/rfc4289)
