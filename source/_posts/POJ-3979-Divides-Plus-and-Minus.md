title: POJ 3979 分数加减法
date: 2014-08-21 23:37:02
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3979

# 理解
简单的分数问题，注意上下约分。

<!-- more -->

# 代码
```#include <cstdio>
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

int gcd(int a, int b)
{
    if (b == 0)  return a;
    return gcd(b, a % b);
}

int lcm(int a, int b)
{
    int c = gcd(a, b);
    return a * b / c;
}

int main(int argc, char const *argv[])
{
    int a, b, c, d;
    char ch;
    while (scanf("%d/%d%c%d/%d", &a, &b, &ch, &c, &d) != EOF)
    {
        int m = lcm(b, d);
        int n;
        if (ch == '+')   n = a * (m / b) + c * (m / d);
        else   n = a * (m / b) - c * (m / d);
        if (n == 0) printf("0\n");
        else
        {
            int t = gcd(m, n);
            n = n / t; m = m / t;
            if (m < 0)  m = -m, n = -n;
            if (m == 1) printf("%d\n", n);
            else
                printf("%d/%d\n", n, m);
        }
    }
    return 0;
}
```
# 更新日志
- 2014年08月21日 已AC。