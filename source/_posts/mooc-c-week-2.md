title: C语言程序设计（下）——第二周
date: 2015-4-13 19:01:28
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
并没有复杂的介绍，补充介绍了一下函数的递归调用。

<!-- more -->

# 作业
**最大公约数**
> 输入两个整数m,n，用递归算法实现计算两个数的最大公约数。

没啥好说的- -，GCD咯。
```
#include <stdio.h>
#include <stdlib.h>

int a,b;

int gcd(int a, int b)
{
	return b==0?a:gcd(b,a%b);
}

void init()
{
	scanf("%d,%d", &a, &b);
}

int main(int argc, char const *argv[])
{
	init();
	printf("%d", gcd(a,b));
	return 0;
}
```

**奇数求和**
> 用递归算法实现，输入整数n（n>0）, 求1+3+5+7….+(2*n-1) 的和

并没有用递归来写，而是直接使用了相关的性质。
```
#include <stdio.h>
#include <stdlib.h>

int n;

void init()
{
	scanf("%d", &n);
}

int main(int argc, char const *argv[])
{
	init();
	printf("%d", n*n);
	return 0;
}
```

# 更新日志
- 2015年04月13日 完成了第二周的作业。