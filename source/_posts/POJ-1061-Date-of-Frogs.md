---
title: POJ 1061 青蛙的约会
date: 2014-07-23 13:49:00
tags: [ACM, POJ, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1061

# 理解
扩展欧几里德方程的模板体。当初没有做出来，现在好像明白一点了。

<!-- more -->

# 新技能get
`扩展欧几里德方程`解法
>
设标准方程式为： a*x +b*y =d   (a,b已知)
1. 首先求出gcd(a,b) ，然后化简方程，使得a/=gcd(a,b); b/=gcd(a,b); d/=gcd(a,b);
2. 先求出 a*x+b*y=gcd(a,b) 的一组特解，也就是方程 a*x+b*y=1 的一个特解。然后将特解（x0, y0） 代入方程，并变形： a* x0 *d + b* y0 *d= d
3. 根据解系的 公式： x =x1 + b* t ; y =y1 - a *t; 我们首先假设他最小的解x=0 ，然后求出 此时的 t=-x1/b; 然后带入求最小的解x=x1+b*t=x1 - b*t ;因为此时的t为 负数， 减去他的 负数，就是等于加上他。

# 代码

```
#include <iostream>
#include <cmath>
#include <cstdio>
using namespace std;


long long x, y, m, n, l;
long long a, b, d, k, s, t;

long long gcd(long long a, long long b)
{
    long long c;
    if (a < b)
    {
        c = a;    a = b;
        b = c;
    }
    while (b)
    {
        c = b;
        b = a % b;
        a = c;
    }
    return a;
}

long long extended_gcd(long long a, long long b, long long &x, long long &y)
{
    long long ans, t;
    if (b == 0)
    {
        x = 1;    y = 0;
        return a;
    }
    else
    {
        ans = extended_gcd(b, a % b, x, y);
        t = x;    x = y;
        y = t - (a / b) * y;
    }
    return ans;
}

int main(int argc, char const *argv[])
{
    while (scanf("%lld %lld %lld %lld %lld", &x, &y, &m, &n, &l) != EOF)
    {
        a = n - m;
        b = l;
        d = x - y;
        long long r = gcd(a, b);
        if (d % r != 0)
        {
            printf("Impossible\n");
            continue;
        }
        a /= r;
        b /= r;
        d /= r;
        extended_gcd(a, b, s, k);
        s = s * d;
        k = k * d;
        t = s / b;
        s = s - t * b;
        if (s < 0)
            s += b;
        printf("%lld\n", s);
    }
    return 0;
}

```

# 更新日志
- 2014年07月23日 已AC。