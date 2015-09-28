title: POJ 2249 Binomial Showdown
date: 2014-08-16 14:59:02
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2249

# 理解
求二项式，直接使用二项式定理～

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

int main(int argc, char const *argv[])
{
    long long int n, k;
    while ( scanf("%lld%lld", &n, &k) != EOF && n )
    {
        long long int sum = 1;
        int x = 1;
        if ( k == 0 )
        {
            printf("1\n");
            continue;
        }
        if ( k > n - k )
            k = n - k;
        for (int i = n; i > n - k; i--)
        {
            sum *= i;
            sum /= x;
            x++;
        }
        printf("%lld\n", sum);
    }
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。