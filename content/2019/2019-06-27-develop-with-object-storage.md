---
categories: Develop
date: 2019-06-27T01:00:00Z
tags:
- storage
- qingstor
title: "QingStor 对象存储对接指北"
url: /2019/06/27/develop-with-object-storage/
---

在工作中接触到过很多不了解对象存储的开发者在对接上遇到了很多问题，这篇文章旨在从核心概念出发介绍 QingStor 对象存储，然后介绍 API 和 SDK 及其注意事项，最后总结一下遇到的常见问题，希望能解决大多数人的困惑。

<!--more-->

## 核心概念

### Service

对象存储服务的顶层命名空间。在同一个命名空间下，Bucket Name 是唯一的。每个对象存储 Serivce 都会有一个独立的 Host，比如青云 QingStor 对象存储的 Host 是 `qingstor.com`。私有云用户在接入时需要将 Host 修改为对应的环境配置的 Host。

### Zone

每个对象存储 Service 都会至少有一个 Zone，每个 Zone 会有一个唯一的标识。比如青云公有云目前线上运维的对象存储 Zone 包括：`pek3a`，`pek3b`，`sh1a` 和 `gd2`。

### Bucket

Bucket 是用户申请的存储空间，每个 Bucket 都会属于一个 Zone，每个 Bucket 在同一个 Service 下都是全局唯一的，每个 Bucket 彼此之间完全隔离。

Bucket 将会是域名的一部分，因此 Bucket 在命名时需要遵守以下规则：

- 遵守 DNS 命名规则
- 长度在 6 ~ 63 之间
- 只能包含小写字母，数字和连接字符 `-`
- 开头和结尾只能是小写字母或数字

### Object

Object 是用户访问数据的最小单元，每个 Object 都会属于一个 Bucket，每个 Object 在同一个 Bucket 下都是唯一的。单个 Object 最大 50TB。

Object 将会是 URL 的一部分，因此 Object 在命名需要遵守以下规则：

- 长度须在 1-1023 字节之间
- 第一个字符不能是反斜杠 `/`
- 须用 UTF-8 编码

在发送请求的时候，Object Key 部分需要进行 URL 编码。

## API 介绍

对象存储对外暴露的是 RESTful 风格的 API。

```
GET /?delimiter=/&limit=4 HTTP/1.1
Host: mybucket.pek3a.qingstor.com
Date: Sun, 16 Aug 2015 09:05:00 GMT
Authorization: authorization string

HTTP/1.1 200 OK
Server: QingStor
Date: Sun, 16 Aug 2015 09:05:00 GMT
Content-Length: 559
Connection: close
x-qs-request-id: aa08cf7a43f611e5886952542e6ce14b

{
  "name": "mybucket",
  "keys": [
    {
      "created": "2016-08-22T15:03:32.000Z",
      "modified": 1471878212,
      "encrypted": true,
      "storage_class": "STANDARD",
      "etag": "\"4f44b10f5cb83777fea4ef88a3f7b3c4\"",
      "key": "api.txt",
      "mime_type": "text/plain",
      "size": 38970
    },
    {
      "created": "2016-08-22T15:09:52.000Z",
      "modified": 1471878592,
      "encrypted": false,
      "storage_class": "STANDARD_IA",
      "etag": "\"9f1cd921dbb6656c2c9e57f83f73d70e\"",
      "key": "bigtable-osdi06.pdf",
      "mime_type": "application/pdf",
      "size": 221214
    }
  ],
  "prefix": "",
  "owner": {
    "id": "usr-DxWdNcCr",
    "name": "william"
  },
  "delimiter": "/",
  "limit": 4,
  "marker": "",
  "next_marker": "bigtable-osdi06.pdf",
  "has_more": true,
  "common_prefixes": [
    "QCI/",
    "Screenshot/"
  ]
}
```

正如上面这个样例展示的：

- 通过 HTTP 动词来区分语义，GET 表示获取资源，PUT 表示上传整个资源等
- 通过返回标准的 HTTP Status Code 来标识本次请求的状态，比如 200 表示正常，401 表示认证失败等，详细的 error code 可以参考[此处](https://docs.qingcloud.com/qingstor/api/common/error_code)
- 输入和输出均为 JSON 格式

此外，API 请求时还有如下需要关注的点：

- 所有请求返回的 Response 都会带有 `x-qs-request-id` Header，在请求遇到问题时在工单中附上 `request-id` 将有助于我们更快的定位问题
- 所有请求发送时都需要携带正确的 Date 和 Host，其中 Date 采用 UTC 时间，格式由 [RFC 822](https://www.ietf.org/rfc/rfc822.txt) 定义，该时间误差不能超过 15 分钟
- 除非访问公开的 Bucket，所有的请求都需要认证，认证文档参考[此处](https://docs.qingcloud.com/qingstor/api/common/signature)，无特殊需求请使用官方提供的 SDK

QingStor 对象存储同时支持通过 HTTP 和 HTTPS 协议访问，使用的都是标准端口。

支持通过两种风格访问：

- `Virtual-host Style`: `<bucket_name>.<zone_id>.qingstor.com/<object_key>`
- `Path Style`: `<zone_id>.qingstor.com/<bucket_name>/<object_key>`

比如上传 `arch-is-the-best.png` 到位于 `pek3b` 的 `linux` Bucket 下，请求应当形如：

```
PUT https://linux.pek3b.qingstor.com/arch-is-the-best.png
```

QingStor 对象存储支持 S3 兼容模式，访问形式为每个 Zone 提供一个 s3 的子域：

- `Virtual-host Style`: `<bucket_name>.s3.<zone_id>.qingstor.com/<object_key>`
- `Path Style`: `s3.<zone_id>.qingstor.com/<bucket_name>/<object_key>`

## SDK 介绍

QingStor 对象存储目前提供了绝大部分语言的 SDK，他们都共用相似的逻辑：

- 首先初始化 Config
- 然后创建 Service 实例
- 通过 Service 实例可以初始化出一个 Bucket 实例

所有的 API 可分为三类：

- Service: https://docs.qingcloud.com/qingstor/api/service/
- Bucket: https://docs.qingcloud.com/qingstor/api/bucket/
- Object: https://docs.qingcloud.com/qingstor/api/object/

其中 Service 实例可以处理 Serivce 级别的 API，而 Bucket 实例可以处理 Bucket 和 Object 级别的 API。

所有 SDK 均通过 API Specs 自动生成，采用与语言主流风格相似的命名逻辑，比如 Golang 中 `ListObjects`，Python 中是 `list_objects`，Node.js 中是 `listObjects`。

## 常见问题

在总结我见过的常见问题之前，首先分享几个关于工单的小秘密：

- 提工单之前首先检查自己有没有什么低级错误（要不然这个单子会很没意思）
- 提工单的时候提供完整的信息会有助于问题的快速解决（在对象存储这边就是 Zone，Bucket，SDK，最最最重要的是请带上 `request_id`）
- 在工单里面发脾气是没用的（在哪里都没用，做个大人吧）

### 如何做断点续传？

断点续传分成上传和下载，下载使用标准的 HTTP Range Header 来下载指定的部分，上传则需要使用分段上传的接口，具体的流程可以参考 [Multipart 分段上传过程](https://docs.qingcloud.com/qingstor/api/object/multipart/index.html)。在分段上传完成后，它就是一个完整的 Object，无法再获取到分段的信息。

### 如何上传超大文件？

超大文件需要使用分段上传接口，单个分段最大 5GB，与 PutObject 的限制一致，单文件最大可到 50TB。

### 如何访问上传的文件？

正如上面提到的，对象存储提供的是 RESTful 的 API 接口，上传时用 PUT，下载就用 GET，删除用 DELETE。

### 如何创建文件夹？

对象存储没有层次结构，因此也没有文件夹的概念。

但是对象存储支持指定一个分隔符，把带有相同分隔符的 Object 组织到一起，可以模拟出文件夹。比如：

```
ubuntu/my-patch-is-so-good.patch
ubuntu/this-apt-has-super-power.png
centos/my-gcc-is-5.txt
centos/my-kernel-is-3-10.jpg
arch/my-gcc-is-going-to-9.gif
i-use-systemd.txt
```

如果指定 `delimiter` 为 `/`，则我们会得到形如这样的结果：

```json
{
  "common_prefixes": [
    "ubuntu/",
    "centos/",
    "arch/"
  ],
  "keys": [
    {
     "created": "2016-08-22T15:03:32.000Z",
     "modified": 1471878212,
     "encrypted": true,
     "storage_class": "STANDARD",
     "etag": "\"4f44b10f5cb83777fea4ef88a3f7b3c4\"",
     "key": "i-use-systemd.txt",
     "mime_type": "text/plain",
     "size": 38970
   }
  ]
}
```

`common_prefixes` 就是那些有共同前缀的 Key，而 `keys` 则是当前 prefix 下不带有指定 `delimiter` 的 Key。

`delimiter` 可以是任意 Char，不过我们一般指定为 `/`。

### 如何下载文件夹？

List 指定 Prefix，然后下载所有的 Key。

也可以使用命令行工具，比如 [`qsctl`](https://github.com/yunify/qsctl)，[`qscamel`](https://github.com/yunify/qscamel)。

### 如何批量删除文件？

List 指定 Prefix，然后逐个删除或使用 [`DeleteMultipleObjects`](https://docs.qingcloud.com/qingstor/api/bucket/delete_multiple) 接口。

### 内网访问

青云 IaaS 与同一个 Zone 的对象存储是内网互通的，因此在青云 IaaS 中访问对象存储不收取公网流量费用。对象存储的 `Service Global Server` 可能部署在其他区域，因此没有绑定公网 IP 的机器可能无法访问，此时可以直接指定 Bucket 所在的 Zone，避免工具或者 SDK 访问 Global Server 来自动检测 Bucket 的 Zone。

如果担心 DNS 解析结果不正确导致走公网的话，可以 `dig <zone_id>.qingstor.com`：如果返回的是 `10.x` 开头的内网 IP，则说明访问会走内网；如果返回的是 `139.198.x` 开头的公网 IP，则说明访问会走公网。

### request_expired 是什么问题？

QingStor 对象存储服务会通过 Date 来检查签名的时间，如果服务器收到请求的时间与 Date 相差过大，则会返回该错误。在确定网络没有明显拥堵的情况下，请检查服务器本身的时间是否已经校准。

### 浏览器访问遇到 CORS 报错

在浏览器端访问对象存储的时候经常会遇到 CORS 相关的报错，请正确配置 Bucket 的 CORS。

### 浏览器端如何避免密钥泄漏

访问对象存储服务需要 `Access Key ID` 和 `Secret Access Key`，这两个值不能直接暴露在浏览器中，否则会导致密钥泄漏。此时需要自行搭建签名服务器，在后端校验请求后在本地进行请求的签名，并将签名的结果返回给前端。整体的访问流程如下：

- 浏览器请求签名服务器
- 签名服务器返回签名后的结果
- 浏览器发送签名后的请求
- 对象存储服务器响应

签名服务器与业务耦合比较紧密，因此只提供了一个 demo 作为参考：[QingStor Demo - Signature Server (NodeJS)](https://github.com/yunify/qingstor-demo-signature-server-nodejs)

## 参考资料

- [QingStor 对象存储文档](https://docs.qingcloud.com/qingstor/)
- [HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
