title: POJ 3372 Candy Distribution
date: 2014-08-15 20:41:15
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3372

# 理解
找规律的题目，照例打表，发现只有2的次方才符合规律。

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

int n;

int main(int argc, char const *argv[])
{
    while (~scanf("%d", &n))
        cout << (n & n - 1 ? "NO" : "YES") <<endl;
    return 0;
}
```

# 更新日志
- 2014年08月15日 已AC。