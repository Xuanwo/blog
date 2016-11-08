---
layout: post
title: POJ 2013 Symmetric Order
date: 2014-08-05 21:40:00
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=2013

# 理解
一组字符串，从短到长再到短排列，相同长短的字符串按照字母表顺序排列。

<!-- more -->

# 代码

```
#include <stdio.h>

int main(int argc, char const *argv[])
{
    int i, n, sum = 0;
    char a[30][30];
    while (scanf("%d", &n) != EOF, n)
    {
        for (i = 0; i < n; i++)
            scanf("%s", a[i]);
        printf("SET %d\n", ++sum);
        for (i = 0; i < n; i++)
        {
            if (i % 2 == 0)
            {
                printf("%s\n", a[i]);
            }
        }
        for (i = n - 1; i >= 0; i--)
        {
            if (i % 2 != 0)
            {
                printf("%s\n", a[i]);
            }
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月05日 已AC。