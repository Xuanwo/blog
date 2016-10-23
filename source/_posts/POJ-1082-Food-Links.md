---
title: POJ 1082 食物链
date: 2014-07-22 02:43:08
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1082

# 理解
理解时候的困难在于如何把题目中吃与被吃的关系用一个计算机能理解的方式表达出来。后来使用了0表示他们是同类，用1表示a吃b，用2表示b吃a。再使用并查集的相关知识得到最后得结果。

<!-- more -->

# 代码

```
#include <iostream>
#include <cstdio>
using namespace std;
const int Max = 50005;

int n, pa[Max], rank[Max];

void make_set()
{
    for (int x = 1; x <= n; x ++)
    {
        pa[x] = x;
        rank[x] = 0;
    }
}

int find_set(int x)
{
    int tmp = pa[x];
    if (x != pa[x])
    {
        pa[x] = find_set(pa[x]);
        rank[x] = (rank[x] + rank[tmp]) % 3;
    }
    return pa[x];
}

void union_set(int x, int y, int w)
{
    int a = find_set(x);
    int b = find_set(y);
    pa[b] = a;
    rank[b] = (rank[x] - rank[y] + w + 3) % 3;
}

int main()
{
    int t, ans = 0;
    scanf("%d %d", &n, &t);
    make_set();
    while (t --)
    {
        int d, x, y;
        scanf("%d %d %d", &d, &x, &y);
        if (x > n || y > n) ans ++;
        else
        {
            if (d == 1)
            {
                if (find_set(x) == find_set(y) && rank[x] != rank[y]) ans ++;
                else union_set(x, y, 0);
            }
            if (d == 2)
            {
                if (find_set(x) == find_set(y) && (rank[x] + 1) % 3 != rank[y]) ans ++;
                else union_set(x, y, 1);
            }
        }
    }
    printf("%d\n", ans);
    return 0;
}

```

# 更新日志
- 2014年07月22日 已AC。