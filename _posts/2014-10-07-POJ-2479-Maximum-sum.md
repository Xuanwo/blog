---
layout: post
title: POJ 2479 Maximum sum
date: 2014-10-7 00:25:21
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=2479

# 理解
因为超时卡了很久，不得不换了一种更加优越的方法。不过有点丑，有机会重写一次吧= =

<!-- more -->

# 代码

```

#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <ctime>
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <deque>
#include <list>
#include <set>
#include <map>
#include <stack>
#include <queue>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

#define LOCAL
#define MAXN 50001

int t, a[MAXN];
int l[MAXN], r[MAXN], dp[MAXN], ans, big;
int  m, i, res, tmp;

void init()
{
    ans = 0, big = 0;
    memset(a, 0, sizeof(a));
    memset(l, 0, sizeof(l));
    memset(r, 0, sizeof(r));
    memset(dp, 0, sizeof(dp));
    scanf("%d", &m);
    for (int i = 0; i < m; i++)    scanf("%d", &a[i]);
}

int main(int argc, char **argv)
{
#ifdef LOCAL
    freopen("2479.in", "r", stdin);
    freopen("2479.out", "w", stdout);
#endif
    scanf("%d", &t);
    while (t--)
    {
        init();
        tmp = 0;
        res = -10001;
        for (i = 0; i < m; ++i)
        {
            tmp += a[i];
            if (tmp > res)
                res = tmp;
            if (tmp < 0)
                tmp = 0;
            l[i] = res;
        }
        res = -10001;
        tmp = 0;
        for (i = m - 1; i >= 0; --i)
        {
            tmp += a[i];
            if (tmp > res)
                res = tmp;
            if (tmp < 0)
                tmp = 0;
            r[i] = res;
        }
        res = l[0] + r[1];
        for (i = 0; i < m - 1; ++i)
        {
            tmp = l[i] + r[i + 1];
            if (tmp > res)
                res = tmp;
        }
        printf ("%d\n", res);
    }

    return 0;
}

```

# 更新日志
- 2014年10月07日 已AC。