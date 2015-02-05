title: POJ 2707 Copier Reduction
date: 2014-08-18 22:05:01
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2707

# 理解
纯英文题，题目读懂就会做，注意int和float的区别。

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

void max(float &a, float &b)
{
    float t;
    if (a < b)
    {
        t = a;
        a = b;
        b = t;
    }
}

int main(int argc, char const *argv[])
{
    while (1)
    {
        float a, b, c, d, i;
        cin >> a >> b >> c >> d;
        if (a == 0 && b == 0 && c == 0 && d == 0)   return   0;
        else
        {
            max(a, b);
            max(c, d);
            for ( i = 100; i > 0; i--)
            {
                if ((a * i / 100 <= c) && (b * i / 100 <= d))    break ;
            }
            cout << i << "%" << endl;
        }
    }
    return  0;
}
```

# 更新日志
- 2014年08月18日 已AC。