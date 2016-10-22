---
layout: post
title: POJ 2390 Bank Interest
date: 2014-08-16 15:15:33
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2390

# 理解
给定年利率，本金和存款年数，求解到期之后的本息和。找自信专用。

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
#define inf (1<<30)
using namespace std;

int main(void)
{
    int r, m, y;
    int i;
    double value, rate;
    while (scanf("%d%d%d", &r, &m , &y) != EOF)
    {
        rate = 1 + (double)r / 100.0;
        value = m;
        for (i = 0; i < y; i++)
        {
            value *= rate;
        }
        printf("%d\n", (int)value);
    }
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。