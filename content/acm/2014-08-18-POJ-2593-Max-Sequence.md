---
categories: Code
date: 2014-08-18T22:30:24Z
title: POJ 2593 Max Sequence
toc: true
url: /2014/08/18/POJ-2593-Max-Sequence/
---

## 题目
源地址：

http://poj.org/problem?id=2593

# 理解
贪心法求最大最序列和，但是注意下时间。

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
#define inf (1<<28)
using namespace std;


int data[100000], dp[100000];
int main(int argc, char const *argv[])
{
    int n;
    while (scanf("%d", &n) != EOF)
    {
        if (!n)
            break;
        int sum = 0, tmp = -999999999;
        for (int i = 0; i < n; i++)
        {
            scanf("%d", &data[i]);
            sum += data[i];
            if (sum > tmp)
                tmp = sum;
            dp[i] = tmp;
            if (sum < 0)
                sum = 0;
        }
        sum = 0;
        int ans = -999999999;
        for (int i = n - 1; i > 0; i--)
        {
            sum += data[i];
            if (dp[i - 1] + sum > ans)
                ans = dp[i - 1] + sum;
            if (sum < 0)
                sum = 0;
        }
        printf("%d\n", ans);
    }
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。