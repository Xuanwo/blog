---
categories: Exercise
date: 2014-08-22T22:32:28Z
title: POJ 2109 Power of Cryptography
toc: true
url: /2014/08/22/POJ-2109-Power-of-Cryptography/
---

## 题目
源地址：

http://poj.org/problem?id=2109

# 理解
直接暴力求。

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

int main(int argc, char const *argv[])
{
    double n , m ;
    while ( scanf( "%lf%lf" , &m , &n ) != EOF )
        printf( "%.0f\n" , exp(log(n) / m));
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。