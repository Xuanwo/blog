---
layout: post
title: POJ 3086 Triangular Sums
date: 2014-08-21 10:06:22
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=3086

# 理解
三角数求和，打表输出。

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


int T[310];
int W[310];

void init()
{
    int i, j;

    memset(W, 0, sizeof(W));
    T[1] = 1;
    for (i = 2; i <= 304; i++)
    {
        T[i] = T[i - 1] + i;
    }
    W[1] = T[2];
    for (i = 2; i <= 303; i++)
    {
        W[i] = W[i - 1] + i * T[i + 1];
    }
}

int main(int argc, char const *argv[])
{
    int ii, casenum;
    int n;

    init();
    scanf("%d", &casenum);
    for (ii = 1; ii <= casenum; ii++)
    {
        scanf("%d", &n);
        printf("%d %d %d\n", ii, n, W[n]);
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。