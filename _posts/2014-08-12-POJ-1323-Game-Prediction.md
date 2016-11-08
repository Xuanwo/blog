---
layout: post
title: POJ 1323 Game Prediction
date: 2014-08-12 04:19:00
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1323

# 理解
最优的方法是出一张比你出的牌大的牌中最小的牌，不过没有严格证明= =。

<!-- more -->

# 代码

```
#include <iostream>
#include <cstdio>
#include <algorithm>
#include <string.h>
using namespace std;
const int maxn = 1001;

int vis[maxn], a[maxn];
int n, m;

int main(int argc, char const *argv[])
{
    int t = 0;
    while (cin >> n >> m)
    {
        if (m == 0 && n == 0) break;
        t++;
        memset(vis, 0, sizeof(vis));
        for (int i = 1; i <= m; i++)
        {
            cin >> a[i];
            vis[a[i]] = 1;
        }
        sort(a + 1, a + m + 1);
        bool flag;
        int j = 1;
        int amount = 0;
        for (int i = 1; i <= m; i++)
        {
            flag = false;
            for (; j <= n * m; j++)
            {
                if (!vis[j] && j > a[i])
                {
                    flag = true;
                    j++;
                    break;
                }
            }
            if (flag) amount++;
        }
        printf("Case %d: %d\n", t, m - amount);
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。