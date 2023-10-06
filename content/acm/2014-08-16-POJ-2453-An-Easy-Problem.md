---
categories: Code
date: 2014-08-16T23:36:24Z
title: POJ 2453 An Easy Problem
toc: true
url: /2014/08/16/POJ-2453-An-Easy-Problem/
---

## 题目
源地址：

http://poj.org/problem?id=2453

# 理解
位运算碉堡了，着实强大。

<!--more-->

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

int main(int argc, char const *argv[])
{
    int n, x;
    while (scanf("%d", &n), n)
    {
        x = n & -n;
        printf("%d\n", n + x + (n ^ n + x) / x / 4);
    }
}

```

# 更新日志
- 2014年08月16日 已AC。