---
title: POJ 1664 放苹果
date: 2014-08-05 15:47:50
tags: [ACM, POJ, C, DP]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1664

# 理解
有两种情况：
1. 至少空出一个盘子不放（相对于目前），则转化为在(n-1)个盘子里放m个苹果，在剩下的盘子里放入0个苹果，即apple(m,n-1)；
2. 所有盘子至少放入一个。先在每个盘子里都放入1个苹果，剩下m-n个苹果，再在n个盘子里进行放置。即apple(m-n,n)。
然后是结束的条件，有三种。
1. 当m==0时，苹果已经放完，只有一种情况，即不放置，返回1；
2. 当n==1时，只有一个盘子可以放置，返回1；
3. 当m<n时，苹果数小于盘子数，和将m个苹果放入m个盘子情况相同。

<!-- more -->

# 代码

```
#include <iostream>
#include <stdio.h>
using namespace std;

int apple(int m, int n )
{
    if (m == 0 || n == 1)
        return 1;
    if (m < n)
        return apple(m, m);
    return apple(m - n, n) + apple(m, n - 1);
}

int main(int argc, char const *argv[])
{
    int t, m, n;
    scanf("%d", &t);
    while (t--)
    {
        scanf("%d%d", &m, &n);
        printf("%d\n", apple(m, n));
    }
    return 0;
}

```

# 更新日志
- 2014年08月05日 已AC。