---
categories: Develop
date: 2017-01-22T00:00:00Z
tags:
- Python
title: 聊一聊 Python 的字符串
url: /2017/01/22/encoding-in-python/
---

这篇文章目标是解决一个非常简单的问题：如何编写一个跨平台，跨版本且字符串行为一致的 Python 命令行应用。

<!--more-->

## 概念界定

在回答好这个问题之前，首先需要分清楚以下几个概念：字符，字符串，字符集，字符编码，终端编码，字体。

### 字符

计算机只能处理0和1这两个数字，如果想要计算机识别更多的字符，则需要定义数字（专业一点可以叫做character code，也称 code point 代码点）到字符的一个映射，通常把这样的映射叫做`字符编码(character encoding)`。最常见的字符编码就是 `ASCII编码`，它使用8个二进制位来表示字符，其中最前面的1位统一规定为0，后面的7位用来表示符号，共计128个。在C语言中经常使用到的 `i >= 65 && i < 97` 来表示大写字母就是使用了这样的映射关系。

### 字符集与字符编码

经常说的 `ASCII` 其实涵盖了两个概念： `ASCII字符集` 与 `ASCII编码`。`ASCII字符集` 规定了字符码到字符的映射，而 `ASCII编码` 则规定了字符码在计算机中如何存储，即定义了字符集的 `存储形式` 。下面我引用来自 [@liujiacai](http://liujiacai.net/blog) 的一副图表示他们之间的逻辑关系：

![字符、代码点、二进制字节关系图](/imgs/develop/chararter-code-point.png)

- `Character 字符`: 人类可以理解的字符，比如：`A`，`漩`，`涡`这样的符号
- `Character Set 字符集`: 字符码到字符的映射，比如 `Unicode 字符集``
- `Code point 代码点`: 一个无符号数字，在现代计算机中通常用16进制表示
- `Encoding 编码`: 根据规定的编码将字符码存储在内存和硬盘中，比如 `UTF-8 编码` 和 `UTF-16 编码`
- `Bytes 二进制字节`: 代码点在内存或磁盘中的表示形式，字符码与字节的对应关系

### 字符串与字节流

由字节码组成的串，不妨叫做“字节流”；由字符组成的串，一般叫做字符串。他们之间存在着这样的对应关系：

![字节流与字符串](/imgs/develop/decode-encode.png)

在`Python 2`中： `str` = `字节流`，`unicode` = `字符串`

在`Python 3`中： `bytes` = `字节流`， `str` = `unicode` = `字符串`

### 终端编码

> 这里的终端是泛指，包括 Linux 下的 Console, Windows 下的 CMD 和 PowerShell 以及 Mac OS X 下的 Terminal

终端编码决定了用户的输入和输出应当采用何种编码来进行编码和解码。

Linux 和 Mac 用户应该对终端编码比较熟悉，经常会用的到有以下环境变量： `LC_ALL`，`LC_CTYPE`。他们之间的覆盖关系是 `LC_ALL` > `LC_CTYPE` ，推荐的配置是 `en_US.UTF-8`。

对于 Windows 用户而言就比较麻烦了，他们使用的是一个叫做 `Code Page (代码页)` 的配置，更糟糕的是，`Code Page` 默认为936，也就是我们所熟知的 `cp936` ， 又叫做 `GBK`。想要切换到 `UTF-8` 的话需要执行命令 `chcp 65001`。

### 字体

字体决定了字符如何显示。

很常见的一种情况是编码支持某个字符，但是字体并不支持，这个时候就会显示成奇怪的字符。使用过 `oh-my-zsh` 的 `agnoster` 主题的同学应该会遇到这种情况，系统默认的字体不支持 `powerline` 所使用的特殊符号，需要为字体打上补丁才能正常显示。

## 错误剖析

前面厘清了很多概念，下面可以好好的将一讲在Python中遇到的编码问题了。

### 未指定代码源文件的coding

使用Python 2的时候，如果在没有指定coding的源代码中使用了非ASCII字符，会提示一个语法错误：

{{< highlight bash >}}
> cat test.py
print("测试")
> python2 test.py               
 File "test.py", line 1
SyntaxError: Non-ASCII character '\xe6' in file test.py on line 1, but no encoding declared; see http://python.org/dev/peps/pep-0263/ for details
{{< / highlight >}}

这是因为Python默认的文件编码是 ASCII ，从而导致在读取源文件的时候就发生了错误。可以通过在文件的第一行或者第二行添加 `# -*- coding: utf-8 -*-` 来解决。

### 默认的ASCII编码导致的错误

Python 2 中默认用来编解码的同样是 ASCII ，在不指定 `UTF-8` 来解码的时候就会发生这样的错误：

{{< highlight python >}}
# python 2.7.13
>>> "测试".decode()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe6 in position 0: ordinal not in range(128)
{{< / highlight >}}

只需要指定正确的编码即可：

{{< highlight python >}}
# python 2.7.13
>>> "测试".decode("utf-8")
u'\u6d4b\u8bd5'
{{< / highlight >}}

### 隐含的编解码转换

很常见的一种错误是Python的隐式类型转换导致的。比如：

{{< highlight python >}}
# python 2.7.13
>>> "测试".encode()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe6 in position 0: ordinal not in range(128)
{{< / highlight >}}

第一次接触到这种错误的时候会有一种荒谬感，明明自己在做`encode()`操作，为什么报了一个`UnicodeDecodeError`？
这是因为 python 在调用 `str.encode()` 的时候，实际上做的操作是 `str.decode().encode()`。

{{< highlight python >}}
# python 2.7.13
>>> "测试".decode().encode()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeDecodeError: 'ascii' codec can't decode byte 0xe6 in position 0: ordinal not in range(128)
{{< / highlight >}}

回忆一下字符串与字节流的关系，字符串编码为字节流，字节流解码为字符串。对一个字节流进行编码，实际上是先解码成为字符串，再编码为字节流。Python 中存在着很多这样的隐式转换，包括字符串的比较、拼接、替换，读写文件，print等。遇到这样的问题的时候需要查阅Python的文档，弄清楚到底传入和返回的是什么数据类型再做判断。

### 错误的终端编码

这种问题比较多见在 Windows 平台上：

{{< highlight python >}}
>>> print("™")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
UnicodeEncodeError: 'gbk' codec can't encode character '\u2122' in position 43: illegal multibyte sequence
{{< / highlight >}}

> 最神奇的地方在于，Windows自己是可以在CMD中显示 `™` 的，这个字符还可以用做合法的 Windows 文件名，但是这个字符并不在 gbk 字符集中。

## 解决方案

问题也总结了一遍，现在终于可以来回答文章最开头提出的问题了：如何编写一个跨平台，跨版本且字符串行为一致的 Python 命令行应用？

### 设置代码 coding

建议为所有的源文件加上默认的coding设置： `# -*- coding: utf-8 -*-` 。

尽管在 Python 3 的规范当中要求不需要指定 coding，但是为了兼容性考虑，所有会出现 Non-ASCII 字符的源代码文件都需要加上这个注释。

### 只使用 Unicode

很多的问题都是由于python2中的unicode与str之间的隐式转换导致的，我们可以使用 `from __future__ import unicode_literals` 来将代码文件中所有的字面量全都转为 unicode 。可以简单的认为，使用了这个之后，文件中所有的 `"test"` 全都变成了 `u"test"`。当然，你也可以显示的指定，Python 3 同样兼容这样的表示方法。

### 设置 PYTHONENCODING

前面提到 Python 2 在输出时会根据终端的编码进行编码，但是在重定向的时候就会使用默认的 ASCII 编码。这种时候，通过设置环境变量 `PYTHONENCODING` 为 `UTF-8` 就可以比较好的解决问题。

### 判断 Python 版本进行特殊处理

在不同的 Python 版本中有些函数的输入和输出类型不一样，这时候需要通过判断来执行不同的代码。比如

{{< highlight python >}}
if is_python2:
    endpoint = endpoint.replace(
        "<%s>" % k, quote(unicode(v).encode("utf-8"))
    )
    request_uri = request_uri.replace(
        "<%s>" % k, quote(unicode(v).encode("utf-8"))
    )
elif is_python3:
    endpoint = endpoint.replace("<%s>" % k, quote(str(v)))
    request_uri = request_uri.replace("<%s>" % k, quote(str(v)))
{{< / highlight >}}

这里传入的 v 可能是数字，也有可能是 `unicode` 。在 Python 2 中，如果全都使用 `str` 来做强制类型转换，很有可能导致 `UnicodeEncodeError` 错误。因此需要先转换为 `unicode` 类型再 `encode` 成为 `str` 然后再传入 `quote()` 函数。在Python 3中就简单多了，直接转换为 `str` 即可。

## 总结

本文从基础概念讲起，分析了常见的问题，最后给出了自己实践当中的一些做法。受限于个人的能力和眼界，这里做法可能并不是最好的实践，甚至还会有些错误的地方。希望诸位读者可以一起交流，共同进步，以上。

## 参考资料

- [字符串，那些你不知道的事](http://liujiacai.net/blog/2015/11/20/strings/)
- [Python2 中的编码问题](http://liujiacai.net/blog/2016/06/30/python2-encoding/)
- [字符编码笔记：ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)
- [Locale setting variables](https://help.ubuntu.com/community/EnvironmentVariables#Locale_setting_variables)
