title: Python包分发详解
date: 2015-11-3 15:24:06
tags: [Python]
categories: Develop
toc: true
---
# 前言
用Python写过不少的脚本，现在要把脚本打包成模块并进行发布，然后才明白脚本Boy到正规的码农差距有多大= =。
踩了很多天的坑之后，自己学习到了Python的包分发机制，以及如何利用Pypi向全世界分发自己的模。现在简单地做一些整理。

# Python包机制

> 包是一个模块或模块/子模块的集合，一般情况下被压缩到一个压缩包中。
> 其中包含
> 1. 依赖信息
> 2. 将文件拷贝到标准的包搜索路径的指令。
> 3. 编译指令(如果在安装前代码必须被编译的话)。

也就是说，为了分发模块，我们需要把模块的依赖信息和模块一起打包。在Python中，这个打包好的可分发的文件一般以`.egg`结尾，其作用可以理解为java中的jar。Python的包管理以及分发曾经经历过非常混乱的一段时期，但是如今已经基本稳定（或者说，流行？）为两个套件：

- 打包&分发：[Setuptools](https://pythonhosted.org/setuptools/)
- 安装&管理：[pip](https://pip.readthedocs.org/en/stable/)

# 准备工作

## 注册Pypi

> Pypi - the Python Package Index
> Pypi是Python语言包的仓库，全世界所有开源Python开发者都会在Pypi上提交&下载软件包

为了我们后续的提交操作，我们需要首先[注册](https://pypi.python.org/pypi?%3Aaction=register_form)一个Pypi的账号，注册非常简单，提供用户名，密码以及邮箱，经过验证之后就注册完成了。

## 目录结构

Python没有严格的工程目录要求，只要有`__init__.py`在的地方，就会被认为是一个Python的包。但是出于方便协作考虑，可以把自己的源代码与各种脚本分开存放。具体的结构可以学习Github上比较流行的Python项目，选择自己喜欢的即可。

## 环境配置

首先你需要有pip，pip自从`3.4`版本开始已经随python内置发布，如果使用的版本比较低，可以自己手动进行安装：

```
sudo apt-get install python-pip
```

然后我们需要安装`setuptools`：

```
pip install setuptools
```

# 编写安装脚本

准备工作就绪之后，我们就可以开始编写安装脚本了。

## 填写配置信息

### 基本框架

```python
from setuptools import setup, find_packages # 引入setuptools包

setup(
    option = values, # 本质上是一个函数的参数，分行写便于维护
)
```

### 参数详解（Todo）

### 典型配置

```python
from setuptools import setup, find_packages
setup(
    name = "HelloWorld",
    version = "0.1",
    packages = find_packages(),
    scripts = ['say_hello.py'],

    # Project uses reStructuredText, so ensure that the docutils get
    # installed or upgraded on the target machine
    install_requires = ['docutils>=0.3'],

    package_data = {
        # If any package contains *.txt or *.rst files, include them:
        '': ['*.txt', '*.rst'],
        # And include any *.msg files found in the 'hello' package, too:
        'hello': ['*.msg'],
    },

    # metadata for upload to PyPI
    author = "Me",
    author_email = "me@example.com",
    description = "This is an Example Package",
    license = "PSF",
    keywords = "hello world example examples",
    url = "http://example.com/HelloWorld/",   # project home page, if any

    # could also include long_description, download_url, classifiers, etc.
)
```

## 打包

> 这个坑踩了很久- -，没有老司机的带的痛苦
> 与开发环境不同的时候，当用户运行你的包时，使用open等命令是以当前目录为根运行的，所以你必须指定数据所在位置，否则会出现IOError甚至更糟糕的情况

### 指定需要分发的文件

**自动处理**

当没有`MANIFEST.in`文件时，Setuptools将会按照下面的原则处理文件：

- 所有`py_modules`和`packages`选项包含的Python源文件
- 所有`ext_modules`或`libraries`选项指定的C源文件
- `scripts`指定的脚本（*参见[Installing Scripts](https://docs.python.org/3.5/distutils/setupscript.html#distutils-installing-scripts)*）
- 形如`test/test*.py`的文件
- `README.txt`（或`README`），`setup.py`和`setup.cfg`
- 符合`package_data`选项的所有文件（*参见[Installing Package Data](https://docs.python.org/3.5/distutils/setupscript.html#distutils-installing-package-data)*）
- 符合`data_files`选项的所有文件（*参见[Installing Additional Files](https://docs.python.org/3.5/distutils/setupscript.html#distutils-additional-files)*）

*翻译自[Python官方文档 Specifying the files to distribute](https://docs.python.org/3.5/distutils/sourcedist.html#specifying-the-files-to-distribute)*

**手动处理**

一般而言，自动处理已经足够，但是如果想要自己指定的话，则需要编辑`MANIFEST.in`模板文件。
`MANIFEST.in`模板文件很简单，每一行都导入或者导出表示符合正则的一类文件。比如说：
```
# 导入根目录下满足*.txt的文件
include *.txt
# 递归导入examples目录下满足*.txt和*.py的文件
recursive-include examples *.txt *.py
# 导入满足examples/sample?/build的文件夹下所有文件
prune examples/sample?/build
```

*详细语法参见[此处](https://docs.python.org/3.5/distutils/commandref.html#sdist-cmd)*

> 注意：
> 当根目录下存在`MANIFEST.in`文件时，Setuptools将不会再采用自动处理的设定，因此需要在`MANIFEST.in`文件中指明所有需要导入的文件。

### 调用数据
当你需要调用Python包中的文件时，你可以使用下面的方法：

```python
from pkg_resources import resource_string
data = resource_string(__name__, 'data.dat')
```

此时，指定的`data.dat`文件将会以二进制文件流的形式赋值到data变量中，你可以按照自己的需要进行进一步处理。

### 创建源码分发包
在包的根目录下执行：
```python
python setup.py sdist
```
默认情况下，`sdist`命令将会为Unix创建`gzip`压缩文件，为Windows创建`zip`压缩文件
你也可以添加参数`--formats=zip`指定生成的文件类型，所有支持的参数见[此处](https://docs.python.org/3.5/distutils/sourcedist.html)

### 创建二进制分发包
除了创建源码分发之外，我们还可以创建基于平台的二进制分发包。
在包的根目录下执行：
```python
python setup.py bdist
```
默认情况下，这个命令将会创建基于自身平台的分发包。
同样的，你也可以添加`--format=zip`参数来指定生成的文件，支持的参数见[此处](https://docs.python.org/3.5/distutils/builtdist.html)
除此之外，也可以使用以下的命令直接生成对应格式的分发包：
命令|合适
--|--
bdist_dumb  |tar, gztar, bztar, xztar, ztar, zip
bdist_rpm   |rpm, srpm
bdist_wininst |  wininst
bdist_msi  | msi

# 上传到Pypi
## 注册包
在上传我们的包之前，我们需要首先向Pypi提交包的相关信息。
在包的根目录下执行:
```python
python setup.py register
```
没有登陆的话，需要进行登陆；如果已经登陆，直接回车使用默认设置即可。

## 上传包
注册完毕后，我们可以提交我们的包了。
在包的根目录下执行：
```python
python setup.py sdist bdist_wininst upload
```
这条命令将会向Pypi提交源码和Win下的安装包，如果需要上传别的包，只要直接写出即可。


# 参考资料
- [Python开发生态环境简介](https://github.com/dccrazyboy/pyeco/blob/master/pyeco.rst)
- [使用Setuptools构建和分发python包](http://timd.cn/2015/10/20/setuptools/)
- [10.8 读取位于包中的数据文件](http://python3-cookbook.readthedocs.org/zh_CN/latest/c10/p08_read_datafile_within_package.html)
- [Creating a Source Distribution](https://docs.python.org/3.5/distutils/sourcedist.html)
- [Examples](https://docs.python.org/3.5/distutils/examples.html)
