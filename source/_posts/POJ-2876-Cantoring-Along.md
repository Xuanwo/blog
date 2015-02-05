title: POJ 2876 Cantoring Along
date: 2014-08-18 23:19:45
tags: [ACM, POJ, C, ]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2876

# 理解
按照指定格式输出字符串，递归求解。

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

int n;
char str[600000];
inline void solve(int x, int y)
{
    if (x == y) return;
    for (int i = x + (y - x + 1) / 3; i <= x + (y - x + 1) / 3 * 2 - 1; i++)
        str[i] = ' ';
    solve(x, x + (y - x + 1) / 3 - 1);
    solve(x + (y - x + 1) / 3 * 2, y);
}

int main(int argc, char const *argv[])
{
    while (scanf("%d", &n) + 1)
    {
        int res = 1;
        for (int i = 1; i <= n; i++)
            res *= 3;
        n = res;
        for (int i = 1; i <= n; i++)
            str[i] = '-';
        solve(1, n);
        str[n + 1] = '\0';
        puts(str + 1);
    }
    return 0;
}
```

# 更新日志
- 2014年08月18日 已AC。