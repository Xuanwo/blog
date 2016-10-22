---
layout: post
title: POJ 1083 Moving Tables
date: 2014-07-22 21:03:10
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1083

# 理解
题目不难，关键在于理解题意。开一个数组，求出每一张桌子移动的时间，遍历找出最大值即可。

<!-- more -->

# 代码

```
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int main(int argc, char const *argv[])
{
    int n, tables, corridor[200], i, j, start, end, time, x, y;
    scanf("%d", &n);
    while (n-- > 0)
    {
        memset(corridor, 0, sizeof(corridor));
        time = 0;
        scanf("%d", &tables);
        for (i = 0; i < tables; i++)
        {
            scanf("%d%d", &x, &y);
            start = ((x < y ? x : y) - 1) / 2;
            end = ((x > y ? x : y) - 1) / 2;
            for (j = start; j <= end; j++)
                corridor[j] += 10;
        }
        for (i = 0; i < 200; i++)
            time = corridor[i] > time ? corridor[i] : time;
        printf("%d\n", time);
    }
    return 0;
}

```

# 更新日志
- 2014年07月22日 已AC。