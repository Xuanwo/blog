---
title: Codeforces Beta Round 1 A Theatre Square
date: 2014-10-14 17:00:08
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/contest/1/problem/A

# 理解
大水题一道。
只要求出每一边最大的块数就可以了。
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
#define ll long long int
using namespace std;

ll n, m, a;

void init()
{
    scanf("%I64d%I64d%I64d", &n, &m, &a);
}

int main(int argc, char const *argv[])
{
    init();
    ll x = n % a == 0 ? n / a : n / a + 1;
    ll y = m % a == 0 ? m / a : m / a + 1;
    printf("%I64d", x * y);
    return 0;
}

```

# 更新日志
- 2014年10月14日 已AC。