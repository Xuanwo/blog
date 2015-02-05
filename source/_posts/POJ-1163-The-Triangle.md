title: POJ 1163 The Triangle
date: 2014-07-22 21:12:47
tags: [ACM, POJ, C, DP]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1163

# 理解
这是第一道关于DP的题目，据说是用暴力的方法会直接超时，因为有大量的重复计算。使用DP可以避免这一点，最关键的公式是
`triangle[i][j] += max(triangle[i + 1][j] : triangle[i + 1][j + 1])`

<!-- more -->

# 代码
```
#include<stdio.h>
#define MAX 100

int triangle[MAX][MAX];

int main()
{
    int n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++)
        for (j = 0; j <= i; j++)
            scanf("%d", triangle[i] + j);
    for (i = n - 2; i >= 0; i--)
        for (j = 0; j <= i; j++)
            triangle[i][j] += triangle[i + 1][j] > triangle[i + 1][j + 1] ? triangle[i + 1][j] : triangle[i + 1][j + 1];
    printf("%d\n", triangle[0][0]);
    return 0;
}
```

# 更新日志
- 2014年07月22日 已AC。