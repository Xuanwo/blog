---
categories: Develop
date: 2016-11-12T00:00:00Z
tags:
- Develop
- Web
title: httpbin 介绍
url: /2016/11/12/httpbin-intro/
---

在所有需要做HTTP请求的开发过程中，总有一个这样的痛点：我发出去的请求到底是什么样子的？特别是在一些需要签名和认证的场合，服务器只会冷冰冰的返回一个`40x`错误，你无从得知错误的具体详情。本文旨在介绍`httpbin`，看看它是如何解决这个痛点的。

<!--more-->

## httpbin是什么

`httpbin`是一个`HTTP Request & Response Service`，你可以向他发送请求，然后他会按照指定的规则将你的请求返回。这个类似于`echo服务器`，但是功能又比它要更强大一些。
`httpbin`支持HTTP/HTTPS，支持所有的HTTP动词，能模拟302跳转乃至302跳转的次数，还可以返回一个HTML文件或一个XML文件或一个图片文件（还支持指定返回图片的格式）。实在是请求调试中居家必备的良器！

## httpbin怎么用

`httpbin`的使用方法非常简单，你只需要把请求的地址修改为`httpbin.org`即可。
比如：

### 获取请求中的user-agent

请求：

```bash
curl http://httpbin.org/user-agent
```

返回：

```json
{"user-agent": "curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8l zlib/1.2.3"}
```

### 查看自己的GET请求

请求：

```bash
curl http://httpbin.org/get
```

返回：

```json
{
   "args": {},
   "headers": {
      "Accept": "*/*",
      "Connection": "close",
      "Content-Length": "",
      "Content-Type": "",
      "Host": "httpbin.org",
      "User-Agent": "curl/7.19.7 (universal-apple-darwin10.0) libcurl/7.19.7 OpenSSL/0.9.8l zlib/1.2.3"
   },
   "origin": "24.127.96.129",
   "url": "http://httpbin.org/get"
}
```

更多的用法可以参考官方的主页： <https://httpbin.org/>

## 如何部署在内网

考虑到`httpbin`部署在国外，加上业务调试的时候不想跟外部的服务器交互，`httpbin`也可以采用自己部署的方式。

### 从Pypi安装并使用

```bash
pip install httpbin gunicorn
gunicorn httpbin:app
```

### 从源码安装

```bash
git clone https://github.com/Runscope/httpbin.git
pip install -e httpbin
python -m httpbin.core [--port=PORT] [--host=HOST]
```

## 参考资料

- [httpbin官方网站](https://httpbin.org/)
