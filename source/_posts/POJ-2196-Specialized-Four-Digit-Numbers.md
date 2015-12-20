---
title: POJ 2196 Specialized Four-Digit Numbers
date: 2014-08-16 14:41:33
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2196

# 理解
直接暴力做，逐个判断是不是符合条件。

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

int n, a[17];

void f(int x)
{
    int temp = n;
    while (temp != 0)
    {
        a[x] += temp % x;
        temp /= x;
    }
}

int main()
{
    for (n = 2992; n <= 9999; n++)
    {
        a[16] = a[12] = a[10] = 0;
        f(12); f(16); f(10);
        if (a[16] == a[10] && a[10] == a[12])
            cout << n << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。