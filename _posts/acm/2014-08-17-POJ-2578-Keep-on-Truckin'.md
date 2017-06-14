---
layout: post
title: POJ 2578 Keep on Truckin'
date: 2014-08-17 16:24:37
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=2578

# 理解
给三个数字，从左到右，看哪个数字先大于168，直到得到一个大于168的数，之前的数全都输出"Crash"。

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
    int a, b, c;

    while (scanf("%d%d%d", &a, &b, &c) != EOF)
    {
        if (a <= 168)
        {
            printf("CRASH %d\n", a);
        }
        else if (b <= 168)
        {
            printf("CRASH %d\n", b);
        }
        else if (c <= 168)
        {
            printf("CRASH %d\n", c);
        }
        else
        {
            printf("NO CRASH\n");
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月17日 已AC。