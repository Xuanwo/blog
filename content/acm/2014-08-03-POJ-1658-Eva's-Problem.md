---
categories: Code
date: 2014-08-03T12:19:40Z
title: POJ 1658 Eva's Problem
toc: true
url: /2014/08/03/POJ-1658-Eva's-Problem/
---

## 题目
源地址：

http://poj.org/problem?id=1658

# 理解
额，水题一枚，直接算就好

<!--more-->

# 代码

```

#include <cstdio>
using namespace std;

int main(int argc, char const *argv[])
{
    int nCase;
    scanf("%d", &nCase);
    while (nCase--)
    {
        int a, b, c, d, e;
        scanf("%d%d%d%d", &a, &b, &c, &d);
        if (b - a == c - b && c - b == d - c)e = d + d - c;
        else e = d * d / c;
        printf("%d %d %d %d %d\n", a, b, c, d, e);
    }
    return 0;
}

```

# 更新日志
- 2014年08月03日 已AC。