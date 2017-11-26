---
categories: Exercise
date: 2014-08-06T14:06:00Z
title: POJ 2017 Speed Limit
toc: true
url: /2014/08/06/POJ-2017-Speed-Limit/
---

## 题目
源地址：

http://poj.org/problem?id=2017

# 理解
一道比较简单的模拟，跨项累加。

<!--more-->

# 代码

```
#include <iostream>
#include <cstdio>

using namespace std;

int main(int argc, char const *argv[])
{
    int n;
    while (scanf("%d", &n) != EOF, n != -1)
    {
        int t1 = 0, t2 = 0, v = 0;
        int sumLen = 0;
        int i;
        for (i = 0; i < n; ++i)
        {
            t1 = t2;
            scanf("%d%d", &v, &t2);
            sumLen += (t2 - t1) * v;
        }
        printf("%d miles\n", sumLen);
    }
    return 0;
}

```

# 更新日志
- 2014年08月06日 已AC。