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
**求最大公约数和最小公倍数***
> 编写程序，在主函数中输入两个正整数a,b，调用两个函数fun1(),fun2()，分别求a,b的最大公约数和最小公倍数，在主函数中输出结果。

并没有什么搞头，直接gcd搞起。
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

**排序并插入**
> 编写程序，在主函数中定义一个有10个元素的整型一维数组，用户输入9个数据，调用函数，对数组元素进行从小到大排序后，在函数中输入一个数，插入到数组中正确的位置，并输出。

一开始题目的数据是错的= =，神WA了半天，后来教师修改之后，总算是过了，复习了一下C语言下的qsort的用法。

```
#include <stdio.h>
#include <stdlib.h>

int a[11];

int cmp (const void * a, const void * b)
{
  return ( *(int*)a - *(int*)b );
}

void init()
{
     for(int i=0;i<8;i++)
     {
          scanf("%d,", &a[i]);
     }
     scanf("%d", &a[8]);
     scanf("%d", &a[9]);
}

int main(int argc, char const *argv[])
{
     init();
     qsort (a, 10, sizeof(int), cmp);
     for(int i=0;i<9;i++)
     {
          printf("%d,", a[i]);
     }
     printf("%d", a[9]);
     return 0;
}
```

# 更新日志
- 2015年04月09日 诡异- -，第二题神WA。
- 2015年04月13日 教师修复了错误的数据，现在已经AC了。