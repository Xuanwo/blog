title: POJ 3737 UmBasketella
date: 2014-08-18 22:12:24
tags: [ACM, POJ, C, 几何]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3737

# 理解
几何的题目，立体几何的公式用起来。

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
    double s, r, h, v;
    while (scanf("%lf", &s) != EOF)
    {
        r = sqrt(s / pi) / 2;
        h = sqrt((s * s) / (pi * pi * r * r) - 2 * s / pi);
        v = pi * r * r * h / 3;
        printf("%.2f\n%.2f\n%.2f\n", v, h, r);
    }
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。