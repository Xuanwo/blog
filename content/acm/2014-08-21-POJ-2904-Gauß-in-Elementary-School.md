---
categories: Code
date: 2014-08-21T09:43:27Z
title: POJ 2904 Gauß in Elementary School
toc: true
url: /2014/08/21/POJ-2904-Gauß-in-Elementary-School/
---

## 题目
源地址：

http://poj.org/problem?id=2904

# 理解
求从n到m的所有元素之和。
不过很多人都告诉我POJ上面交用到`long long int`的题必须使用``I64d``，变量类型也必须是`__int64`。但是我用`long long int`和`%lld`也能过啊，是因为POJ更新了么？

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
#define inf (1<<28)
using namespace std;

int main(int argc, char const *argv[])
{
    int ii, casenum;
    long long int n, m, i;
    long long int sum;

    scanf("%d", &casenum);
    for (ii = 1; ii <= casenum; ii++)
    {
        scanf("%lld%lld", &n, &m);
        if (n > m)
        {
            i = m;
            m = n;
            n = i;
        }
        sum = (n + m) * (m - n + 1) / 2;
        printf("Scenario #%d:\n%lld\n\n", ii, sum);
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。