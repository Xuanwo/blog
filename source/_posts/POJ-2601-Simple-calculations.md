title: POJ 2601 Simple calculations
date: 2014-08-17 23:49:14
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2601

# 理解
推公式。满眼都是泪，不多说了= =。

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
    int i, n; double x, y, c, sum;
    while (cin >> n)
    {
        sum = 0;
        cin >> x >> y;
        for (i = 1; i <= n; i++)
        {
            cin >> c;
            sum += 2 * (n + 1 - i) * c;
        }
        sum = (n * x + y - sum) / (n + 1);
        printf("%.2f\n", sum);
    }
    return 0;
}
```

# 更新日志
- 2014年08月17日 已AC。