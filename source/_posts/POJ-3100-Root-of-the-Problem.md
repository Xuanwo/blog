---
title: POJ 3100 Root of the Problem
date: 2014-08-21 18:36:21
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3100

# 理解
给定B，N，求出，最接近B的N次方根的整数。

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
    double b, n, temp;
    while ( cin >> b >> n && b && n )
    {
        temp = pow(b, 1 / n);
        int x = (int)temp;
        int y = (int)(temp + 0.5);
        if ( b - pow(x, n) > pow(y, n) - b )
            cout << y << endl;
        else
            cout << x << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。