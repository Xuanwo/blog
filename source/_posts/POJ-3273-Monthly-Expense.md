title: POJ 3273 Monthly Expense
date: 2014-07-23 23:44:01
tags: [ACM, POJ, C/C++, 二分]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3273

# 理解
也是很久之前的一道题目，简单的二分。

<!-- more -->

# 代码
```
#include  <stdio.h>
#include  <string.h>
#include  <iostream>
#include  <stdlib.h>

using namespace std;

int f[101000];

int main()
{
    int n, m, i;
    int mid, _max, _min;

    scanf("%d%d", &m, &n);
    _min = 0;
    _max = 0;
    for (i = 0; i < m; i++)
    {
        scanf("%d", &f[i]);
        _max += f[i];
        if (f[i] > _min)
        {
            _min = f[i];
        }
    }

    while (_min < _max)
    {
        mid = (_min + _max) / 2;
        int sum = 0, count = 0;
        for (i = 0; i < m; i++)
        {
            sum += f[i];
            if (sum > mid)
            {
                count++;
                sum = f[i];
            }
        }
        if (count < n)
        {
            _max = mid;
        }
        else
        {
            _min = mid + 1;
        }
    }
    printf("%d\n", _min);
    return 0;
}
```

# 更新日志
- 2014年07月23日 已AC。