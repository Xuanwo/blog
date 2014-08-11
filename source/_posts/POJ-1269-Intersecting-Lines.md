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
#include <queue>
#include <stack>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <limits.h>
#include <string.h>
#include <algorithm>
using namespace std;
const double eps = 1e-6;

struct point
{
    double x, y;
};

struct line
{
    point a, b;
};

bool dy(double x, double y)
{
    return x > y + eps;
}

bool xy(double x, double y)
{
    return x < y - eps; 
}

bool dyd(double x, double y)
{
    return x > y - eps;
}

bool xyd(double x, double y)
{
    return x < y + eps;
}

bool dd(double x, double y)
{
    return fabs( x - y ) < eps;
}

double crossProduct(point a, point b, point c)
{
    return (c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y);
}

bool parallel(line u, line v)
{
    return dd( (u.a.x - u.b.x) * (v.a.y - v.b.y) - (v.a.x - v.b.x) * (u.a.y - u.b.y), 0.0 );
}

point intersection(line u, line v)
{
    point ans = u.a;
    double t = ((u.a.x - v.a.x) * (v.a.y - v.b.y) - (u.a.y - v.a.y) * (v.a.x - v.b.x)) /
               ((u.a.x - u.b.x) * (v.a.y - v.b.y) - (u.a.y - u.b.y) * (v.a.x - v.b.x));
    ans.x += (u.b.x - u.a.x) * t;
    ans.y += (u.b.y - u.a.y) * t;
    return ans;
}

int main(int argc, char const *argv[])
{
    int n;
    line u, v;
    int flag = 0;
    while ( ~scanf("%d", &n) )
    {
        printf("INTERSECTING LINES OUTPUT/n");
        while ( n-- )
        {
            scanf("%lf %lf %lf %lf", &u.a.x, &u.a.y, &u.b.x, &u.b.y);
            scanf("%lf %lf %lf %lf", &v.a.x, &v.a.y, &v.b.x, &v.b.y);
            if ( parallel(u, v) )
                if ( dd(crossProduct(u.a, u.b, v.a), 0.0) )
                    printf("LINE/n");
                else
                    printf("NONE/n");
            else
            {
                point ans = intersection(u, v);
                printf("POINT %.2lf %.2lf/n", ans.x, ans.y);
            }
        }
        printf("END OF OUTPUT/n");
    }
    return 0;
}
{% endraw %}
```
	
# 更新日志
- 2014年08月12日 已AC。