title: POJ 1517 u Calculate e
date: 2014-07-25 04:00:19
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1517

# 理解
计算e的值。太自信，没有用打表，结果WA了两发，蛋疼。

<!-- more -->

# 代码
```
#include <iostream>
#include <cstdio>
using namespace std;

double ans = 2.5;
double mulit = 1;

int main(int argc, char const *argv[])
{
    printf("n e\n");
    printf("- -----------\n");
    printf("0 1\n");
    printf("1 2\n");
    printf("2 2.5\n");
    for (int i = 3; i < 10; i++)
    {
        mulit = 1;
        for (double j = 1; j <= i; j++)
        {
            mulit *= j;
        }
        ans += 1 / mulit;
        printf("%d %.9lf\n", i , ans);
    }
    return 0;
}
```

# 更新日志
- 2014年07月25日 已AC。