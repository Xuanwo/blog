title: 在Python中使用JSON
date: 2015-10-30 23:47:23
tags: [Software, Python, JSON]
categories: Develop
toc: true
---
# JSON介绍
JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。 易于人阅读和编写。同时也易于机器解析和生成。 它基于JavaScript Programming Language, Standard ECMA-262 3rd Edition - December 1999的一个子集。 JSON采用完全独立于语言的文本格式，但是也使用了类似于C语言家族的习惯（包括C, C++, C#, Java, JavaScript, Perl, Python等）。 这些特性使JSON成为理想的数据交换语言。

*引用自[json.org](http://www.json.org/json-zh.html)*

<!-- more -->

# 语法

## 结构

JSON只提供了两种结构——字典和数组。也就是说，JSON可以存储一对一或者一对多的键值对关系。

## 形式

### 对象
对象是一个无序的键值对集合。
一个对象以`{`开始，`}`结束。每个`键`后跟一个`:`；键值对之间使用`,`分隔。
![object](/imgs/develop/object.gif)

### 数组
数组是值的有序集合，一个键可以对应一个数组。
一个数组以`[`开始，`]`结束。值之间使用`,`分隔。
![array](/imgs/develop/array.gif)

### 值
值可以是双引号括起来的字符串、数值、true、false、 null、对象或者数组。这些结构可以嵌套。
![value](/imgs/develop/value.gif)

### 字符串
字符串是由双引号包围的任意数量Unicode字符的集合，使用反斜线转义。一个字符即一个单独的字符串。
字符串与C/C++中的字符串非常相似，包括常见的各种转义符号。
![value](/imgs/develop/string.gif)

### 数值
数值与C/C++中的数值非常相似，但没有八进制和十六进制格式。
![number](/imgs/develop/number.gif)

### 空白
空白符号（包括空格，Tab以及回车）可以加入到任何符号之间，不会影响JSON的含义

# Python中的JSON库
*以Python 3为基准*


## 编码

### 对应类型

Python |  JSON
--|--
dict  |  object
list, tuple | array
str| string
int, float| number
True  |  true
False  | false
None   | null

### 函数
我们使用`JSON`库中的`dump`以及`dumps`函数来进行`JSON`编码。`dump`和`dumps`各项参数含义基本一致，唯一区别在于`dump`函数编码产生一个JSON文件流，而`dumps`编码产生一个JSON字符串。

```python
json.dump(obj, fp, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)

json.dumps(obj, skipkeys=False, ensure_ascii=True, check_circular=True, allow_nan=True, cls=None, indent=None, separators=None, default=None, sort_keys=False, **kw)
```

- `obj`：编码对象
- `fp`：指定文件流
- `skipkeys`：若skipkeys为真，则非标准类型将会跳过；否则返回`TypeError`
- `ensure_ascii`：若`ensure_ascii`为真，则输出时将会确保没有非ASCII字符；否则将会原样输出
- `check_circular`：若`check_circular`为真，则将会检测是否存在循环调用；否则会跳过检测
- `allow_nan`：若`allow_nan`为真，则将会允许存在空值（无穷大值）；否则会返回`ValueError`
- `cls`：若`cls`为空值，则使用`JSONEncoder`；否则使用指定子类进行编码
- `indent`：若`indent`为空值，则无缩进；否则使用指定值进行缩进
- `separators`：若`separators`为空值，则使用`(',', ': ')`分隔；否则使用指定的元组进行分隔
- `default`：若`default`为空值，则使用自带的`default`方法；否则使用指定值
- `sort_keys`：若`sort_keys`为真，则输出将会按照键进行排序

### 示范

```python
>>> import json

>>> json.dumps(['foo', {'bar': ('baz', None, 1.0, 2)}])
'["foo", {"bar": ["baz", null, 1.0, 2]}]'

# 排序
>>> print(json.dumps({"c": 0, "b": 0, "a": 0}, sort_keys=True))
{"a": 0, "b": 0, "c": 0}

# 分隔符
>>> json.dumps([1,2,3,{'4': 5, '6': 7}], separators=(',', ':'))
'[1,2,3,{"4":5,"6":7}]'

# Unicode输出
>>> json.dumps("\u5317\u4eac", ensure_ascii=False)
'北京'
```

## 解码

### 对应类型

JSON | Python
-- | --
object | dict
array  | list
string | str
number (int)  |  int
number (real) |  float
true  |  True
false |  False
null  |  None

### 函数
我们使用`JSON`库中的`load`以及`loads`函数来进行`JSON`解码。`load`和`loads`各项参数含义基本一致，唯一区别在于`load`函数用于解码JSON文件流，而`loads`用于解码JSON字符串。

```python
json.load(fp, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)

json.loads(s, encoding=None, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw)
```

- `fp`：指定文件流
- `s`：指定字符串
- `encoding`：指定字符串编码
- `cls`：若`cls`为空值，则使用`JSONEncoder`；否则使用指定子类进行编码
- `object_hook`：若`object_hook`为空值，对象则返回解码器`dict`；否则使用自定义类型返回
- `parse_float`：若`parse_float`为空，则JSON浮点数转换为浮点数；否则转换为指定类型
- `parse_int`：若`parse_int`为空，则JSON整数转换为整数；否则转换为指定类型
- `parse_constant`若`parse_constant`为空，则不会处理非法输入；否则抛出异常
- `object_pairs_hook`：若`object_pairs_hook`为空值，则数组返回解码器`dict`；否则使用自定义类型返回

### 示范

```python
>>> import json

>>> json.loads('["foo", {"bar":["baz", null, 1.0, 2]}]')
['foo', {'bar': ['baz', None, 1.0, 2]}]
```

# 更新日志
- 2015年10月30日 初步完成