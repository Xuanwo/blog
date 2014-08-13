title: POJ 2818 Making Change
date: 2014-07-15 16:50:50
tags: [ACM, POJ, C/C++, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2818

# 理解
感觉很水的一道题，不知道为什么交题的人很少（吐槽一下坑爹的美元换算）。用DFS水掉了，分别从dispenser到pennies来算一遍就OK。我本以为用四个for也能过，但是discuss上面有人说过不了，TLE。有时间我试试看。

<!-- more -->

# 代码
```
#include <iostream>
#include <string>
#include <algorithm>
#include <cstdio>
using namespace std;

const int INF = 10000;

int num[4], tmp[4], result[4];
int total, money;

bool success;

void DFS(int dep, int remained)
{
    if (dep == 4)
    {
        if (remained == 0)
        {
            int sum = tmp[0] + tmp[1] + tmp[2] + tmp[3];
            if (sum < total)
            {
                for (int i = 0; i < 4; i++)
                    result[i] = tmp[i];
                total = sum;
            }
            success = true;
        }
        return;
    }
    for (int j = 0; j <= num[dep]; j++)
    {
        tmp[dep] = j;
        if (dep == 0)
            DFS(dep + 1, remained - 25 * j);
        else if (dep == 1)
            DFS(dep + 1, remained - 10 * j);
        else if (dep == 2)
            DFS(dep + 1, remained - 5 * j);
        else if (dep == 3)
            DFS(dep + 1, remained - j);
    }
}

int main(int argc, char const *argv[])
{
    while (scanf("%d%d%d%d%d", &num[0], &num[1], &num[2], &num[3], &money) && (num[0] || num[1] || num[2] || num[3] || money))
    {
        total = INF;
        success = false;
        DFS(0, money);
        if (success)
            printf("Dispense %d quarters, %d dimes, %d nickels, and %d pennies.\n", result[0], result[1], result[2], result[3]);
        else
            printf("Cannot dispense the desired amount.\n");
    }
    return 0;
}
```

# 更新日志
- 2014年07月15日 已AC。