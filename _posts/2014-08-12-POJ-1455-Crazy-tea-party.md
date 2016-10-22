---
layout: post
title: POJ 1455 Crazy tea party
date: 2014-08-12 04:37:00
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1455

# 理解
把n分成两部分，分别排序。唉= =，不机智了。。

<!-- more -->

# 代码

```
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <string.h>
using namespace std;

int main(int argc, char const *argv[])
{
    int ncases, n, times;
    cin >> ncases;
    while ( ncases-- )
    {
        cin >> n;
        times = n / 2 * (n / 2 - 1) / 2 + (n - n / 2) * (n - n / 2 - 1) / 2;
        cout << times;
        if ( ncases )
            cout << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。