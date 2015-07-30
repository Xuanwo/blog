title: 七天七语言Ruby第一天
date: 2015-7-30 10:32:23
tags: [Ruby, 阅读]
categories: Learn
toc: true
---
# Ruby配置
出于方便学习已经不纠缠于各种环境配置的考虑，我决定使用[Cloud9平台](https://c9.io/)来进行学习。Cloud 9的默认workspace配置为Ubuntu 14.04.2 LTS，512MB内存，1GB磁盘，1个CPU核心。我预计这些已经足够支持我完成七天七语言的学习，所以不再折腾别的了。以后除非没有预装相应的环境，否则不再重复相关的配置内容了~
C9已经预装了Ruby相关的环境，输入irb可以看出版本号：`2.2.1`。
So，Let's Go.

# Ruby的一些特性
- Ruby是解释执行而非编译执行的
- 纯粹的面对对象语言，在Ruby中，一切皆为对象，就连单独的数字也不例外。
- Ruby使用`.`来调用对象的函数，比如`4.methods`。（与C++不同的是，没有括号）
- Ruby的每一个语句都有其返回值，`nil`表示空值。（不是null啦~）
- Ruby中，变量无需声明便可以进行初始化和赋值。
- 单引号表示字符串，而双引号可以引发字符串替换。（使用`#{var}`来代替需要替换的字符串）

# Ruby的逻辑判断
## 表达式
Ruby的表达式大体上跟C++没啥区别，`<`，`==`这些运算符可以返回相应的结果——`true`或者`false`。值得一提的是，这里的true和false不再是简单的1和0，而是两个专门的类，TrueClass和FalseClass。而且在Ruby中，只有`false`和`nil`才表示否，其他的均为真。是的，`0`也表示真，C++的程序员尤其需要注意。
## 条件判断
有了相应的表达式之后，我们可以进行一些逻辑判断。
### if...else语句
```ruby
if conditional
      code...
[elsif conditional
      code...]...
[else
      code...]
end
```
跟C++的唯一区别大概就是`else if`变成了`elsif`，减少了两次击键，23333。
下面给出一个实例：
```ruby
#!/usr/bin/ruby

x=1
if x > 2
   puts "x is greater than 2"
elsif x <= 2 and x!=0
    puts "x is 1"
 else
    puts "I can't guess the number"
 end
```
输出的结果是
```
x is 1
```
### if修饰符
跟C++有一个明显区别在于，Ruby提供一个一种单行进行逻辑判断的方式，称之为修饰符。
```ruby
code if condition
```
如果condition为真，则执行code。简单的脑补了一下，大概减少了四次击键的样子，学到这里，我觉得我大概有点懂Ruby的对程序员友好的理念了。
下面同样给出一个实例：
```ruby
#!/usr/bin/ruby

debug=1
print "debug\n" if debug
```
输出的结果为：
```
debug
```
### unless语句
这也是相比于C++而言新增的一个语法糖，基本等价于`if not`。
```ruby
unless conditional
   code
[else
   code ]
end
```
如果 conditional 为假，则执行 code。如果 conditional 为真，则执行 else 子句中指定的 code。
我们来看一下这个样例：
```ruby
#!/usr/bin/ruby

x=1
unless x>2
   puts "x is less than 2"
 else
  puts "x is greater than 2"
end
```
将会产生这样的结果：
```ruby
x is less than 2
```
### unless修饰符
跟if一样，unless也提供了修饰符的用法。
```ruby
code unless conditional
```
如果 conditional 为假，则执行 code。
### case语句
首先来介绍一下相应的语法：
```ruby
case expression
[when expression [, expression ...]
   code ]...
[else
   code ]
end
```
比较 case 所指定的 expression，当使用 === 运算符指定时，执行匹配的 when 子句的 code。
when 子句所指定的 expression 背当作左操作数。如果没有匹配的 when 子句，case 执行 else 子句的代码。
when 语句的表达式通过保留字 then、一个换行符或一个分号，来与代码分离开。

来看一个实际的样例：
```ruby
#!/usr/bin/ruby

$age =  5
case $age
when 0 .. 2
    puts "baby"
when 3 .. 6
    puts "little child"
when 7 .. 12
    puts "child"
when 13 .. 18
    puts "youth"
else
    puts "adult"
end
```

这个执行的结果是`little child`。
Ruby的case语句还是十分好用的，通过`x...y`的形式，就可以自动进行匹配。

# Ruby的类型模型
**鸭子模型**
鸭子类型并不在乎其内在类型可能是什么。只要它像鸭子一样走路，像鸭子一样嘎嘎叫，那它就是只鸭子。

这里可以引用一个书上的例子：
```ruby
#!/usr/bin/ruby

i = 0
a = ['100', 100.0]
while i < 2
    puts a[i].to_i
    i = i + 1
end
```
我们可以得到这样的输出：
```
100
100
```

我们可以看到数组a中有一个字符串和一个浮点数，但是在to_i函数的作用下他们都变成了整数100。从某种角度上来说，这就相当于C++中的模板类型。这是面对对象设计思想中的一个重要原则：对接口编码，不对实现编码。同样的，如果两个对象有相同的方法，他们就可以当成同一个对象来调用；反之，如果没有，则不能。

# 更新日志
- 2015年07月30日 完成了第一天的总结~