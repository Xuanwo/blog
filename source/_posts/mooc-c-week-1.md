title: C语言程序设计（下）——第一周
date: 2015-4-9 23:51:07
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
简单的介绍了函数之间的相互调用，重点在于区分函数的实参和形参，把这样两个概念处理好就OK了。

<!-- more -->

# 作业
## 求最大公约数和最小公倍数
### 题目内容：
编写程序，在主函数中输入两个正整数a,b，调用两个函数fun1(),fun2()，分别求a,b的最大公约数和最小公倍数，在主函数中输出结果。

### 输入格式:
两个正整数

### 输出格式：
最大公约数和最小公倍数

### 输入样例：
12,40

### 输出样例：
最大公约数：4
最小公倍数：120

### 限制
时间限制：500ms
内存限制：32000kb

### AC代码
```
#include <stdio.h>

int a, b;

int fun1(int a, int b)
{
	return b == 0 ? a : fun1(b, a % b);
}

int fun2(int a, int b)
{
	return a * b / fun1(a, b);
}

int main(int argc, char const *argv[])
{
	scanf("%d,%d", &a, &b);
	printf("最大公约数：%d\n", fun1(a, b));
	printf("最小公倍数：%d", fun2(a, b));
	return 0;
}
```

# 更新日志
- 2015年4月9日 诡异- -，第二题神WA。