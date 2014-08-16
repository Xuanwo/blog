title: POJ 2262 Goldbach's Conjecture
date: 2014-08-16 14:46:12
tags: [ACM, POJ, C/C++, 简单数学]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2262

# 理解
给定大于6的偶数X，求满足X=a+b且|a-b|最大的那对，直接暴力做，事实上，找到的第一对就是满足条件的那对。

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
#define inf (1<<30)
using namespace std;

int s[500020];
int flag[1000002] = {0};
void init()
{
    int k = 1;
    for (int i = 2; i <= 1000000; i += 2)
        flag[k] = 1;
    for (int i = 3; i <= 1000000; i += 2)
    {
        if (!flag[i])
        {
            s[k++] = i;
            for (int j = 2 * i; j <= 1000000; j += i)
                flag[j] = 1;
        }
    }
}

int main(int argc, char const *argv[])
{
    init();
    long n, i;
    while (scanf("%ld", &n), n)
    {
        if (n % 2 == 1)
            continue;
        long long p = n / 2 + 1;
        for (i = 1; s[i] <= p; i++)
        {
            int k = n - s[i];
            if (!flag[k])
            {
                printf("%ld = %d + %d\n", n, s[i], k);
                break;
            }
        }
        if (i > p)
            printf("Goldbach's conjecture is wrong.\n");
    }
    return 0;
}
```

# 更新日志
- 2014年08月16日 已AC。