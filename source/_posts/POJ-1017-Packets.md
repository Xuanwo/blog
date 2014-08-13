title: POJ 1017 Packets
date: 2014-07-13 16:42:02
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1017

# 理解
在COJ上有一道一模一样的题目，当时做的时候没有做出来，因为没有考虑好剩余空间的利用。6*6和1*1的情况最为简单，但是其余的情况就分情况考虑了，特别是对于3*3这种情况而言，因为一个箱子正好可以装4个3*3的产品。

<!-- more -->

# 代码
```
#include <iostream>
using namespace std;

int main(int argc, char const *argv[])
{
    int n, a, b, c, d, e, f, x, y;
    int u[4] = {0, 5, 3, 1};
    while (cin >> a >> b >> c >> d >> e >> f && (a != 0 || b != 0 || c != 0 || d != 0 || e != 0 || f != 0))
    {
        n = f + e + d + (c + 3) / 4;
        y = 5 * d + u[c % 4];
        if (b > y) n += (b - y + 8) / 9;
        x = 36 * n - 36 * f - 25 * e - 16 * d - 9 * c - 4 * b;
        if (a > x) n += (a - x + 35) / 36;
        cout << n << endl;
    }
    return 0;
}
```

# 更新日志
- 2014年07月14日 已AC。