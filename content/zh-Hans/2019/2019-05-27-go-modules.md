---
categories: Code
date: 2019-05-27T01:00:00Z
tags:
- golang
series: "Engineering Efficiency"
title: Go Modules 内部分享
url: /2019/05/27/go-modules/
---

最近在日常工作之外，我开始负责 Team 内部的工程效率提升。瞄准的第一个目标便是推动 Go Modules 在 Team 内部的普及，一方面是想淘汰祖传的依赖管理脚本，减少浪费在处理依赖问题上的时间，另一方面是为了实现 CI/CD 和可重现构建。这安利是否成功，除了要看个人的奋斗，还要看历史的行程。为了使得大家相信迁移到 Modules 好处多多，我在周一的例会后进行了一次分享，本文就是分享后的整理而成的。

<!--more-->

---

大家好，今天要跟大家分享是 Go Module。我们首先回顾一下依赖管理及其想要解决的根本问题，然后介绍 Golang 依赖管理工具发展的历史，理解我们是如何走到了如今这个时点，然后再介绍 Go Module 是什么，以及它如何解决我们面对的问题，之后以一个实际的案例来展示 Go Module 如何使用，最后是 Q & A 环节。

## 依赖管理

首先大家想一下为什么需要依赖：我们想复用已有的工作成果。而将已有的工作成果加入到我们的项目中作为依赖存在着太多的不确定性：这个包的 API 会变化，这个包内部行为会变化，这个包的依赖会变化，这个包可能已经已经不存在或无法访问，包与包之间的不同依赖相互冲突等等。不仅如此，随着软件开发规模的逐步增大，涉及到的外部依赖越来越多，手动管理的所有依赖愈发不可能。所以我们需要依赖管理，我们需要有个工具或者规范来描述和定义包与包之间的依赖关系，并自动化的去处理、解析和满足这些依赖。

依赖管理试图解决的问题我认为（或者 Russ Cox 认为）主要有两个：其一是 API 稳定性，其二是可重现构建。API 稳定性自不用多说，我们都希望我们依赖的 API 是稳定的，不会因为我们更新了一个小版本就要大规模的重写我们的代码。可重现构建在我们依赖管理的领域内可以理解为相同的源码最后能得到同样的二进制或链接库（当然真正的想实现可重现构建还需要一系列配套的工具和特定的参数）。假设我们同事 A 和 B 协同开发，A 依赖了存在 BUG 的 uuid v1.2，而 B 依赖了最新的 uuid v1.3。他们都是使用了相同的代码去构建，但是最后测试的结果却不一致，这为他们进一步的排错增添了无数烦恼。特别是我们本身就在从事着底层存储系统的开发， 如果开发时和最后部署时的二进制不一致，极端情况下可能导致用户数据丢失等极其严重的后果。

## 回溯历史

依赖管理如此重要，Golang 社区及其开发者们都采取了哪些手段来解决这些问题呢？我们分别从 API 稳定性和可重现构建的角度来回溯一下历史，理解一下我们当下处于何种位置，这样才能知道我们要往何处去。

### API 稳定性

在 2011 年 Go 1 发布的时候就没有版本的概念，2013 年时 Golang 团队在 FAQ 中提议开发者需要保证相同的 import path 的兼容性，这个后来成了一纸空文，没有强制措施的倡议是没有人会听的。

到了 2014 年，`gopkg.in` 出现了。它本质上是一个 github 的重定向工具，将 `gopkg.in/yaml.v1` 重定向到 [`go-yaml/yaml`](https://github.com/go-yaml/yaml) 库的 v1 分支，将 `gopkg.in/yaml.v2` 重定向到 v2 分支。它使得同一个包可以有不同的 import path，在遵守 `相同的 import path 要向后兼容` 的前提下实现了一定程度的版本化控制，缓解了引入破坏性变更的问题。

在 2015 年的时候，有人提出了采用语义化版本的草案，但是并没有被 Golang 团队接受。

### 可重现构建

在 Go 1 刚发布的时候，Golang 使用 GOROOT 和 GOPATH 来决定包的位置。GOROOT 和 GOPATH 结构是相似的，只不过 GOROOT 用来指示 Go 的 Root Tree 位置，GOPATH 中则是用户自定义的 Tree。GOPATH 中可以指定多个目录，go get 默认总是会把依赖下载到第一个目录中。而在查找的时候，Go 总是会先查找 GOROOT，然后在按照顺序查找 GOPATH。如果没有自行设置的话，GOROOT 会取 `/usr/lib/go` 作为默认值，而 GOPATH 则会取 `$HOME/go`。

后来有人想到可以在运行前修改 GOPATH，使得 go get 和 go build 总是能够从一个指定目录中下载或者查找指定的包。很多人可能见过各种教你 ```export GOPATH="`pwd`:$GOPATH"``` 的奇技淫巧，顺着这种思路发展下去出现一些工具，他们能够自动的设置和修改 GOPATH，我们项目中用到的管理依赖的脚本就是这个思路。

到了 2014 年，有人提出了 external packages 的概念，在项目的目录下增加一个 vendor 目录来存放外部的包，同时让 go 的 tools 能够感知到这是一个 vendor。这个草案在 2015 年时被接受，并在 go 1.5 中作为 vendor 作为试验推出，在 go 1.6 中作为默认参数被启用。自此出现

到了 2016 年，一群开发者聚在一起进行了讨论，并成立一个社区组织合作开发出了 dep。dep 后来被 golang 官方接纳为 official experiment，并在很长的一段时间里被认为是有望终结 Golang 依赖管理工具混乱的统治者。

## Versioned Modules

就在所有人以为 dep 就将是那个最终的解决方案时，我们的 Russ Cox 同学有不同的想法：我们要引入 Module 的概念，我们要重新定义依赖管理。实际上从一开始 dep 就只是一个试验，用来帮助 Golang 团队积累经验和学习依赖管理，至少 Russ Cox 是这么认为的。这中间的种种故事和花边新闻大家可以去看看 [@hsiafan](https://www.zhihu.com/people/caoqianli_) 的文章 [关于Go Module的争吵](https://zhuanlan.zhihu.com/p/41627929)，此处我就不多谈了。

### 模块

先来看模块。

模块是**相关连的包**作为**一个单元**被一起**版本化**后的组合。

每个模块都有着确定的依赖要求，并且能够创建可复现的构建。一个仓库里可以有多个模块，一个模块里面可以有多个包。

### 导入兼容性规则

我们可以重新阐述一下 FAQ 里面的那个兼容性规则（The Import Compatibility Rule）：

**如果旧包和新包具有相同的导入路径，则新包必须向后兼容旧包。**

换言之，如果他们的导入路径不同，他们就无需保持兼容。

### 语义导入版本控制

这就为我们带来了语义导入版本控制（Semantic Import Versioning）。

首先所有的模块都必须遵循语义化版本规则：

![](impver.png)

其次，当主版本号大于等于 `v2` 时，这个 Module 的 import path 必须在尾部加上 `/vN`。

- 在 go.mod 文件中： `module github.com/my/mod/v2`
- 在 require 的时候： `require github.com/my/mod/v2 v2.0.0`
- 在 import 的时候： `import "github.com/my/mod/v2/mypkg"`

最后，当主版本号为 `v0` 或者 `v1` 时，尾部的 `/v0` 或 `/v1` 可以省略。

根据语义化版本的要求，`v0` 是不需要保证兼容性的，可以随意的引入破坏性变更，所以不需要显式的写出来；而省略 `v1` 更大程度上是现实的考虑，毕竟 99% 的包都不会有 `v2`，同时考虑到现有代码库的兼容，省略 `v1` 是一个合情合理的决策。

### 最小版本选择

现在我们已经可以定义出一个模块了，但是一个模块具体构建的时候到底选择是哪个版本呢？这就涉及到 Go Module 使用的最小版本选择（Minimal Version Selection）算法。

它的工作方式是这样的：我们为每个模块指定的依赖都是可用于构建的最低版本，最后实际选择的版本是所有出现过的最低版本中的最大值。

我们现在有这样的一个依赖关系，A 会依赖 B，C，而 B，C 会去依赖 D，D 又会依赖 E。

![](version-select-1.png)

那么我们从 A 开始做一个 BFS *（仅用于讲解原理，背后实现不一定是这样）* ，把每个模块依赖的版本都找出来，这样我们会首先得到一个粗略的清单。然后相同的模块我们总是取最大的版本，这样就能得到最终的依赖列表。

![](version-select-list.png)

为什么可以这样呢？

- `导入兼容性规则` 规定了相同的导入路径，新包必须向后兼容旧包，因此只要 D 还是 v1 版本，不管是选择 v1.3 还是 v1.4 都是可以的，不会有破坏性的变更。
- `语义导入版本控制` 规定了不同的大版本需要使用不同的导入路径，因此假设 D 升级到了 v2 版本，那就应当选择 `D v1.4` 和 `D v2.0` 这两个包了。

为什么要这样做呢？

为了可重现构建，为了降低复杂度。

大多数包管理工具，包括 `dep`，`cargo` 和 `pip` 等，采用的都是总是选择允许的最新版本（`use the newest allowed version`）策略。这会带来两个问题：第一，`允许的最新版本`可能会随着外部事件而发生变化，比如说在构建的时候，依赖的一个库刚好发布了一个新版本，这会导致可重现构建失效；第二，开发者为了避免依赖在构建期间发生变化，他必须显式的告诉依赖管理工具我不要哪些版本，比如：`>= 0.3, <= 0.4`。这会导致依赖管理工具花费大量的时间去计算可用的版本，而最终的结果总是让人感到沮丧，A 依赖需要 `Z >= 0.5` 而 B 依赖需要 `Z <= 0.4`，关于这一点 Russ Cox 在 [Version SAT](https://research.swtch.com/version-sat) 给出了更加规范的论述，感兴趣的同学不妨一观。

与总是选择允许的最新版本相反，Go Module 默认采用的是总是使用允许的最旧的版本。我们在 `go.mod` 中描述的 `vX.Y.Z` 实际上是在告诉编译器：“Hey，我最少需要 `vX.Y.Z` 才能被 Build 出来”，编译器听完了所有模块的话之后按照刚才描述的流程就能选择出允许的最旧的那个版本。

### go.mod

讲了那么多理论之后，我们下面来聊一些比较实际的东西：`go.mod` 应该要怎么写。在目前的版本当中，`go.mod` 文件中主要有四个部分组成：

`module`

用来声明当前 `module`，如果当前版本大于 v1 的话，还需要在尾部显式的声明 `/vN`。

```
module /path/to/your/mod/v2

module github.com/Xuanwo/go-mod-intro/v2
```

`require`

这是最为常用的部分，在 mod 之后可以写任意有效的、能指向一个引用的字符串，比如 Tag，Branch，Commit 或者是使用 `latest` 来表示引用最新的 commit。如果对应的引用刚好是一个 Tag 的话，这个字符串会被重写为对应的 tag；如果不是的话，这个字符串会被规范化为形如 `v2.0.0-20180128182452-d3ae77c26ac8` 这样的字符串。我们后面会发现这个字符串与底层的 mod 存储形式是相对应的。

```
require /your/mod tag/branch/commit

require github.com/google/go-github/v24 v24.0.1
require gopkg.in/urfave/cli.v2 v2.0.0-20180128182452-d3ae77c26ac8
```

`replace`

`replace` 这边的花样比较多，主要是两种，一个是与 `require` 类似，可以指向另外一个 repo，另一种是可以指向本地的一个目录。加了 `replace` 的话，go 在编译的时候就会使用对应的项目代码来替换。需要注意的是这个只作用于当前模块的构建，其他模块的 replace 对它不生效，同理，它的 replace 对其他模块也不会生效。

需要额外注意的是，如果引用一个本地路径的话，那这个目录下必须要有 `go.mod` 文件，这个目录可以是绝对路径，也可以是相对路径。

```
replace original_name => real_name tag/branch/commit
replace original_name => local_path


replace test.dev/common => git.example.com/bravo/common.git v0.0.0-20190520075948-958a278528f8
replace test.dev/common => ../../another-porject/common-go
replace github.com/qiniu/x => github.com/Xuanwo/qiniu_x v0.0.0-20190416044656-4dd63e731f37
```

`exclude`

这个用的比较少，主要是为了能在构建的时候排除掉特定的版本，跟 `replace` 一样，只能作用于当前模块的构建。

```
exclude /your/mod tag/branch/commit
```

## 实战演练

好，说了那么多，下面我们实际的上手操作一下。

在 `/tmp` 下创建一个目录 `go-mod-intro`，然后输入 

```bash
go mod init github.com/Xuanwo/go-mod-intro
```

此时会有输出：

```bash
go: creating new go.mod: module github.com/Xuanwo/go-mod-intro
```

同时目录下会有一个自动创建的新文件：`go.mod`

```go
module github.com/Xuanwo/go-mod-intro

go 1.12
```

这样我们就拥有了一个最小化的模块，尽管它什么用都没有。下面我们来写一些代码，创建一个 `main.go` 并写入如下内容：

```go
package main

import (
	v24 "github.com/google/go-github/v24/github"
	v25 "github.com/google/go-github/v25/github"
)

var (
	_ = v24.Tag{}
	_ = v25.Tag{}
)

func main() {
	return
}
```

在当前目录下执行 `go build`，看看 go 是如何查找依赖的：

```bash
:) go build
go: finding github.com/google/go-github/v25/github latest
go: finding github.com/google/go-github/v24/github latest
go: finding github.com/google/go-github/v25 v25.0.4
go: finding github.com/google/go-github/v24 v24.0.1
go: downloading github.com/google/go-github/v25 v25.0.4
go: downloading github.com/google/go-github/v24 v24.0.1
go: extracting github.com/google/go-github/v25 v25.0.4
go: extracting github.com/google/go-github/v24 v24.0.1
go: finding github.com/google/go-github v17.0.0+incompatible
go: finding github.com/google/go-querystring v1.0.0
go: finding github.com/golang/protobuf v1.2.0
go: finding golang.org/x/crypto v0.0.0-20180820150726-614d502a4dac
go: finding golang.org/x/sys v0.0.0-20180824143301-4910a1d54f87
go: finding golang.org/x/oauth2 v0.0.0-20180821212333-d2e6202438be
go: finding golang.org/x/net v0.0.0-20180826012351-8a410e7b638d
go: finding golang.org/x/net v0.0.0-20190311183353-d8887717615a
go: finding golang.org/x/sync v0.0.0-20190227155943-e225da77a7e6
go: finding google.golang.org/appengine v1.1.0
go: finding golang.org/x/crypto v0.0.0-20190308221718-c2843e01d9a2
go: finding golang.org/x/sys v0.0.0-20190215142949-d0b11bdaac8a
go: finding golang.org/x/text v0.3.0
go: downloading github.com/google/go-github v17.0.0+incompatible
go: extracting github.com/google/go-github v17.0.0+incompatible
go: downloading github.com/google/go-querystring v1.0.0
go: extracting github.com/google/go-querystring v1.0.0
```

此时，我们的 `go.mod` 文件会被自动的重写以反应现在项目的依赖要求，`go.sum` 文件也会被自动的创建：

```go
module github.com/Xuanwo/go-mod-intro

go 1.12

require (
        github.com/google/go-github/v24 v24.0.1
        github.com/google/go-github/v25 v25.0.4
)
```

大家不难发现，我们可以在同一个文件中引用同一个模块的不同大版本。正如我们前面所说的，它们的导入路径不同，所以被看作两个不同的模块来看待，不同的模块当然可以并存。这一点可以为我们之后的版本迁移带来很多便利，Go Team 也在尝试在 go fix 中利用这个特性来帮助库开发者实现迁移。

下面我们稍微修改一下代码，引入 `golang.org/x/text`，并尝试修改它的版本：

```go
package main

import (
	v24 "github.com/google/go-github/v24/github"
	v25 "github.com/google/go-github/v25/github"
	"golang.org/x/text/width"
)

var (
	_ = v24.Tag{}
	_ = v25.Tag{}
	_ = width.EastAsianAmbiguous
)

func main() {
	return
}
```

直接构建的话，我们的 go.mod 中会增加一行：

```go
golang.org/x/text v0.3.0
```

使用 `go list -m all` 可以查看当前模块所有的依赖：

```bash
github.com/Xuanwo/go-mod-intro
github.com/golang/protobuf v1.2.0
github.com/google/go-github v17.0.0+incompatible
github.com/google/go-github/v24 v24.0.1
github.com/google/go-github/v25 v25.0.4
github.com/google/go-querystring v1.0.0
golang.org/x/crypto v0.0.0-20190308221718-c2843e01d9a2
golang.org/x/net v0.0.0-20190311183353-d8887717615a
golang.org/x/oauth2 v0.0.0-20180821212333-d2e6202438be
golang.org/x/sync v0.0.0-20190227155943-e225da77a7e6
golang.org/x/sys v0.0.0-20190215142949-d0b11bdaac8a
golang.org/x/text v0.3.0
google.golang.org/appengine v1.1.0
```

下面我们把 `golang.org/x/text` 依赖的 `v0.3.0` 修改成 `v0.2.0`，然后重新执行 `go list -m all` 看最后选择的版本：

```bash
:) go list -m all
go: finding golang.org/x/text v0.2.0
github.com/Xuanwo/go-mod-intro
...
golang.org/x/text v0.3.0
```

能发现 go 在查找了 `golang.org/x/text v0.2.0` 之后实际选择的还是 `v0.3.0`，我们可以用 `go mod graph | rg text` 来看看谁在依赖这个模块：

```bash
:) go mod graph | rg text
github.com/Xuanwo/go-mod-intro golang.org/x/text@v0.3.0
golang.org/x/net@v0.0.0-20190311183353-d8887717615a golang.org/x/text@v0.3.0
```

因为 `golang.org/x/net` 在依赖 `golang.org/x/text@v0.3.0`，所以即使我们在 `go.mod` 中强行指定了 `v0.2.0`，最后还是会选择 `v0.3.0` 来进行构建，不仅如此，我们的 `go.mod` 文件中依赖也被修改成了 `v0.3.0`，因为这才是我们依赖的最终状态。

下面我们来试一下如果指定成 `v0.3.2` 会如何：

```bash
:) go list -m all
go: finding golang.org/x/text v0.3.2
github.com/Xuanwo/go-mod-intro
...
golang.org/x/text v0.3.2
```

显然的，`v0.3.2 > v0.3.0`，所以最后选择了 `v0.3.2`。

## 注意

好，在简单的实战演练之后，我们回顾一下需要额外注意的要点：

- replace 和 exclude 只作用于当前模块的构建，它们既不会向上继承，也不会向下传递。
- go 官方的所有工具都有可能在符合语义的前提下自行重写 go mod & sum 文件，比如补充缺失的依赖，重写 commit 为标准的形式等等
- 所有的升级操作都需要人工确认并执行，go 官方的工具不会自动升级
- 模块的依赖是平行的，而不是嵌套的，想象一下 BFS 把所有模块的依赖都扫出来放在一个列表里面
- 跟 vendor 说再见，尽管 go module 对 vendor 提供了支持
- `go.mod` 中只会添加直接的依赖，间接的依赖都是隐含的，下列几种特殊情况会在后面加上 `// indirect` 标记出来
  - 手动指定了更高的依赖版本，比如在不引用 `golang.org/x/text` 的前提下通过 `go get golang.org/x/text@v0.3.2
` 升级依赖
  - 依赖的库还没有切换到 Go Module，这时候 go 工具链是不知道内部的依赖关系的，所以所有的依赖都会直接添加到当前模块中

## 技巧

下面我介绍一些常用的技巧：

| 命令 | 作用 |
| ---- | ---- |
| `go list -m all` | 列出当前模块依赖的所有模块 |
| `go list -u -m all` | 列出当前模块依赖中可升级的模块 |
| `go get -u` | 升级所有依赖至最新版本 |
| `go get -u=patch` | 升级所有依赖至最新的修订版本 |
| `go mod tidy` | 清理未使用/生效的依赖 |

## Q & A

> module 的命名有什么最佳实践么？比如我有一个模块确定只会导入其他包，那它能不能叫 core 这样的名字？

一般来说我们会用一个域名来表示该组织下面的所有模块，比如我们的可以叫做 `qingstor.dev`。然后整个组织共享的 common 模块可以叫做 `qingstor.dev/common`，项目相关的模块则可以进一步的分层，比如我们的对象存储可以叫做 `qingstor.dev/qs/xxx`。为了做到这一点，我们前期可以使用 `replace` 来过渡，后续可以自建 GOPROXY，让它来完成重定向的工作。

> 如果依赖包有了新的小版本会不会自动升级？

不会。

> vendor 还能不能用？

go mod 可以开启 vendor 模式，但是从长期来看 vendor 会被去除。

> 现有的库如果已经大于等于 v2 了该怎么处理？比如 etcd 已经 v3 了。

如果这个库已经切换到 Go Module 的话，需要在导入时加 `/v3`；如果还没有的话，go mod 会以兼容模式来导入它，此时虽然它的 tag 是 v3.x，但是我们还是把它们当作 v1 的模块来导入，即不需要显示在路径中写 v3。

> 能够引用一个具体的 Commit？

可以，go 工具链会自动的将这个 commit 重写为标准的形式。

> 下载下来的 mod 中是否还有 git 信息？

没有。

> 下载下来的 mod 是如何存储的？如何区分不同 commit 的 mod？

```
:) ~/Code/go/pkg/mod/github.com/google
:) tree -L 2
.
├── go-github
│   ├── v24@v24.0.1
│   ├── v24@v24.0.2-0.20190418103935-a6b4602a9129
│   └── v25@v25.0.4
├── go-github@v13.0.0+incompatible
├── go-github@v17.0.0+incompatible
└── go-querystring@v1.0.0
```

存储方式和 `go.mod` 中规范化后的 tag/commit 是一致的。

> 下载下来的 mod 如何清理？这只会清理当前项目用到的 mod 吗？

可以使用 `go clean -modcache`，这会删除所有的 mod，相当于 `$GOPATH/pkg/mod` 被删除。

> `go.sum` 是干嘛用的？相当于其他语言里面的 lock 文件？

`go.sum` 不是 lock 文件。

在其他语言里面 lock 文件用来保证可重现构建，但是在 Go Module 中，只需要有 `go.mod` 文件就已经足够支持可重现构建了。`go.sum` 文件主要记录了所有在构建过程中访问到的模块的 checksums，用于保证我们的代码在传输过程中没有被纂改。

## 分享资源

- [Go Modules](https://docs.google.com/presentation/d/1-q658rf048NrM_ecn_jWcIo87sWcXvgiID3zlih6i94/edit?usp=sharing)
- [演示 Repo: go-mod-intro](https://github.com/Xuanwo/go-mod-intro)

## 总结

本文主要的内容都来自于 Russ Cox 关于 `Go & Versioning` 的博文集，图也都是他画的，对细节感兴趣的同学可以去读一读。此外本次分享的主要目的是为了介绍 Go Module，无意于参与哪个工具更好以及什么语言的包管理工具更好的讨论，有更好的想法建议赶着 Go 2 这波车提一个新的草案。

以上就是本次分享的全部内容，大家如果对 Go Module 还有什么问题的话可以在评论区提出来，我尽量解答~

## 参考资料

- [Proposal: Versioned Go Modules](https://go.googlesource.com/proposal/+/master/design/24301-versioned-go.md)
- [Go & Versioning](https://research.swtch.com/vgo)
- [Modules - Go Wiki](https://github.com/golang/go/wiki/Modules)
- [cmd/go: add package version support to Go toolchain](https://github.com/golang/go/issues/24301)
