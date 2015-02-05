title: POJ 2992 Divisors
date: 2014-08-21 09:49:58
tags: [ACM, POJ, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2992

# 理解
题目的意思还是比较简单的：输入C(n,k), 求该数的因数个数。
然后我们又知道（谷歌又知道）：对于任意质数p, n!中有（n/p+n/p^2+n/p^3+...)个质因子p。

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

const int MAX = 450;
int a[MAX], p[MAX], pn;

void prime ()
{
    pn = 0;
    memset(a, 0, sizeof(a));
    int i, j;
    for ( i = 2; i < MAX; i++ )
    {
        if ( a[i] == 0 )
            p[pn++] = i;
        for ( j = 0; j < pn && i * p[j] < MAX && (p[j] <= a[i] || a[i] == 0); j++ )
            a[i * p[j]] = p[j];
    }
}

int count ( int x, int pri )
{
    int ret = 0, tmp = pri;
    while ( x >= tmp )
    {
        ret += x / tmp;
        tmp *= pri;
    }
    return ret;
}

int main(int argc, char const *argv[])
{
    int n, k;
    prime();
    while ( scanf("%d%d", &n, &k) != EOF )
    {
        int a, b, c;
        long long int res = 1;
        for ( int i = 0; i < pn && p[i] <= n; i++ )
        {
            a = count ( n, p[i] );
            b = count ( k, p[i] );
            c = count ( n - k, p[i] );
            res *= ( a - b - c + 1 );
        }
        printf("%lld\n", res );
    }
    return 0;
}
```

# 更新日志
- 2014年08月21日 已AC。