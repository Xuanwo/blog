---
categories: Code
date: 2014-08-12T05:03:00Z
title: POJ 1611 The Suspects
toc: true
url: /2014/08/12/POJ-1611-The-Suspects/
---

## 题目
源地址：

http://poj.org/problem?id=1611

# 理解
比较简单的并查集，照着模板敲。

<!--more-->

# 代码

```
#include <stdio.h>
#include <string.h>

const int N = 30005;

int n, m, f[N], s[N];

int getfar(int x)
{
    return x == f[x] ? x : f[x] = getfar(f[x]);
}

void init ()
{
    for (int i = 0; i <= n; i++)
    {
        f[i] = i;
        s[i] = 1;
    }

    int k, a, b;
    for (int i = 0; i < m; i++)
    {
        scanf("%d", &k);

        if (k == 0) continue;

        scanf("%d", &a);
        int p = getfar(a);

        for (int j = 1; j < k; j++)
        {
            scanf("%d", &b);
            int q = getfar(b);

            if (p != q)
            {
                f[q] = p;
                s[p] += s[q];
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    while (scanf("%d%d", &n, &m) == 2 && n + m)
    {
        init ();
        printf("%d\n", s[getfar(0)]);
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。