---
layout: post
title: 使用pyQuery解析HTML
date: 2015-10-23 01:03:09
tags: [Software, Python, HTML]
categories: Develop
toc: true
---
# pyQuery介绍

pyquery 可以让你用jquery语法来对xml进行查询。这个API和jquery十分类似。如果利用lxml，pyquery对xml和html的操作将更加快速。

<!-- more -->

# pyQuery安装
> 首先，你得有一个python环境，最好是类linux的，因为安装pyquery的过程中需要编译某一个包，在windows上比较难解决依赖问题

## 安装Python环境

```
sudo apt-get install python python-dev python-pip
```

- `python` 安装python环境
- `python-dev` 安装python开发环境
- `python-pip` 安装pip来进行python包管理

## 解决pyQuery所需依赖

```
sudo apt-get install libxml2-dev libxslt1-dev libz-dev
```

- `libxml2-dev`和`libxslt1-dev`是编译lxml所需要的包，缺少会导致编译失败
- 某些情况下会提示`/usr/bin/ld: cannot find -lz`，所以需要安装`libz-dev`

## 安装pyQuery

```
pip install pyquery
```

解决了依赖问题之后，就可以进行pyquery的安装了。
> 有一个坑点是在虚拟机编译lxml的过程中，如果内存过小会导致编译失败。如果出现错误，请把虚拟机的内存调整至1024M或更大。

# pyQuery使用

## 最简样例

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

from pyquery import PyQuery as pyq


html = '''
<html>
    <head>
        <title>这是标题</title>
    </head>
    <body>
        <p id="hi">Hello</p>
        <ul>
            <li>list1</li>
            <div class="ha">
                Cool!
            </div>
            <li>list2</li>
        </ul>
    </body>
</html>
'''

doc = pyq(html)

print doc('title') # 获取 title 标签的源码
# <title>这是标题</title>

print doc('title').text() # 获取 title 标签的内容
# 这是标题

print doc('.ha').text() # 获取 class 为 ha 的标签的内容
# Cool!

print doc('#hi').text() # 获取 id 为 hi 的标签的内容
# Hello

print doc('p:first').text() # 还可以支持伪类

li = doc('li') # 处理多个元素
for i in li:
    print pyq(i).text()
# list1
# list2
```

## 指定网址

### 直接访问

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

from pyquery import PyQuery as pyq
import urllib

# 直接访问并获取相关信息
print pyq(url='https://www.google.com')
```

### 指定headers

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

from pyquery import PyQuery as pyq
import urllib

# 以指定headers访问并获取相关信息，好处是不会被某些网站拒绝访问
print pyq(url='https://www.google.com', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36')
```

## 指定文件

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

from pyquery import PyQuery as pyq

print pyq(filename='path/to/html/file').text()
```

## 指定lxml文档

```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

from pyquery import PyQuery as pyq
from lxml import etree

# pyquery支持etree的API
print pyq(etree.fromstring("<html></html>")).text()
```

# 参考资料
- [gawel/pyquery](https://github.com/gawel/pyquery)
- [Python使用pyQuery解析HTML内容](http://www.powerxing.com/python-use-pyquery-to-parse-html/)
- [error: Setup script exited with error: command 'x86_64-linux-gnu-gcc' failed with exit status 1](http://stackoverflow.com/questions/26053982/error-setup-script-exited-with-error-command-x86-64-linux-gnu-gcc-failed-wit)
- [lxml installation error ubuntu 14.04 (internal compiler error)](http://stackoverflow.com/questions/24455238/lxml-installation-error-ubuntu-14-04-internal-compiler-error)
- [can't installing lxml on Ubuntu 12.04](http://stackoverflow.com/a/22256546)

# 更新日志
- 2015年10月23日 初步完成
