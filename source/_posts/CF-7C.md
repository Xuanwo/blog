title: Codeforces Beta Round 7 C Line
date: 2014-11-19 10:40:15
tags: [ACM, Codeforces, C, 几何]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codeforces.com/problemset/problem/7/C

# 理解
扩展欧几里得算法的模板题。
题意很简单，给定方程Ax + By + C = 0。要求满足该方程的两个整数解x，y。
通过简单的变形之后就可以得到x = x*(-C/gcd(A,B)) ,  y = y*(-C/gcd(A,B))。

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf 0x3f3f3f3f
#define ll long long int
using namespace std;

ll a,b,c,d,x,y;

void ex_gcd(ll a, ll b, ll& d,ll& x, ll& y)
{
    if(!b)
    {
        d=a;
        x=1;
        y=0;
    }
    else
    {
        ex_gcd(b,a%b,d,y,x);
        y -= x*(a/b);
    }
}

int main(int argc, char const *argv[])
{
    cin >> a >> b >> c;
    ex_gcd(a,b,d,x,y);
    if(c%d != 0)
        puts("-1");
    else
        cout << -x*(c/d) << " " << -y*(c/d) << endl;
    return 0;
}
```

# 更新日志
- 2014年11月19日 已AC。