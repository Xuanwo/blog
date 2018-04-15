---
categories: Develop
date: 2018-04-15T15:07:00Z
tags:
- Develop
- Python
series: "Learn from BUG"
title: Python 中的引用与拷贝
toc: true
url: /2018/04/15/reference-and-copy-in-python/
---

用户反馈使用 [qsctl](https://github.com/yunify/qsctl) 同步时文件内容不正确，调查后发现是对 Python 字典的错误使用导致了这个问题。这篇文章就来详细的介绍一下 Python 中的引用与拷贝。

<!--more-->

## 定位

按照用户给出的信息成功的复现出了用户描述的问题，进一步的，还发现当线程数量限制为只有一个时候，这个问题就消失了，因此可以判断是 Python 多线程间共享变量的时候出现了问题。qsctl 本身只是将文件 list 出来并调用 SDK 进行上传，没有做额外的处理，因此可以排除 qsctl 的嫌疑。也就是说，问题出在 Python SDK 上。阅读一下 Python SDK 中 [PutObject](https://github.com/yunify/qingstor-sdk-python/blob/master/qingstor/sdk/service/bucket.py#L1148) 相关方法的源代码：

```python
def put_object_request(self, object_key, body=None):
    operation = {
        "API": "PutObject",
        "Method": "PUT",
        "URI": "/<bucket-name>/<object-key>",
        "Headers": {
            "Host": "".join([self.properties["zone"], ".", self.config.host]),
        },
        "Properties": self.properties,
        "Body": body
    }
    operation["Properties"]["object-key"] = object_key
    self.put_object_validate(operation)
    return Request(self.config, operation)

def put_object(self, object_key, body=None):
    req = self.put_object_request(object_key, body=body)
    resp = self.client.send(req.sign())
    return Unpacker(resp)
```

忽略掉一些无关的代码之后，我们可以得到上面的简化代码。其中 `self` 也就是这个 `Bucket` 类会在一开始就初始化，之后的所有线程都会共享这一变量。顺着这个思路下去，很快发现一处可能导致出现问题的代码：`"Properties": self.properties`。显然的，在 Python SDK 开发者（其实是我- -）认为，此处将会对 `self.properties` 进行一次复制，下面的 `operation["Properties"]["object-key"] = object_key` 操作不会影响其它的线程。那这个想法是否正确？我们需要做个实验。

```python
>>> a = {}
>>> b = a
>>> b["x"] = "y"
>>> a
{'x': 'y'}
```

显然，Python SDK 开发者的想法是错误的。此处对 `operation["Properties"]` 将会修改 `self.properties`，从而导致多个线程可能会覆盖掉同一个 Object，进而导致上传了错误的内容。

## 修复

想要修改这个问题只需要每次创建 operation 字典时传递一个 `self.properties` 的副本，保证接下来的修改不会影响到 `self.properties` 本身即可。此处使用了 Python 字典提供的 [copy 方法](file:///home/xuanwo/.local/share/Zeal/Zeal/docsets/Python_3.docset/Contents/Resources/Documents/doc/library/stdtypes.html#dict)：

- [Fix concurrency issue in object related methods](https://github.com/yunify/qingstor-sdk-python/pull/43/commits/208172502fb72b9be85e7f1a494673810ee2e974)

## 思考

问题已经解决了，但是思考还在继续。

- Python 中的引用和复制是什么关系？

为了解决这个问题，首先需要知道以下两个关键的事实：

1. 变量只是用来指代对象的名称 (*Variables are simply names that refer to objects.*)
1. List，Dict 是可变对象 (*Lists are mutable, which means that you can change their content.*)

### 事实 1

**变量只是用来指代对象的名称 (*Variables are simply names that refer to objects.*)**

先来看一段简短的代码：

```python
>>> a=2
>>> b=a
>>> id(a)
9128416
>>> id(b)
9128416
```

> [`id`](https://docs.python.org/3/library/functions.html#id) 函数会返回每一个 Object 的唯一 ID，并且保证在这个对象的整个生命周期中保持不变。对于 CPython 的实现而言，这个函数会返回这个对象在内存中的地址。也就是说，如果两个对象的 ID 相同，表示他们是同一个对象。

在类 C 的语言当中，每个变量都代表着一块内存区域；但是在 Python 当中，一切都是对象，变量只是对象的一个名称（a.k.a. 标签，引用），变量本身没有类型信息，类型信息存储在对象当中。上述的代码中 `a=2`，实际上是先创建了 Int 对象 `2` ，然后将变量 `a` 绑定到了 `2` 上。接下来的 `b=a` 则是在对象 `2` 上绑定了一个新的变量 `b`。

```python
>>> a = {}
>>> b = a
>>> id(a)
140092073651336
>>> id(b)
140092073651336
>>> b["x"] = "y"
>>> a
{'x': 'y'}
```

在了解上述事实之后，我们就能理解这段代码了：这里的 `a` 与 `b` 指向了同一个对象，因此通过 `b` 进行的修改相当于通过 `a` 进行同样的修改。


### 事实 2

**List，Dict 是可变对象 (*Lists are mutable, which means that you can change their content.*)**

通过事实 1 我们已经明白了 **变量** 与 **对象** 的关系，但是还是不够，因为我们无法解释下面这段代码：

```python
>>> a=2
>>> b=a
>>> a=a+1
>>> id(a)
9128448
>>> id(b)
9128416
```

按照刚才得出的结论，`a` 和 `b` 应该指向同一个对象，为什么对 `a` 进行的操作没有反应在 `b` 上呢？因为 Int 类型是一个不可变对象(immutable)。

在 Python 中有两类对象类型：

- 可变对象(mutable): list, dict 等
- 不可变对象(immutable): int, string, float, tuple 等

不可变对象是不变的。在 `a=a+1` 这一操作中没有修改 `a` 之前对应的对象 `2` 的值，而是创建了一个新的对象 `3` 并且将 `a` 绑定了上去。

而可变对象则可以通过某些函数来修改这个对象。需要注意的是，并不是所有的可变对象的操作都是修改可变对象本身。Python 标准库会通过函数是否返回 `None` 来区分这个函数是修改了这个对象，还是创建了一个新的对象。比如 List 的 `append` 和 `sort` 函数返回 `None`，这表示它们修改了这个 List 本身；而 `sorted()` 函数则是会返回一个排序后的对象，这说明它创建了一个新的对象。

### 总结

根据对上述两个事实的分析，可以得出以下结论：

- 对可变对象而言，我们可以修改它并且所有指向它的变量都会观察到这一变更
- 对不可变对象而言，所有指向它的变量都会始终看到同一个值，对它的修改操作总是会创建一个新的对象

现在我们就能够解决我们最开始提出的那些问题了：

> Python 中的引用和拷贝是什么关系？

其实没啥关系。对于赋值操作而言，`b=a` 实际上是将 `b` 绑定到了 `a` 所对应的那个对象。而 `b=a.copy()` 这是将 `b` 绑定到了新创建的与 `a` 所对应的那个对象的副本上。特别的，Python 中还有 `浅拷贝` 和 `深拷贝` 的概念，`浅拷贝` 只会复制对象最外层的元素，而 `深拷贝` 则会递归的复制整个对象。当对象内的元素全都是不可变对象时，它们两者并没有差异；而当对象内的元素中有可变对象时，`浅拷贝` 会创建一个到该可变对象的新绑定，`深拷贝` 则会创建一个与该可变对象相同的新对象并对这个可变对象继续做 `深拷贝`。


### 测试

> 先思考得出答案，然后再实际运行，并做出解释。

#### Case 1

```python
def test(arg):
    arg = 2
    print(arg)

a = 1
test(a)
print(a)
```

#### Case 2

```python
def test(arg):
    arg.append(1)
    print(arg)

a = []
test(a)
print(a)
```

#### Case 3

```python
def test(arg):
    arg = arg + [1]
    print(arg)

a = []
test(a)
print(a)
```

#### Case 4

```python
def test(arg):
    arg += [1]
    print(arg)

a = []
test(a)
print(a)
```

#### Case 5

```python
def test(arg=[]):
    arg.append(1)
    print(arg)

test()
test()
```

## 参考

- [Why did changing list ‘y’ also change list ‘x’?](https://docs.python.org/3/faq/programming.html#why-did-changing-list-y-also-change-list-x)
- [Python的函数参数传递：传值？引用？](http://winterttr.me/2015/10/24/python-passing-arguments-as-value-or-reference/)
- [Python 函数中，参数是传值，还是传引用？](https://foofish.net/python-function-args.html)

## 动态

- 通关了《尼尔：机械纪元》，最后十分感动地共享出了自己所有的存档，不说了，六周目见。
