title: POJ 3006 Dirichlet's Theorem on Arithmetic Progressions
date: 2014-08-22 18:13:27
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3006

# 理解
筛法打素数表，然后暴力得到这些数字，判断是否为素数，若是则次数times+1,直到得到第n个素数。

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

#define N 1000000

int prime[N];

void init()
{
    int i, j, k;

    for (i = 0; i < N; i++)
    {
        prime[i] = 1;
    }
    prime[0] = 0;
    prime[1] = 0;
    for (i = 0; i < N; i++)
    {
        if (prime[i] != 0)
        {
            for (j = i + i; j < N; j += i)
            {
                prime[j] = 0;
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    int a, d, n;
    int times, i, tmp;

    init();
    while (scanf("%d%d%d", &a, &d, &n), a != 0 || d != 0 || n != 0)
    {
        times = 0;
        for (i = a; i < 1000000 && times != n; i += d)
        {
            if (prime[i] != 0)
            {
                times++;
                tmp = i;
            }
        }
        printf("%d\n", tmp);
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。