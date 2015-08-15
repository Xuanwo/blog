title: POJ 3048 Max Factor
date: 2014-07-18 0:23:10
tags: [ACM, POJ, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3307

# 理解
如果一个数可以通过其他数的各数字位相乘得到，则说这个数具有`productivity property`。要求求出第i个具有这种性质的数。我们考虑1～9这些数字，显然，我们只要考虑1，2，3，5，7这四个质因数，因为别的数都能通过他们来得到，于是可以得到代码。

<!-- more -->

# 代码
```#include <iostream>
#include <cstdio>
#define MAX 80000
using namespace std;
__int64 s[MAX];
__int64 d2[MAX];
__int64 d3[MAX];
__int64 d5[MAX];
__int64 d7[MAX];

void init()
{
    int i;
    int pos2, pos3, pos5, pos7;
    __int64 a, b;
    s[1] = 1;
    pos2 = pos3 = pos5 = pos7 = 1;
    for (i = 1; i < MAX - 1; i++)
    {
        d2[i] = s[i] * 2;
        d3[i] = s[i] * 3;
        d5[i] = s[i] * 5;
        d7[i] = s[i] * 7;
        while (d2[pos2] <= s[i])pos2++;
        while (d3[pos3] <= s[i])pos3++;
        while (d5[pos5] <= s[i])pos5++;
        while (d7[pos7] <= s[i])pos7++;
        a = d2[pos2] < d3[pos3] ? d2[pos2] : d3[pos3];
        b = d5[pos5] < d7[pos7] ? d5[pos5] : d7[pos7];
        s[i + 1] = a < b ? a : b;
    }
}

int main(int argc, char const *argv[])
{
    int k, n;
    scanf("%d", &k);
    init();
    while (k--)
    {
        scanf("%d", &n);
        printf("%I64d\n", s[n]);
    }
    return 0;
}
```
# 更新日志
- 2014年07月18日 已AC。