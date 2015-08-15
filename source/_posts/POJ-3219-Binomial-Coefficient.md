title: POJ 3219 二项式系数
date: 2014-08-18 22:18:58
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3219

# 理解
跪拜大神的神思路，还有二进制的神奇用法。
> 
C(n,k)(k<=n)的奇偶性取决于(n-k)与k的二进制表达式是否存在同一位上的两个数码均为1，若存在，则为偶数，反之为奇数。

<!-- more -->

# 代码
```#include <cstdio>
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
    int n, k;
    while (~scanf("%d%d", &n, &k))
    {
        printf("%d\n", k & (n - k) ? 0 : 1);
    }
    return 0;
}
```
# 更新日志
- 2014年08月18日 已AC。