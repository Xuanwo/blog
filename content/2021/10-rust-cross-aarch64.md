---
categories: Code
date: 2021-12-13T01:00:00Z
title: "修复 Databend aarch64 架构的支持"
series: "Learn From Bug"
tags:
- Rust
---

[cross](https://github.com/rust-embedded/cross) 是由 [Rust Tools Team](https://github.com/rust-embedded/wg#the-tools-team) 维护的交叉编译工具，主要的卖点是 `zero setup cross compilation`。使用起来也特别简单，`cross` 内部直接调用了 `cargo`，所以我们可以直接使用那些在 `cargo` 上能用的参数：

比如说构建

```shell
cross build --target aarch64-unknown-linux-gnu
```

或者测试：

```shell
cross test --target mips64-unknown-linux-gnuabi64
```

但是我们都知道，复杂度只能被转移而不能被消灭。Databend 项目最近就遇到了 cross 在构建 `aarch64-unknown-linux-gnu` target 时找不到依赖库的问题。

## TL;DR

相信发行版的维护者，正确安装 arm64 的依赖：

```dockerfile
FROM rustembedded/cross:aarch64-unknown-linux-gnu

RUN dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install --assume-yes libssl-dev libssl-dev:arm64 zlib1g-dev zlib1g-dev:arm64
```

然后配置 `Cross.toml` 使得 `cross` 使用我们自己构建的镜像运行即可：

```toml
[target.aarch64-unknown-linux-gnu]
image = "<your-org>/build-tool:aarch64-unknown-linux-gnu"
```

## 现象

使用 `cross v0.2.1` 构建 `aarch64-unknown-linux-gnu` 会如下报错（此时使用的是旧版的 `0.1.16` 对应的镜像）：

```shell
  = note: /usr/bin/ld: cannot find -lz

error: build failed
```

在升级 cross 使用的 image 之后，则会出现 OpenSSL 相关的报错：

```shell
  running: "aarch64-linux-gnu-gcc" "-O0" "-ffunction-sections" "-fdata-sections" "-fPIC" "-g" "-fno-omit-frame-pointer" "-I" "/usr/include" "-Wall" "-Wextra" "-E" "build/expando.c"
  cargo:warning=build/expando.c:2:33: fatal error: openssl/opensslconf.h: No such file or directory
  cargo:warning=compilation terminated.
  exit status: 1

  --- stderr
  thread 'main' panicked at '
  Header expansion error:
  Error { kind: ToolExecError, message: "Command \"aarch64-linux-gnu-gcc\" \"-O0\" \"-ffunction-sections\" \"-fdata-sections\" \"-fPIC\" \"-g\" \"-fno-omit-frame-pointer\" \"-I\" \"/usr/include\" \"-Wall\" \"-Wextra\" \"-E\" \"build/expando.c\" with args \"aarch64-linux-gnu-gcc\" did not execute successfully (status code exit status: 1)." }

  Failed to find OpenSSL development headers.

  You can try fixing this setting the `OPENSSL_DIR` environment variable
  pointing to your OpenSSL installation or installing OpenSSL headers package
  specific to your distribution:

      # On Ubuntu
      sudo apt-get install libssl-dev
      # On Arch Linux
      sudo pacman -S openssl
      # On Fedora
      sudo dnf install openssl-devel

  See rust-openssl README for more information:

      https://github.com/sfackler/rust-openssl#linux
  ', /cargo/registry/src/github.com-1ecc6299db9ec823/openssl-sys-0.9.71/build/main.rs:162:13
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
error: build failed
```

## 原因

出现这种诡异情况的原因是 cross 本身的逻辑跟其使用的 image 是高度耦合的，而 databend 的 workflow 中使用 `cargo install --version 0.1.16 cross` 将版本锁定在了最后一个可用的旧版本上，在升级 cross 之后就 break 了。一个简单的方案是将 `cross` rollback 回去，但是这并没有解决根本问题：我们需要搞清楚 `cross` 升级之后破坏了什么，然后想出一个彻底的解决方案。

通过搜索不难知道 PR [Remove OpenSSL #332](https://github.com/rust-embedded/cross/pull/322) 去除了 cross 对 OpenSSL 的支持，主要的讨论发生在 Issue [Remove OpenSSL #229](https://github.com/rust-embedded/cross/issues/229) ：维护者认为对 cross 来说，OpenSSL 的支持已经超出了这个工具目标，而提供这项支持消耗了社区大量的精力来维护 OpenSSL 相关的脚本，但还是引起了非常多的问题。根据 PR 中删除的内容我们会发现 cross 确实被迫做了很多工作：他们被迫维护了自己编译 openssl 的脚本，为每个不同的架构修改 `OPENSSL_DIR` 等环境变量。在删除 OpenSSL 之后，`cross` 的维护变得容易了很多。

但是我们确实需要 OpenSSL，在不修改项目依赖的前提下，社区被迫使用将 PR #322 中删除的内容自行添加回来的[方案](https://github.com/rust-embedded/cross/issues/229#issuecomment-748500115)：

```shell
FROM rustembedded/cross:aarch64-unknown-linux-musl-0.2.1

COPY openssl.sh /
RUN bash /openssl.sh linux-aarch64 aarch64-linux-musl-

ENV OPENSSL_DIR=/openssl \
    OPENSSL_INCLUDE_DIR=/openssl/include \
    OPENSSL_LIB_DIR=/openssl/lib \
```

看起来越来越奇怪了：在各个发行版交叉编译已经非常成熟的现在，我们还需要自己编译 OpenSSL 吗？

当然不需要。**我们找不到这些库，是因为我们根本就没有安装他们。**

根据 Ubuntu 的文档 [MultiarchSpec](https://wiki.ubuntu.com/MultiarchSpec)，如果要安装 arm64 版本的依赖库，我们需要这样做：

```shell
dpkg --add-architecture arm64
apt-get install --assume-yes libssl-dev:arm64
```

查看一下这个包中的文件列表：

```shell
/usr/include/aarch64-linux-gnu/openssl/opensslconf.h
...
/usr/lib/aarch64-linux-gnu/libcrypto.a
/usr/lib/aarch64-linux-gnu/libcrypto.so
/usr/lib/aarch64-linux-gnu/libssl.a
/usr/lib/aarch64-linux-gnu/libssl.so
/usr/lib/aarch64-linux-gnu/pkgconfig/libcrypto.pc
/usr/lib/aarch64-linux-gnu/pkgconfig/libssl.pc
/usr/lib/aarch64-linux-gnu/pkgconfig/openssl.pc
```

我们会发现 Ubuntu 的维护者们已经帮我们把这些工作都做好了，不需要自行编译 OpenSSL，不需要修改 PKG_CONFIG_PATH，也不需要自己修改 OPENSSL_DIR。安装好自己需要的包，it just works!

## 解决方案

在找到根本原因之后，我们的解决方案就非常简单了：[build: Install arm64 version of libssl and zlib1g](https://github.com/datafuselabs/databend/pull/3371)

```shell
FROM rustembedded/cross:aarch64-unknown-linux-gnu

RUN dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install --assume-yes libssl-dev libssl-dev:arm64 zlib1g-dev zlib1g-dev:arm64
```

相信上游的维护者，安装好自己需要的包即可。

## 尾声

最后我将这个解决方案反馈给了上游，并且跟他们讨论将 OpenSSL 支持添加回来的方案，希望可以解决 `cross` 的用户遇到的类似问题。

## 总结

这个问题启发了我几个思考：

### 信息鸿沟

Ubuntu 维护者一秒钟能解决的问题，一群资深的 Rust 开发者在五年内陆陆续续的持续修复都没有解决。

### 路径依赖

cross 在 [initial commit](https://github.com/rust-embedded/cross/commit/531a8b8880178df2480a240ed4261263f78c51c0#diff-bd1444e0dbf7d749cf00218ea064d1a3d15920656f548330d390afb3958cb33a) 中引入了 `openssl.sh` 作为 OpenSSL 支持的解决方案，从那之后所有的开发者都在这个路径上修修补补，没有彻底地解决这个问题。

> 不太清楚当初 `cross` 项目为什么坚持使用自行编译 openssl 的方案，了解详情的话欢迎在评论指出来～

### 上游维护者

感谢 Ubuntu 的维护者。
