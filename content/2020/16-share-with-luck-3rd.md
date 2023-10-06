---
categories: Daily
date: 2020-11-30T05:00:00Z
tags:
- Linux
- Rust
- Golang
series: "Share with luck"
title: 随缘分享第 3 期
---

上一期的随缘分享要追溯到去年一月了，其实一直有在看各种奇奇怪怪的项目，但是之前的随缘分享搞得有点太刻意以至于要正经危坐的去考虑行文和措辞。现在算是想开了，觉得有意思的就多说一点，没太大意思的就少说一点或者直接去掉，反正也没几个人看对不对（

## 文章

### [Manual Memory Management in Go using jemalloc](https://dgraph.io/blog/post/manual-memory-management-golang-jemalloc/)

用 golang 玩花活儿还是要看 dgraph： jemalloc on cgo for Golang！

给定一个这样的结构体：

```go
type node struct {
    val  int
    next *node
}

var nodeSz = int(unsafe.Sizeof(node{}))

func newNode(val int) *node {
    b := z.Calloc(nodeSz)
    n := (*node)(unsafe.Pointer(&b[0]))
    n.val = val
    return n
}

func freeNode(n *node) {
    buf := (*[z.MaxArrayLen]byte)(unsafe.Pointer(n))[:nodeSz:nodeSz]
    z.Free(buf)
}
```

分别用 golang 自己的内存分配和 jemalloc：

```shell
$ go run .
Allocated memory: 0 Objects: 2000001
node: 0
...
node: 2000000
After freeing. Allocated memory: 0
HeapAlloc: 31 MiB
```

vs

```shell
$ go run -tags=jemalloc .
Allocated memory: 30 MiB Objects: 2000001
node: 0
...
node: 2000000
After freeing. Allocated memory: 0
HeapAlloc: 399 KiB
```

看起来挺酷炫的，不过坑肯定不少，有这种极端场景的同学可以康康

### [cmd/go: add 'require test' section to go.mod](https://github.com/golang/go/issues/26913#issuecomment-411976222)

这个是我一直以来的误区：我总觉得 `go.mod` 里面出现的依赖就会进入二进制，为此我之前做过很多 trick，比如说把测试和各种代码生成工具放在一个独立的 mod 里面，只是为了让他们的依赖不要污染主项目的 `go.mod`。但是事实并非如此：`go.mod` 中依赖是整个 module 构建需要的全集，并不是所有出现的依赖都会进入最后的二进制。

这种情况其实颇为常见：

- 测试的依赖
- 不同系统环境的依赖
- 不同的 build tags

所以管理项目中用到的各种 golang 的构建工具最好的方式就是创建一个带有 `// +build tools` 的 `tools.go` 文件，这样它的依赖会被 pin 入 `go.mod` 但是并不会影响最后生成的二进制。

### [泛型和元编程的模型：Java, Go, Rust, Swift, D 等](https://mp.weixin.qq.com/s?__biz=MzAwMDU1MTE1OQ==&mid=2653553796&idx=1&sn=80853fcb556e0bd62b968af6ad5cb923)

一篇介绍泛型与元编程的文章，值得一读

### [狗狗可以吃柚子嗎](https://moesonson.com/%E5%AF%B5%E7%89%A9%E7%9F%A5%E8%AD%98/%E7%8B%97%E7%8B%97%E5%8F%AF%E4%BB%A5%E5%90%83%E6%9F%9A%E5%AD%90%E5%97%8E)

可以，不过吃多了真的会拉稀

## 服务

### [GoatCounter](https://www.goatcounter.com/)

Google Aalytics 的简易替代，主打简单与隐私保护

### [quiver](https://q.uiver.app/)

现代化的向量图形编辑器，界面简洁功能强大，还支持导出成 `LaTeX`，以后画一些高级的图可以考虑用它。

## 项目

### [Starship](https://starship.rs/)

`RIIR(Rewrite It In Rust)` 的大胜利： Shell Prompt in Rust。真的挺香，我已经上车了，还在计划给它实现一个 aur package 的支持（

```shell
tikv on  master [$] is 📦 v4.1.0-alpha via 🦀 v1.49.0-nightly
:) lsx
zsh: command not found: lsx
tikv on  master [$] is 📦 v4.1.0-alpha via 🦀 v1.49.0-nightly
:(
```

### [handlr](https://github.com/chmln/handlr)

`RIIR` 的又一次胜利：xdg-utils in Rust。不过我其实不怎么依赖这东西，所以只是看看。

### [dog](https://github.com/ogham/dog)

嗯，又是 `RIIR`：dig in Rust。Archlinux 发行版的 dig 是跟 bind 打包在一起的，所以大部分时候都在用 arch 的 `drill`，现在换成 dog 了，毕竟绝大多数时候我并不关心 dns query 的细节，只想知道结果：

```shell
:) dog xuanwo.io
A xuanwo.io. 59s   76.76.21.21
```

输出还有高亮呢，多好看（
