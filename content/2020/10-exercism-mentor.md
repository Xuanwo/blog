---
categories: Daily
date: 2020-08-22T01:00:00Z
title: "成为 exercism.io Mentor 的第一天"
tags:
- golang
---

<https://exercism.io> 是一个开源非营利性的编程学习平台，今天偶然遇见的之后非常赞同他们的运营模式和理念，于是注册成为了 Golang 的 Mentor。本文是我的一些观察和实际体验。

## 学生视角

每个练习都是一个完整的项目，项目内有提前准备好的单元测试和性能测试，用户要用 `exercism` 命令行来下载：

```bash
exercism download --exercise=hello-world --track=go
```

在完成练习之后同样通过命令行来提交：

```bash
exercism submit /path/to/file
```

以写一个 `Hello, World!` 为例，学生不仅仅要学会简单的语法，还需要知道如何格式化代码，如何验证自己的代码对不对：

```go
go test -v --bench . --benchmem
```

这就跳出了学习语法的局限：在这个平台能学到的不仅仅特定的语法，还有跟这个语言相关的生态：项目怎么构建，项目怎么测试，这才是学习语言。

更酷的地方在于，学生可以提交未完成或者错误的答案，使得导师能够介入进来给出 review，告诉学生哪里错了，哪里可以做的更好，这些东西是很难通过自主学习得到的。

## 导师视角

导师要做的事情不仅仅是检查学生做的对不对，还要告诉学生怎么样更好，以 [two-fer](https://exercism.io/mentor/exercise_notes?exercise_id=two-fer&track_id=go) 为例。

答案是非常简单的：

```go
// Package twofer distributes resources.
package twofer

import "fmt"

// ShareWith explains how a resource will be shared.
// If nobody is mentioned by name, then the other half
// goes to 'you'.
func ShareWith(name string) string {
	if name == "" {
		name = "you"
	}
	return fmt.Sprintf("One for %s, one for me.", name)
}
```

但是后面能够给出的建议非常多：

- 有没有重复的代码？学生有没有进行多余的变量声明？
- 学生用了 slice 或者 `strings.Join` 了吗？学生用 `+` 来创建 string 了吗？学生在 `fmt.Sprintf` 里面用了 `%v` 还是用了 `%s`？
- 学生用的函数参数名字可读性好吗？`n` 的话会意义不明，`inputName` 会显得有些累赘。
- 学生的代码 format 过吗？建议学生首先使用 `gofmt` 来格式化代码。
- 学生有给 ShareWith 写注释吗？
- ...

为了减少导师的负担，网站还会对常见的 pattern 做检测，比如对提交的代码进行 `go fmt` 并在有变动的时候生成出对应的推荐。有个学生写出了这样的代码：

```go
// ShareWith should have a comment documenting it.
func ShareWith(name string) string {
	if (name == "") {
		name = "you"
	}
	return "One for " + name +", one for me."
}
```

平台的 `Automatic Analysis` 给出了这样的推荐回复：

```markdown
    Run `gofmt` on the solution, which helps formatting code in Go.

    Code formatting in Go is very important to the community.
    Most IDEs can be set up to auto-format the code on every save. For example:

    - Visual Studio Code has [great Go support](https://code.visualstudio.com/docs/languages/go)
    - Vim also has a [fantastic Go extension](https://github.com/fatih/vim-go)
    - [Jetbrains Goland](https://www.jetbrains.com/go/) is an entire IDE for Go

    To run `gofmt` manually:

    ```bash
    # will only show the differences
    gofmt -d filename.go

    # will apply the changes
    gofmt -w filename.go
    ```

    ```git
    --- Current
    +++ Formatted
    @@ -14 +14 @@
    -	if (name == "") {
    +	if name == "" {
    @@ -17 +17 @@
    -	return "One for " + name +", one for me."
    +	return "One for " + name + ", one for me."
    ```
```

## 社区视角

exercism 的社区形态也很有意思，网站开发基本靠一次又一次的马拉松：

```
Next Saturday (August 22nd) is our second “Markathon” - a full day of the Exercism
 community working together on version 3 of the platform - with a focus on writing
 content and ensuring we all have local setups and tooling up to date.

If you’ve not had a chance to contribute to #v3 but want to, this is the perfect 
time to get started. Lots of us will be there all day to help answer questions and 
guide you.Details are as follows:

- Start: Friday Aug 21st, 23:00 UTC
- Finish: Saturday Aug 22nd, 23:59 UTC (25hrs later)
- Location: #v3-markathon here and https://www.gotomeet.me/exercism for video
```

> 这一次似乎是赶不上了，下次大概我也会加入吧（

Slack 中还有一个感言频道，各位 Mentor 在里面发表自己的一个又一个里程碑：

- 帮助解决了 295 个问题，获得 5/5 满分好评...
- 帮助 250 个学生解决了 704 个问题...
- 来自学生的真诚感谢...

无情的评测机器大概是不会有这样的感受的吧。

## 尾言

对 Go 感兴趣的同学欢迎从现在开始入门 Go： <https://exercism.io/my/tracks/go>，说不定能遇到我呢。各位精通一种或多种语言的大佬们欢迎注册成为 Mentor，帮助更多人加入到 Coding 的世界吧～