---
categories: Code
date: 2020-10-31T01:00:00Z
title: "记 go build -o 的坑"
tags:
- golang
---

最近在把开源项目的 CI 统一迁移到 Github Action，单元测试使用 Github Hosted Runner，而集成测试则会在我们团队内部的 Self Hosted Runner 上运行。但是在迁移过程中发现项目无法在 Windows 上正常构建，被坑了小半个下午才发现是 `go build -o` 与 Windows 行为之间的冲突。

## 上下文概述

[go-storage](https://github.com/aos-dev/go-storage) 是一个面向 Golang 的抽象存储层，其中用到了大量数据驱动，模板生成的手段，比如由

```hcl
info "object" "meta" "content-type" {
  type = "string"
}
```

自动生成出下列代码

```go
func (o *Object) GetContentType() (string, bool) {
	o.stat()

	if o.bit&objectIndexContentType != 0 {
		return o.contentType, true
	}
	return "", false
}

func (o *Object) MustGetContentType() string {
	o.stat()

	if o.bit&objectIndexContentType == 0 {
		panic(fmt.Sprintf("object content-type is not set"))
	}
	return o.contentType
}

func (o *Object) SetContentType(v string) *Object {
	o.contentType = v
	o.bit |= objectIndexContentType
	return o
}
```

为此，在构建项目的过程中，首先需要生成出名为 `definitions` 的二进制，并由该二进制生成对应的代码。

## 问题

上述流程在 Linux / MacOS 平台上没有遇到什么问题，对应的 `Makefile` 如下：

```makefile
build_definitions:
	@echo "build storage generator"
	@pushd cmd/definitions \
		&& go generate ./... \
		&& go build -o ../../bin/definitions . \
		&& popd
	@echo "build iterator generator"
	@pushd internal/cmd && go build -o ../bin/iterator ./iterator && popd
	@echo "Done"
```

但是在 windows 的平台上会出现这样的报错：

<https://github.com/aos-dev/go-storage/runs/1331041262?check_suite_focus=true>

```
build storage generator
/d/a/go-storage/go-storage/cmd/definitions /d/a/go-storage/go-storage
go: downloading github.com/hashicorp/hcl/v2 v2.4.0
go: downloading github.com/Xuanwo/templateutils v0.0.0-20200527044304-305a6a6fbfe6
go: downloading github.com/mitchellh/go-wordwrap v0.0.0-20150314170334-ad45545899c7
go: downloading github.com/agext/levenshtein v1.2.1
go: downloading github.com/zclconf/go-cty v1.2.0
go: downloading github.com/apparentlymart/go-textseg v1.0.0
go: downloading github.com/google/go-cmp v0.3.1
go: downloading github.com/apparentlymart/go-textseg/v12 v12.0.0
go: downloading golang.org/x/text v0.3.2
go: downloading github.com/kevinburke/go-bindata v3.21.0+incompatible
/d/a/go-storage/go-storage
build iterator generator
/d/a/go-storage/go-storage/internal/cmd /d/a/go-storage/go-storage
/d/a/go-storage/go-storage
definitions
Done
generate code
doc.go:42: running "bin/definitions": exec: "D:\\a\\go-storage\\go-storage\\bin\\definitions": file does not exist
go: downloading github.com/golang/mock v1.4.3
go: downloading golang.org/x/tools v0.0.0-20190425150028-36563e24a262
mingw32-make: *** [Makefile:46: generate] Error 1
```

文件确定是存在的，但是执行的时候却提示 `file does not exist`。

## 排查

一开始想到了 [Alpine](https://alpinelinux.org/) 上出现过来的类似问题，缺失动态链接库导致可执行文件找不到，于是给 go build 加上了 `CGO_ENBALED=0`：

```
:) ldd bin/definitions
        not a dynamic executable
```

但是依旧不行。

搜索类似报错的时候找到了这个：[How To Build Go Executables for Multiple Platforms on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04)


> Note: You can use the -o flag to rename the executable or place it in a different location. However, when building an executable for Windows and providing a different name, be sure to explicitly specify the .exe suffix when setting the executable’s name.

难道 windows 上的二进制一定要有对应的后缀才能识别吗？

尝试之后发下果然如此，将二进制重命名为 `definitions.exe` 即可。

## 解决

OK，问题的原因已经找到了，接下来只要想办法根据平台的不同生成不同的二进制名即可。刚才找到的文章是写了一个这样的脚本：

```bash
for platform in "${platforms[@]}"
do
    platform_split=(${platform//\// })
    GOOS=${platform_split[0]}
    GOARCH=${platform_split[1]}

    output_name=$package_name'-'$GOOS'-'$GOARCH

    if [ $GOOS = "windows" ]; then
        output_name+='.exe'
    fi
done
```

感觉有点麻烦，毕竟 `definitions` 只是项目构建的中间产物，并不像维护一堆构建脚本，而且这个构建脚本本身还要支持多个平台。为此我仔细研究了一下 `go build -o` 选项的行为：

```
The '.exe' suffix is added when writing a Windows executable.

When compiling multiple packages or a single non-main package,
build compiles the packages but discards the resulting object,
serving only as a check that the packages can be built.

The -o flag forces build to write the resulting executable or object
to the named output file or directory, instead of the default behavior described
in the last two paragraphs. If the named output is a directory that exists,
then any resulting executables will be written to that directory.
```

在构建的时候，golang 会自动为在 windows 平台上的可执行文件加上 `.exe` 后缀，但是如果指定了 `-o` 就不一样了：

- 如果给定的路径是一个文件，golang 会创建不存在的文件夹并直接写入，并不会增加后缀
- 如果给定的路径是一个目录
  - 如果路径不存在，golang 在创建完文件夹之后并不会会回到路径存在的逻辑，而是会直接写这个路径，并返回一个 `dir exists` 错误
  - 如果路径存在，golang 会在该目录下创建文件并附加后缀

所以最好的选择是在外面手动创建文件夹，并 -o 指定该文件夹，这样就能实现最轻松的跨平台构建：

```makefile
build_definitions:
	@echo "build storage generator"
	@pushd cmd/definitions \
		&& go generate ./... \
		&& mkdir -p ../../bin/ \
		&& CGO_ENABLED=0 go build -o ../../bin/ . \
		&& popd
	@echo "build iterator generator"
	@pushd internal/cmd && mkdir -p ../bin/ && go build -o ../bin/ ./iterator && popd
	@echo "Done"
```

## 总结

golang 跨平台构建时不要 `go build -o` 直接指定文件，提前创建目录并指定为目录。

## 动态

- LGD 果然被淘汰了，JDG 被 SN 轻松带走，TOP 也输给了 SN，难道今年 SN 要捧杯吗？
- 博客的构建迁移到了 vercel.com，感觉真香
- [go-storage](https://github.com/aos-dev/go-storage) 的 2.0 快要发布了（
