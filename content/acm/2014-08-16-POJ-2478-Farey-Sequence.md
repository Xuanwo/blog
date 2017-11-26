---
categories: Exercise
date: 2014-08-16T23:33:37Z
title: POJ 2478 Farey Sequence
toc: true
url: /2014/08/16/POJ-2478-Farey-Sequence/
---

## 题目
源地址：

http://poj.org/problem?id=2478

# 理解
欧拉函数的运用，套用了模板。

<!--more-->

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
#define inf (1<<30)
using namespace std;

#define M 1001000
typedef long long LL;
int vis[M] = {0};
int prime[M / 3], phi[M];
LL sum[M];

void PHI()
{
    int cnt = 0;
    for (int i = 2; i < M; i++)
    {
        if (vis[i] == 0)
        {
            prime[cnt++] = i;
            phi[i] = i - 1;
        }
        for (int j = 0; j < cnt && prime[j]*i < M; j++)
        {
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0)
            {
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }
            else phi[i * prime[j]] = phi[i] * phi[prime[j]];
        }
    }
}

int main()
{
    int n;
    PHI();
    sum[2] = phi[2];
    for (int i = 3; i <= 1000000; i++)
        sum[i] = sum[i - 1] + phi[i];
    while (scanf("%d", &n) && n)
    {
        printf("%lld\n", sum[n]);
    }
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。