---
title: POJ 1050 To the Max
date: 2014-10-7 23:41:26
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1050

# 理解
题意不难理解，在一个矩阵中寻找一个和最大的子矩阵，可以看作是一个二维的DP问题。不过受到时间的限制，太过暴力的程序显然是不行的，所以现在的问题在于，如何把一个二维的问题转化为一个一维的问题。小脑一动，我们可以想到可以将把矩阵的高度压缩为1之后，在进行一次简单的求最大子序列和就可以实现了。

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
#include <stack>
#include <queue>
#include <numeric>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

//#define LOCAL
#define MAXN 102

int n, a[MAXN][MAXN];
int tmp[MAXN];
int maxALL, maxONE;

void init()
{
    scanf("%d", &n);
    memset(tmp, 0, sizeof(tmp));
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < n; j++)
        {
            scanf("%d", &a[i][j]);
        }
    }
}

int dp(int *arr, int n)
{
    int max = 0, x = 0;
    for (int i = 0; i < n; i++)
    {
        if (x < 0) x = arr[i];
        else
        {
            x += arr[i];
            if (x > max)   max = x;
        }
    }
    return max;
}

int main(int argc, char const *argv[])
{
#ifdef LOCAL
    freopen("1050.in", "r", stdin);
    //freopen(".out", "w", stdout);
#endif
    init();
    for (int i = 0; i < n; i++)
    {
        memset(tmp, 0, sizeof(tmp));
        for (int j = i; j < n; j++)
        {
            for (int k = 0; k < n; k++)    tmp[k] += a[j][k];
            maxONE = dp(tmp, n);
            if (maxONE > maxALL)   maxALL = maxONE;
        }
    }
    cout << maxALL << endl;
    return 0;
}

```

# 更新日志
- 2014年10月07日 已AC，因为freopen忘了改WA了一发。