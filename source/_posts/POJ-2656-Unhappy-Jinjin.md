---
title: POJ 2656 Unhappy Jinjin
date: 2014-08-17 16:29:05
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2656

# 理解
在我们学校自己的OJ好像做过一样的题目，恩，一道水题，求学习时间最长的一天。

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
    int i, days;
    int max;
    int first, second;
    int flag;

    while (scanf("%d", &days), days != 0)
    {
        max = -1;
        flag = 0;
        for (i = 0; i < days; i++)
        {
            scanf("%d%d", &first, &second);
            if (first + second > 8 && max < first + second)
            {
                flag = i + 1;
                max = first + second;
            }
        }
        printf("%d\n", flag);
    }
    return 0;
}

```

# 更新日志
- 2014年08月17日 已AC。