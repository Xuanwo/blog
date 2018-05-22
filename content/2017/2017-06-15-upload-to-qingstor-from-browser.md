---
categories: Develop
date: 2017-06-15T15:44:00Z
excerpt: 从浏览器端向 QingStor 对象存储上传是很多开发者的需求，虽然 QingStor 提供了相关的接口和 SDK，但是仍有很多开发者表示不知道怎么样去调用。本文的目的是系统的展示一下如何从浏览器端上传一个文件到对象存储，从而解决大多数开发者们的需求。
tags:
- Node.js
- HTML
- Web
- JavaScript
- QingStor
title: 从浏览器端向 QingStor 对象存储上传文件
toc: true
url: /2017/06/15/upload-to-qingstor-from-browser/
---

从浏览器端向 QingStor 对象存储上传是很多开发者的需求，虽然 QingStor 提供了相关的接口和 SDK，但是仍有很多开发者表示不知道怎么样去调用。本文的目的是系统的展示一下如何从浏览器端上传一个文件到对象存储，从而解决大多数开发者们的需求。

<!--more-->

> 为了理解本文的内容，读者需要一些基本的 HTML，JavaScript 知识，同时需要对 QingStor 对象存储服务有一些基本的了解。前者可以查看 [MDN Web 技术文档](https://developer.mozilla.org/zh-CN/docs/Web)，后者可以查看 [QingStor 对象存储服务概述](https://docs.qingcloud.com/qingstor/api/common/overview.html) 。

## 表单上传

QingStor 对象存储支持通过 HTML 表单上传的方式向存储空间上传一个对象，文档可以参考[此处](https://docs.qingcloud.com/qingstor/api/object/post.html)。根据存储空间的权限设置，主要分为两种情况：匿名可写与匿名不可写，接下来分别介绍一下。

### 匿名可写

```html
<!DOCTYPE html>
<html>

<body>
  <h3>Upload</h3>
  <form id="upload" action="https://<bucket>.<zone>.qingstor.com" method="POST"
        enctype="multipart/form-data">
    <span>Click or Drag a File Here to Upload</span>
    <input type=hidden name="key" value="<key>" />
    <input type=file name="file" />
    <input type=submit name="Upload" value="Upload to QingStor" />
  </form>
</body>

</html>
```

其中：

- `<bucket>`: 存储空间的名称
- `<zone>`: 存储空间所在的区域
- `<key>`: 文件上传后在存储空间中的名字，支持内置变量，比如 `${filename}`

很多人最开始使用这个接口的时候会吐槽为什么 file 一定要放在最后，这是因为我们遵循了现有的 [multipart post 方法](http://hc.apache.org/httpclient-3.x/methods/multipartpost.html) 的实现——将表单分成了两个部分： StringPart 与 FilePart ，file 类型之后的全部表单项都会被丢弃，因此 file 这个 input 项一定要放在表单的最后。

解决掉 input 顺序这个问题之后，可以发现表单上传是一个非常简单易用的接口：我只需要构建一个 form 表单，指定上传的域名、文件名即可，浏览器会自动处理剩下的所有工作。

### 匿名不可写

更常见的情况是我们需要上传文件到一个私有的存储空间当中，此时我们需要对我们的 POST 请求进行签名。

```html
<!DOCTYPE html>
<html>

<body>
  <h3>Upload</h3>
  <form id="upload" action="https://<bucket>.<zone>.qingstor.com" method="POST"
        enctype="multipart/form-data">
    <span>Click or Drag a File Here to Upload</span>
    <input type=hidden name="key" value="<key>" />
    <input type=hidden name="policy" value="<policy>" />
    <input type=hidden name="access_key_id" value="<access_key_id>" />
    <input type=hidden name="signature" value="<signature>" />
    <input type=file name="file" />
    <input type=submit name="Upload" value="Upload to QingStor" />
  </form>
</body>

</html>
```

其中：

- `<policy>`: policy 是一个经过 base64 编码之后的 JSON 字符串，其中的内容包括除了 file， access_key_id， policy，signature 之外的所有表单项。
- `<access_key_id>`: access_key_id 是用户的 access_key_id
- `<signature>`: 用 secret key 对 base64 编码后的 policy 字符串进行 HMAC-SHA256 签名得到的字符串，同样需要进行 base64 编码。

与匿名上传相比，上传到一个私有空间需要使用请求者的 access_key_id 进行签名。签名流程如下：计算 policy 字符串并进行 base64 编码，使用 secret key 对 policy 字符串进行 HMAC-SHA256 签名并进行 base64 编码。

以最简单的上传为例：policy 字符串为 `{"key": "test_key"}` ，经过 base64 编码之后变为 `eyJrZXkiOiAidGVzdF9rZXkifQ==`，我们使用 `test_secret_key` 作为 secret key 来进行 HMAC-SHA256 签名并进行 base64 编码，可以得到 `HfMhlYYA4bgyoq3SDMWqiJ1XWm1/TORTfkZk+WODxag=`。此时，我们本次请求中的 policy 应填写 `eyJrZXkiOiAidGVzdF9rZXkifQ==`， 而 signature 则应填写 `HfMhlYYA4bgyoq3SDMWqiJ1XWm1/TORTfkZk+WODxag=`。

使用 POST 接口上传比较简单，后端只需要实现简单的签名逻辑即可实现上传到指定对象存储存储空间的功能，后续还可以结合各种上传插件实现上传进度条等功能。适合用在只需要用户上传文件，没有复杂交互的场景，比如论坛附件上传，在线编辑器上传图片等。

## 直接调用 SDK 上传

POST 接口虽然方便，但是功能比较弱，为了满足开发者们的需求，QingStor 提供的 [qingsotr-js-sdk](https://github.com/yunify/qingstor-sdk-js) 通过 [Browserify](http://browserify.org/) 实现了浏览器环境的兼容，开发者只需要引入我们提供的 js 文件即可在浏览器环境中调用接口。

> 在开始之前，我们需要正确设置 Bucket 的 CORS 使得我们可以顺利的进行跨域请求。详细操作方法可以参考[此处](https://docs.qingcloud.com/qingstor/guide/index.html#cors)，其中`允许的请求源`和`允许 HTTP 请求头`均可以设置为 `*` 以方便调试。

```html
<!DOCTYPE html>
<html>

<head>
  <script src='qingstor-sdk.min.js'></script>
</head>

<body>
  <h3>Upload</h3>
  <input type="file" onchange="upload()" id="file" name="file" />
  <script>
    let Config = require('qingstor-sdk').Config
    let QingStor = require('qingstor-sdk').QingStor;
    let config = new Config('<access_key_id>', '<secret_access_key>');
    let bucket = new QingStor(config).Bucket('<bucket>', '<zone>');
    function upload() {
      let f = document.getElementById("file").files[0];
      let reader = new FileReader();
      reader.readAsBinaryString(f);
      reader.onload = (() => {
        bucket.putObject(f.name, {
          body: reader.result
        });
      });
    }
  </script>
</body>

</html>
```

其中：

- `<access_key_id>`: 用户的 access_key_id
- `<secret_access_key>`: 用户的 secret_access_key
- `<bucket>`: 需要上传的 bucket name
- `<zone>`: bucket 所在的区域

样例代码逻辑比较简单，主要有以下几个部分：

- 脚本中进行了一些初始化的工作，创建了 Config ，QingStor 和 Bucket 对象。
- file input 监听了 change 事件，只要用户选择了新的文件，就会调用 upload 方法。
- 在 upload 方法中，首先是选取文件列表中的第一项，然后使用 HTML 5 新提供的 FileReader 接口来读取文件内容。
- 在 FileReader 读取完毕后，调用 bucket.putObject 方法来进行文件上传，使用文件名作为上传所使用的 Key。

可以看到，直接使用 SDK 进行文件上传也非常简单。跟使用 POST 接口相比，需要引入一个额外的 JS 文件依赖，不需要自行进行容易出错的签名计算。最大的缺点在于：初始化 SDK 时需要暴露自己的 access_key_id 和 secret_access_key，这显然是不可接受的。我们需要寻找到一种方法，使得签名的过程可以服务器端完成，从而不需要暴露自己的密钥信息。

## 部署签名服务器

之前提到，在服务器端进行签名可以使得敏感的密钥信息不会暴露出去，解决方案就是部署一套签名服务器。我们实现了一个基于 qingstor-js-sdk 的签名服务器 demo，开源在 https://github.com/yunify/qingstor-demo-signature-server-nodejs ，同时附有 server 端和 client 端，开发者可以方便的复用其中的逻辑，按照自己的业务需求来实现相关的逻辑。

部署签名服务器非常简单，只需要如下几步：

```bash
git clone https://github.com/yunify/qingstor-demo-signature-server-nodejs.git
cd qingstor-demo-signature-server-nodejs
npm install
```

然后根据 server_config.yaml.example 编辑自己的 server_config.yaml 文件，最后执行 `npm run server` 就可以启动我们的签名服务器 Demo。

接下来这个实例会展示如何使用签名服务器进行签名，并上传一个文件。

```html
<!DOCTYPE html>
<html>

<head>
  <script src='qingstor-sdk.min.js'></script>
</head>

<body>
  <h3>Upload</h3>
  <input type="file" onchange="upload()" id="file" name="file" />
  <script>
    let Config = require('qingstor-sdk').Config
    let QingStor = require('qingstor-sdk').QingStor;
    let config = new Config('not_need', 'not_need');
    let bucket = new QingStor(config).Bucket('<bucket>', '<zone>');
    function upload() {
      let f = document.getElementById("file").files[0];
      let reader = new FileReader();
      reader.readAsBinaryString(f);
      reader.onload = (() => {
        let req = bucket.putObjectRequest(f.name, {
          "Content-Type": f.type
        });
        fetch("http://localhost:9000/operation?channel=header", {
            method: "POST",
            body: JSON.stringify(req.operation),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          })
          .then(res => res.json())
          .then(res => {
            req.operation.headers.Authorization = res.authorization;
            req.operation.body = reader.result;
            req.send()
          })
      });
    }
  </script>
</body>

</html>
```

其中：

- `<bucket>`: 需要上传的 bucket name
- `<zone>`: bucket 所在的区域

跟直接使用 SDK 上传相比，通过部署签名服务器上传的方案多了向签名服务器发送本次请求并获取签名信息的部署。js sdk 对外暴露了生成 Request 的接口，通过 bucket.putObjectRequest 可以创建一个 Request 实例，并将 Request.operation 发送到签名服务器以进行签名，最后服务器端返回的是签名好的 Authorization 字符串。然后再手动调用 Request 的 send 方法进行实际的上传即可。

部署签名服务器的方案比之前的几种都要复杂，但是更贴合用户的使用场景，可以完整的覆盖大多数用户在浏览器端与 QingStor 对象存储进行交互的需求。

## 总结

在这里可以对浏览器端几种与 QingStor 对象存储进行交互的方案进行一个简短的总结：

- POST 接口：简单方便，便于与现有的服务器端集成，适用于论坛附件上传，在线编辑器上传图片等场景
- SDK 上传： 简单方便，但是会暴露出用户的密钥信息，适用于一些 No BackEnd 应用，可以让用户自行填写自己的密钥，比如在线 Markdown 编辑器，可以实现复制进来的图片自动上传这样的功能。
- 部署签名服务器： 比较复杂，适用于大多数场景，密钥信息保存在服务器端，不会泄漏给用户。

此外，所有的代码都已经上传到 Gist，感兴趣的同学可以自取：  <https://gist.github.com/Xuanwo/425fa071d4601d39fc5c902a12ab5784>
