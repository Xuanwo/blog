title: POJ 1269 Intersecting Lines
date: 2014-08-12 01:12:00
tags: [ACM, POJ, C/C++, 几何]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1269

# 理解
几何题= =，各种直线方程用起来，代码量有点大。

<!-- more -->

# 代码
```
{% raw %}
#include<cstdio>
#include<cstring>
#include<cmath>
#include<cstdlib>
#include<iostream>
#include<algorithm>
#include<functional>
using namespace std;
#define eps 1e-8
double sqr(double x)
{
    return x * x;
}
struct P
{
    double x, y;
    P(double _x, double _y): x(_x), y(_y) {}
    P() {}
    double dis()
    {
        return sqrt(sqr(x) + sqr(y));
    }
};
struct V
{
    double x, y;
    V(double _x, double _y): x(_x), y(_y) {}
    V(P a, P b): x(b.x - a.x), y(b.y - a.y) {}
    V() {}
    const double dis()
    {
        return sqrt(sqr(x) + sqr(y));
    }
};
P operator+(const P a, const V b)
{
    return P(a.x + b.x, a.y + b.y);
}
V operator*(const double a, const V b)
{
    return V(a * b.x, a * b.y);
}
double operator*(const V a, const V b)
{
    return a.x * b.y - b.x * a.y;
}
P jiao_dian(const V a, V b, const V c, const V CD, const P C)
{
    double d;
    d = b.dis();
    double s1 = a * b, s2 = b * c;
    double k = s1 / (s1 + s2);
    return C + k * CD;
}
bool equal(const double a, const double b)
{
    if (abs(a - b) < eps) return 1; return 0;
}
int n;
int main()
{
    cout << "INTERSECTING LINES OUTPUT" << endl;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        double x1, y1, x2, y2, x3, y3, x4, y4;
        scanf("%lf%lf%lf%lf%lf%lf%lf%lf", &x1, &y1, &x2, &y2, &x3, &y3, &x4, &y4);
        P A = P(x1, y1), B = P(x2, y2), C = P(x3, y3), D = P(x4, y4);
        V AB = V(A, B), AC = V(A, C), AD = V(A, D), CD = V(C, D);
        if (equal((AB * CD), 0))
        {
            if (equal((AC * AD), 0)) cout << "LINE\n";
            else cout << "NONE\n";
        }
        else
        {
            P p = jiao_dian(AC, AB, AD, CD, C);
            cout.setf(ios::fixed);
            cout.precision(2);
            cout << "POINT " << p.x << ' ' << p.y << endl;
        }
    }
    cout << "END OF OUTPUT" << endl;
    return 0;
}

{% endraw %}
```
	
# 更新日志
- 2014年08月12日 已AC。