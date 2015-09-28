title: POJ 2080 Calendar
date: 2014-08-06 14:44:00
tags: [ACM, POJ, C, 模拟]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2080

# 理解
完全的模拟题。将给定的天数转化为年月日，注意闰年，大小月。

<!-- more -->

# 代码

```
#include <stdio.h>
using namespace std;

char week[7][10] = {"Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
int year[2] = {365, 366};
int month[2][12] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

int type(int m)
{
    if ((m % 4 == 0 && m % 100 != 0) || (m % 400 == 0))return 1; else return 0;
}

int main(int argc, char const *argv[])
{
    int days, dayofweek;
    int i = 0, j = 0;
    while (scanf("%d", &days) && days != -1)
    {
        dayofweek = days % 7;
        for (i = 2000; days >= year[type(i)]; i++)
            days -= year[type(i)];
        for (j = 0; days >= month[type(i)][j]; j++)
            days -= month[type(i)][j];
        printf("%d-%02d-%02d %s\n", i, j + 1, days + 1, week[dayofweek]);
    }
}

```

# 更新日志
- 2014年08月06日 已AC。