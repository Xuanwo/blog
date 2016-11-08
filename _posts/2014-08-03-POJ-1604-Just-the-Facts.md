---
layout: post
title: POJ 1604 Just the Facts
date: 2014-08-03 12:16:39
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1604

# 理解
只需要截取后面五位，避免超过int的范围

<!-- more -->

# 代码

```
#include<iostream>
#include <cstdio>
#include <cstring>
#include <cmath>
using namespace std;

int s[10005];
int n;

void multiply()
{
    int i , j;
    memset(s, 0, sizeof(s));
    s[1] = 1;
    j = 1;
    for (i = 2; i <= 10000; i++)
    {
        j *= i;
        while (j % 10 == 0)
            j /= 10;
        j %= 100000;
        s[i] = j % 10;
    }
}

int main(int argc, char const *argv[])
{
    multiply();
    while (cin >> n)
    {
        printf("%5d", n);
        cout << " -> " << s[n] << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月03日 已AC。