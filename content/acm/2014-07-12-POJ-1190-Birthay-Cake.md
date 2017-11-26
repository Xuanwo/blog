---
categories: Exercise
date: 2014-07-12T20:48:21Z
title: POJ 1190 生日蛋糕
toc: true
url: /2014/07/12/POJ-1190-Birthay-Cake/
---

## 题目
源地址：

http://poj.org/problem?id=1190

# 理解
这道题是学长推荐的DFS练习题，一开始没有想明白，为什么这道题是DFS。多次推导之后发现，这道题确实需要用到深度搜索。每次都先确定第一层蛋糕的体积数，然后减去得到剩余的蛋糕体积，如此循坏，最后要保证最后的体积和等于给定的N。因为半径是递增的，所以可以去掉很大一部分无效的搜索。

<!--more-->

# 代码

```

#include <cstdio>
#include <cmath>
using namespace std;

int N, S, M;
int end, min;

int dfs(int v, int m, int lastr, int lasth)
{
    if (m == 0)
    {
        if (v > 0 || v < 0)
            return 0;
        else
        {
            end = 1;
            if (min < S)
                S = min;
            return 0;
        }
    }
    int i, t = 0, j, k, temp;
    for (i = 1; i <= m; i++)
        t += i * i * i;
    if (v < t)
        return 0;
    t -= m * m * m;
    int maxr, maxh;
    maxr = (int)sqrt((v - t) * 1.0 / m) < lastr ? (int)sqrt((v - t) * 1.0 / m) : lastr;
    for (i = maxr; i >= m; i--)
    {
        maxh = (v - t) / (i * i) < lasth ? (v - t) / (i * i) : lasth;
        for (j = maxh; j >= m; j--)
        {
            temp = 0;
            for (k = 0; k <= m - 1; k++)
                temp += (i - k) * (i - k) * (j - k);
            if (v > temp)
                break;
            int tempv = v - i * i * j;
            if (m == M)
            {
                if (i * i < S)
                    min = i * i;
                else
                {
                    tempv = v;
                    continue;
                }
            }
            min += 2 * i * j;
            if (min > S)
            {
                tempv = v;
                min -= 2 * i * j;
                continue;
            }
            dfs(tempv, m - 1, i - 1, j - 1);
            min -= 2 * i * j;
        }
    }
    return 0;
}


int main(int argc, char const *argv[])
{
    while (scanf("%d%d", &N, &M) == 2)
    {
        int t = 0;
        end = 0;
        S = 100000;
        dfs(N, M, 1000, 1000);
        if (!end)
            S = 0;
        printf("%d\n", S);
    }
    return 0;
}

```

# 更新日志
- 2014年07月12日 已AC。