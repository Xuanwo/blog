title: POJ 2229 Sumsets
date: 2014-08-16 15:05:56
tags: [ACM, POJ, C, DP]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2229

# 理解
比较简单的DP：
当n为奇数时，有dp[n] = dp[n-1]
当n为偶数时，可以根据1的存在与否分成两种情况：
1. 有1，则有dp[n]的一部分是dp[n-2]
2. 没有1，则有dp[n]的另一部分是d[n/2]

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

const int M = 1000000000;
const int MAXN = 1000010;

int dp[MAXN];

int main(int argc, char const *argv[])
{
    int n;
    scanf("%d", &n);
    dp[0] = dp[1] = 1;

    for (int i = 2; i <= n; ++i)
        if (i & 0x01)
            dp[i] = dp[i - 1];
        else
            dp[i] = (dp[i - 2] + dp[i >> 1]) % M;

    printf("%d\n", dp[n]);
    return 0;
}
```

# 更新日志
- 2014年08月16日 已AC。