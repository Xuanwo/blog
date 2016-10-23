---
title: POJ 1833 排列
date: 2014-08-12 05:12:00
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1833

# 理解
再次使用`next_permutation`水题。不过G++会超时，C++400ms+。

<!-- more -->

# 代码

```
#include <iostream>
#include <algorithm>
#include <cstdio>
using namespace std;

#define MAX 1034
int ans[MAX];

int main(int argc, char const *argv[])
{
    int nCases;
    int num, k, i, j;
    scanf("%d", &nCases);
    while (nCases--)
    {
        scanf("%d %d", &num, &k);
        for (i = 1; i <= num; ++i)
            scanf("%d", &ans[i]);
        for (i = 0; i < k; ++i)
            next_permutation(ans + 1, ans + num + 1);

        for (j = 1; j <= num; ++j)
            printf("%d ", ans[j]);
        printf("\n");
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。