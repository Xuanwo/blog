---
title: POJ 2459 Feed Accounting
date: 2014-08-22 22:12:13
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2459

# 理解
英文题- -，阅读理解很重要。
>
容我搬运一下大牛的翻译：
就是说有一个人，有F1公斤的草料，需要储存到一个空仓库中，但是不知道要从什么时候开始添加才能够保证，在第D天的时候还剩下F2公斤草料，因为这个人家附近后C头牛出没，他们会来偷吃草料，每头牛来偷吃草料的时间段不一样。如果牛过来吃草料的时候，草料就会少，且每头牛每天吃且仅吃1公斤/天/头。问，如果要保证第D天的时候会剩余下F2公斤草料，需要在哪一天的时候添加这F1公斤草料。

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
#define inf (1<<28)
using namespace std;

int account[2100];

int main(int argc, char const *argv[])
{
    int c, f1, f2, d;
    int day1, day2;
    int i, j, result, tmp;

    while (scanf("%d%d%d%d", &c, &f1, &f2, &d) != EOF)
    {
        memset(account, 0, sizeof(account));
        for (i = 0; i < c; i++)
        {
            scanf("%d%d", &day1, &day2);
            for (j = day1; j <= day2; j++)
            {
                account[j]++;
            }
        }
        tmp = f1 - f2;
        for (i = d; i >= 1 && tmp > 0; i--)
        {
            tmp -= account[i];
        }
        printf("%d\n", i + 1);
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。