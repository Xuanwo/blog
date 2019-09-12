---
categories: Code
date: 2019-08-22T01:00:00Z
tags:
- Golang
series: "Engineering Efficiency"
title: Go Modules 迁移实战经验
url: /2019/08/22/go-modules-migrate/
---

自从上次 [Go Modules 分享](https://xuanwo.io/2019/05/27/go-modules/)以来，我们 Team 的所有 Golang 项目在逐步的切换到 Go Modules，但是在实际执行的操作中遇到了很多问题。本文首先分享我们实际的迁移方案，然后分享我们遇到的问题及其解决方案，最后会谈谈现在还存在的一些问题。

## 迁移方案

### 现状

> 所有地址和项目均为虚构，并未实际使用，仅用于说明

公司内部的 gitlab 地址是 `git.enterprise.dev`，team 内部现在同时进行着 `alpha`, `beta`, `gamma`, `delta` 等多个项目，他们分散在 gitlab 的不同组织下。然后 `alpha` 作为最早的项目，它还包括了 `common-go`这样一个被所有项目都引用的基础库，此外还有大量的 fork 自第三方且内部进行了定制化的开源项目。项目之前的命名均采用 `alpha-io`， `alpha-common` 这样的形式。

之前没有统一过 Team 内部的项目依赖管理工具，因此 Team 内的项目同时存在着自己写的脚本，[glide](https://github.com/Masterminds/glide),  [dep](https://github.com/golang/dep) 等多种依赖管理工具。由于依赖管理工具的混乱，也导致了构建步骤的混乱。很多项目的 `Makefile` 中会修改 `GOPATH` 为 `<project_path>/build`，并在构建打包的时候把整个 build 都复制到远程的 Builder 上进行构建。整个构建流程的结果无法复现，不同人打包的结果可能完全是不一致的。

### 方案

首先我们确定了项目统一的命名规则：

- 所有项目都放在 `git.team.dev` 下
- 按照所属项目的不同来划分 namespace
  - 每个项目拥有自己独立的 namespace，比如 `git.team.dev/alpha`
  - `global` 存放 team 全局的项目，比如 `common-go`： `git.team.dev/global/common`
  - `external` 存放所有 fork 自第三方的项目，比如 `teapot`: `git.team.dev/external/teapot`
- 取消所有用来区分项目的前缀
  - `git.enterprise.dev/team/alpha-io` -> `git.team.dev/alpha/io`

然后我们基于 [Athens](https://github.com/gomods/athens) 搭建了 Team 共用的 GOPROXY： `https://goproxy.team.dev`，主要做了如下配置：

- 配置了到我们内网的 VPN，使得它网络上到我们内网 gitlab 是通的
- 配置了科学上网的代理，使得它可以顺畅的访问外部资源
- 在 gitlab 上创建了专门的 robot 帐号，并配置 SSH key，授予它所有项目的 Read Only 权限

最后是完成对项目的 Replace。这个部分我们走了一些弯路，一开始是依赖大家在项目中自行做 replace，但是引发了很多问题，因此我开发了 [go-mod-redirect](https://github.com/Xuanwo/go-mod-redirect) 来完成项目 import 路径的映射。

### 步骤

刚才介绍的是整体的迁移方案，下面就谈一谈我们完成迁移执行的具体步骤：

- 升级本地的 Golang 版本至 1.11.3，最好是 1.12.x
- `export GO111MODULE=on`
- `go mod init` 或者 `echo "module git.team.dev/<namespace>/<project>" > go.mod`
- 批量替换项目中的 import 路径
- `go mod tidy`
- 调整并修改依赖
- `go build`

Tips:

- 如果项目本身存在依赖管理系统的话，go module 会尝试读取已有的依赖，否则会自动拉取最新的依赖。
- 如果自动生成的依赖不符合项目构建的要求，可以自行修改，支持 tag, branch, commit id 等，修改完毕后 `go.mod` 文件会被自动更新
- 由于 Go Module 的[最小版本选择](https://xuanwo.io/2019/05/27/go-modules/)机制，强制指定一个旧版本可能无法生效，此时可以 `go mod why <module>` 来看谁依赖了这个模块
- `go mod tidy` 完毕后可能会出现一些项目的间接依赖，这是因为依赖库中存在还没有切换到 `Go Module` 的项目，go 工具链需要有一个地方存放这个间接依赖的版本，会使用 `//indirect` 注释出来

## 常见问题及其解决

### GO Module 的启用时机

符合下列任一一种情况时 Go Module 机制将会被启用

- `GO111MODULE` 被设置为 `on`
- 当前路径不在 `GOPATH` 下，且目录下或者上级目录中存在有效的 `go.mod` 文件，且 `GO111MODULE` 未空或 `auto`

### 环境变量设置不正确

`GO111MODULE` 设置不正确会导致 `go get` 或者 `go build` 没有使用 module 的形式来获取包，`GOPROXY` 设置不正确会导致网络请求没有走我们的 `GOPROXY`，从而出现一系列的超时现象。此外错误的配置了 `HTTP_PROXY` 等代理同样会导致 GOPROXY 连接失败，此类问题可以按照如下顺序排查：

`go get -v <module>`，此时会输出完整的请求的历史，比如

```
:) go get -v gopkg.in/yaml.v2
Fetching https://gopkg.in/yaml.v2?go-get=1
Parsing meta tags from https://gopkg.in/yaml.v2?go-get=1 (status code 200)
get "gopkg.in/yaml.v2": found meta tag get.metaImport{Prefix:"gopkg.in/yaml.v2", VCS:"git", RepoRoot:"https://gopkg.in/yaml.v2"} at https://gopkg.in/yaml.v2?go-get=1
```

如果访问的地址不是 `GOPROXY`，说明 `GO111MODULE` 和 `GOPROXY` 的配置有问题。

如果访问 `GOPROXY` 有问题，可以 curl 看一下：

```
:) curl https://goproxy.team.dev -v
* Uses proxy env variable no_proxy == 'localhost,127.0.0.1,localaddress,.localdomain.com'
* Uses proxy env variable https_proxy == 'http://127.0.0.1:1090'
*   Trying 127.0.0.1:1090...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 1090 (#0)
* allocate connect buffer!
* Establish HTTP proxy tunnel to goproxy.team.dev:443
> CONNECT goproxy.team.dev:443 HTTP/1.1
> Host: goproxy.team.dev:443
> User-Agent: curl/7.65.3
> Proxy-Connection: Keep-Alive
>
< HTTP/1.1 200 Connection established
<
* Proxy replied 200 to CONNECT request
* CONNECT phase completed!
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: none
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* CONNECT phase completed!
* CONNECT phase completed!
* OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to goproxy.team.dev:443
* Closing connection 0
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to goproxy.team.dev:443
```

比如这种情况说明代理访问失败了，我们可以把这个域名加进 `NO_PROXY`

```
export no_proxy=localhost,127.0.0.1,localaddress,.localdomain.com,team.dev
```

### Athens 500 Internal Server Error 报错

Athens 本质上还是会用 `go get` 来下载包，如果 `go get` 命令执行失败就会返回 500 错误，这个情况需要具体分析，我遇到的有以下这些情况：

```
go get gopkg.in/Shopify/sarama.v1: unexpected status (https://goproxy.team.dev/gopkg.in/Shopify/sarama.v1/@v/v1.23.1.info): 500 Internal Server Error
```

目标项目不存在：这种情况多见于项目本身改名，或者 import 路径发生了修改。比如说 [Shopify/sarama](https://github.com/Shopify/sarama) 的 import 路径由 `gopkg.in/Shopify/sarama.v1` 修改为了 `github.com/Shopify/sarama`，需要调整项目中的 import。

```
go: git.team.dev/global/common@v0.0.0: unexpected status (https://goproxy.team.dev/git.team.dev/global/common/@v/v0.0.0.info): 500 Internal Server Error
```

目标 Commit 不存在：这种一般是因为上游进行了 force-push，导致这个 commit 已经不存在了。还有种比较特殊的情况是依赖的项目中做了 replace，而本项目中没有，从而导致构建的时候访问到了错误的 tag。这种问题比较难排查，建议 `go mod why <module>` 查看一下依赖关系，然后确定依赖的模块中 version 没有写错。

### Replace 不会继承

go moudle 的 replace 和 exclude 都只针对当前构建生效，不会扩散到其他项目中。这导致如果有依赖写成了这样：

```
require github.com/ownauX/lol v0.0.0
replace github.com/ownauX/lol => github.com/Xuanwo/lol v1.0.1
```

那下游所有的项目都会需要进行 replace，因为直接进行构建会因为找不到 `github.com/ownauX/lol@v0.0.0` 而报错。

所以：

- replace 建议只作为临时的 workaround 使用，即使要用，原来的 version 也要写对，否则会影响其他项目构建
- 公司内部项目需要做批量做 replace 可以使用我的 [go-mod-redirect](https://github.com/Xuanwo/go-mod-redirect)

## 尚未解决的问题

### 无法直接安装二进制

在切换到 Go Module 之后，`go get` 都是 module-aware 的操作，像之前一样去 `go get github.com/tinylib/msgp` 来安装二进制会导致 msgp 进入 `go.mod`。

### 无法跟踪指定分支

开发中常见的一种情况是每次构建都需要这个依赖的某个分支最新 commit，go moudle 支持写 branch name。但是为了可重现构建，`go get` 每次都会将 branch 重写为对应的 commit id，这导致如果项目中如果有正在活跃开发且需要跟进最新提交的依赖会非常麻烦。目前的 workaround 是在 Makefile 中修改 build target，每次构建之前都执行一次 `go get -u <module>@develop` 来更新。
