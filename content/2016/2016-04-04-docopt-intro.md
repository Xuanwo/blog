---
categories: Develop
date: 2016-04-04T00:00:00Z
tags:
- Python
- qingchat
title: docopt——好用的Python命令行参数解释器
toc: true
url: /2016/04/04/docopt-intro/
---

[`Qingchat`](https://github.com/Xuanwo/qingchat) 使用的命令行参数解释器是 [`docopt`](http://docopt.org/)，用下来感觉非常棒，所以决定介绍一下这个库。（*奉劝各位看官，珍爱生命，远离argparse。*）

<!--more-->

# 介绍
docopt 本质上是在 Python 中引入了一种针对命令行参数的形式语言，在代码的最开头使用`"""`文档注释的形式写出符合要求的文档，就会自动生成对应的parse，体验非常赞。

# 用法

## 样例

docopt的使用非常简单，以Qingchat为例，你只需要在代码最开头加入：

```python
"""Qingchat CLI

Usage:
  qingchat config ip <ip>
  qingchat config port <port>
  qingchat config login
  qingchat group list
  qingchat group choose <group_name>...
  qingchat group clean
  qingchat group send -t <content>
  qingchat group send -i <media>
  qingchat group send -f <file> [<delaytime>]

Options:
  -h --help     Show this screen.
  -v --version     Show version.
"""
```

然后在执行代码中加入：

```python
arguments = docopt(__doc__, version='Qingchat 0.3.2')
```

就会在你的程序中导入一个`arguments`字典，这个字典中的内容形如：

```python
{
    '-f': False,
    '-i': False,
    '-t': False,
    '<content>': None,
    '<file>': None,
    '<group_name>': [],
    '<ip>': '127.0.0.1',
    '<media>': None,
    '<port>': None,
    'choose': False,
    'clean': False,
    'config': True,
    'group': False,
    'ip': True,
    'list': False,
    'login': False,
    'port': False,
    'send': False
}
```

这样应该就能很容易看出来，我们在文档中写的每一个短语，都被转化为一个对应的类型。只要直接调用`arguments['xxx']`就可以判断或者使用对应的值，从而实现对应的功能。

## 详解

前面我们举了一个例子，下面我们来详细介绍一下如何完成一个符合 `docopt` 要求的注释文档。

### Usage

所有出现在`usage:`（区分大小写）和一个空行之间的文本都会被识别为一个命令组合，`usage`后的第一个字母将会被识别为这个程序的名字，所有命令组合的每一个部分（空格分隔）都会成为字典中的一个key。

#### 参数

形如 `<argument>` 或者 `ARGUMENT` 的文本将会被识别为参数。
在转化后的字典中的取值为 `True` 或者 `False` 。


```python
Usage: my_program <host> <port>
```

#### 选项

形如 `-o` 或者 `--option` 的文本将会被识别为选项。
在转化后的字典中的取值为 `True` 或者 `False` 。

```python
Usage: my_program -f <file>
```

Tips:

- 短选项可以组合起来，比如`-abc`等价于`-a -b -c`
- 长选项需要的参数需要使用 `=` 或者空格来分隔，`--input=ARG` 等价于 `--input ARG`
- 短选项可以不需要空格， `-f FILE` 等价于 `-fFILE`

#### 命令

其他不满足 `--options` 或者 `<arguments>` 的文本将会被识别为（子）命令。
在转化后的字典中取值为 `True` 或者 `False`。

#### 可选项

形如 `[optional elements]` 的文本是可选项。
`elements`包括上述的三种类型：参数，选项以及命令。

在相同或者不同的括号中都是一样的：

```python
Usage: my_program [command --option <argument>]
```

等价于

```python
Usage: my_program [command] [--option] [<argument>]
```

#### 必填项

形如 `(required elements)` 的文本是必填项。
上述三种元素默认都是必填项，`()`符号用在一些比较特殊的情形下，比如：

```python
Usage: my_program (--either-this <and-that> | <or-this>)
```

#### 选择项

形如 `element|another` 的文本是选择项，你可以从中选择一个值。

```python
Usage: my_program go (--up | --down | --left | --right)
```

#### 列表项

形如 `element...` 的文本是列表项，你可以输入多个参数。

比如说：

```python
Usage: my_program open <file>...
```

然后你可以通过`arguments['<file>']` 来访问这个列表。

### Option

`Option` 部分用于指定某些特殊情形，比如：

- 将某个短参数与长参数关联起来，比如`-i <file>, --input <file>`
- 某个选项有一个参数
- 选项的默认值，比如`--coefficient=K  The K coefficient [default: 2.95]`

### 校验

如果对自己完成的文档有疑问，可以使用[在线工具](http://try.docopt.org/)进行校验。

# 更新日志

- 2016年04月04日 首次发布
