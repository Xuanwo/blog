title: POJ 2909 Goldbach's Conjecture
date: 2014-08-21 09:40:06
tags: [ACM, POJ, C/C++, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2909

# 理解
筛法打素数表，用来验证哥德巴赫猜想。

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

const int MAXP = 400000;
bool isPrime[MAXP];
int prime[MAXP];
void primeList()
{
    memset(isPrime, true, sizeof(isPrime));
    for (int i = 2; i <= MAXP; ++i)
    {
        if (isPrime[i])  prime[++prime[0]] = i;
        for (int j = 1, k; (k = i * prime[j]) <= MAXP && j <= MAXP; ++j)
        {
            isPrime[k] = false;
            if (i % prime[j] == 0)   break;
        }
    }
}

int main(int argc, char const *argv[])
{
    primeList();
    int n, ans;
    while (scanf("%d", &n) && n != 0)
    {
        ans = 0;
        for (int i = 1; prime[i] <= n / 2; ++i)
        {
            if (isPrime[n - prime[i]])
                ++ans;
        }
        printf("%d\n", ans);
    }
    return 0;
}
```

# 更新日志
- 2014年08月21日 已AC。