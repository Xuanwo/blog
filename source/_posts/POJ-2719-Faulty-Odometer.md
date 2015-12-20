---
title: POJ 2719 Faulty Odometer
date: 2014-08-18 22:01:00
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2719

# 理解
一语惊醒梦中人啊- -，九进制就OK。

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

int main(int argc, char const *argv[])
{
    int n, m, i, mul, a[9];
    while (scanf("%d", &n))
    {
        if (n == 0)
            break;
        m = n;
        memset(a, 0, sizeof(a));
        for (i = 0; n; i++, n /= 10)
        {
            a[i] = n % 10;
            if (a[i] > 4)
                a[i]--;
        }
        mul = a[--i];
        for (; i >= 1; i--)
        {
            mul = mul * 9 + a[i - 1];
        }
        printf("%d: %d\n", m, mul);
    }
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。