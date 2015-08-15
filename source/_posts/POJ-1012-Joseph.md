title: POJ 1012 Joseph
date: 2014-07-16 14:22:30
tags: [ACM, POJ, C, 简单计算, 打表]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1012

# 理解
用模拟的方法貌似会超时。直接打了一个表，求出0到14之间每一种k的值对应的m值，再根据输入输出就OK。

<!-- more -->

# 代码
```#include <iostream>
using namespace std;

int r[14];
int i, j, k;

bool solve(int k, int i)
{
    int n = k * 2, m = i, x = 0;
    while (n > k)
    {
        x = (x + m - 1) % n;
        if (x < k) return false;
        n--;
    }
    return true;
}

int main()
{
    for (k = 1; k < 14; k++)
    {
        for (i = k + 1;; i += k + 1)
        {
            if (solve(k, i))
            {
                r[k] = i;
                break;
            }
            else if (solve(k, i + 1))
            {
                r[k] = i + 1;
                break;
            }
        }
    }

    while (cin >> k, k)
    {
        cout << r[k] << endl;
    }
    return 0;
}
```
# 更新日志
- 2014年07月16日 已AC。