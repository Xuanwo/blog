---
title: POJ 1862 Stripies
date: 2014-08-05 20:31:00
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1862

# 理解
原先质量越大的，如果越先被计算，那么开根号的次数就会越多，相比之下，最终结果就会越小。最后再排一下序就好。

<!-- more -->

# 代码

```
#include <stdio.h>
#include <string.h>
#include <iostream>
#include <math.h>
#include <algorithm>
using namespace std;

int a[110];

bool cmp(int a, int b)
{
    return a > b;
}

int main(int argc, char const *argv[])
{
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++)
        scanf("%d", &a[i]);
    sort(a, a + n, cmp);
    double ans = a[0];
    for (int i = 1; i < n; i++)
    {
        ans = 2 * sqrt(ans * a[i]);
    }
    printf("%.3f\n", ans);
    return 0;
}

```

# 更新日志
- 2014年08月05日 已AC。