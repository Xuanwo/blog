---
categories: Code
date: 2014-08-12T00:45:00Z
title: POJ 1160 Post Office
toc: true
url: /2014/08/12/POJ-1160-Post-Office/
---

## 题目
源地址：

http://poj.org/problem?id=1160

# 理解
很经典的邮局送信的DP问题。
不过提交的时候发现CE，`error: call of overloaded 'abs(int)' is ambiguous`，修改`cmath`为`math.h`之后，发现本机编译失败，添加了`cstdlib`之后，顺利AC。这中间存在两个问题：第一，不是每一个X.h的库都跟cX命名的库一模一样；第二本地缺少的库可以通过编译，但是OJ不一定能通过。

<!--more-->

# 代码

```
#include <iostream>
#include <cstdio>
#include <math.h>
#include <cstring>
#include <cstdlib>
#define INF 1000000000

using namespace std;

int d[305];
int dp[35][305], dis[305][305];
int n, m;

void init()
{
    memset(dis, 0, sizeof(dis));
    for (int i = 1; i <= n; ++i)
        for (int j = i + 1; j <= n; ++j)
        {
            int mid = (i + j) >> 1;
            for (int k = i; k <= j; ++k)
                dis[i][j] += abs(d[k] - d[mid]);
        }
}

void DP()
{
    for (int i = 1; i <= n; ++i)
        dp[1][i] = dis[1][i];
    for (int i = 2; i <= m; ++i)
        for (int j = 1; j <= n; ++j)
            dp[i][j] = INF;
    for (int i = 2; i <= m; i++)
        for (int j = i; j <= n; ++j)
            for (int k = 1; k <= j; ++k)
            {
                if (dp[i][j] > dp[i - 1][k] + dis[k + 1][j])
                    dp[i][j] = dp[i - 1][k] + dis[k + 1][j];
            }
    printf("%d\n", dp[m][n]);
}

int main(int argc, char const *argv[])
{
    while (scanf("%d%d", &n, &m) != EOF)
    {
        for (int i = 1; i <= n; ++i)   scanf("%d", &d[i]);
        init();
        DP();
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。