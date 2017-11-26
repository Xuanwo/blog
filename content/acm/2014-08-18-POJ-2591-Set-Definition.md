---
categories: Exercise
date: 2014-08-18T22:35:08Z
title: POJ 2591 Set Definition
toc: true
url: /2014/08/18/POJ-2591-Set-Definition/
---

## 题目
源地址：

http://poj.org/problem?id=2591

# 理解
运用了递归的思想，不过没有另外使用函数来调用。

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

#define SIZE 10000010
#define MIN(a, b) (a < b ? a : b)

long a[SIZE];

int main(int argc, char const *argv[])
{
    long i2, i3;
    i2 = i3 = 1;
    a[1] = 1;
    for (long i = 2; i < SIZE; i++)
    {
        a[i] = MIN(2 * a[i2] + 1, 3 * a[i3] + 1);
        if (a[i] == 2 * a[i2] + 1) i2++;
        if (a[i] == 3 * a[i3] + 1) i3++;
    }
    long t;
    while (EOF != scanf("%ld", &t))
        printf("%ld\n", a[t]);
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。