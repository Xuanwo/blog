---
title: POJ 3720 Occurrence of Digits
date: 2014-08-18 22:23:53
tags: [ACM, POJ, C, 模拟]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3720

# 理解
给定n，k，求出1/2 , 1/n之间所有分数的循环小数表达式中数字k的出现次数，简单的模拟就行了。

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

int ans[101][10];
bool re[200];

int main(int argc, char const *argv[])
{
    memset(ans, 0, sizeof(ans)) ;
    for (int i = 2 ; i <= 100 ; i++)
    {
        for (int j = 0 ; j < 10 ; j++) ans[i][j] = ans[i - 1][j] ;
        int num = 1, p = 0 ;
        memset(re, 0, sizeof(re)) ;
        re[1] = true ;
        while (num != 0)
        {
            num *= 10 ;
            p = num / i ;
            ans[i][p]++ ;
            if (re[num % i]) break ;
            else
            {
                re[num % i] = true ;
                num %= i ;
            }
        }
    }
    int n, k ;
    while (cin >> n >> k) cout << ans[n][k] << endl ;
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。