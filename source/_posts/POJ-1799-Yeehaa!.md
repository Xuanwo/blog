---
title: POJ 1799 Yeehaa!
date: 2014-08-05 16:13:00
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1799

# 理解
借用某大神图：
![POJ1799示意图](/imgs/exercise/POJ1799.png)

<!-- more -->

# 代码

```
#include <iostream>
#include <cmath>
#include <cstdio>
using namespace std;

const double pi = acos(-1.0);

int main(int argc, char const *argv[])
{
    int t;
    double R;
    int n, cas = 1;
    cin >> t;
    while (t--)
    {
        cin >> R >> n;
        double m = sin(pi / (double)n);
        printf("Scenario #%d:\n%.3f\n", cas++, m * R / (m + 1));
        if (t) cout << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月05日 已AC。