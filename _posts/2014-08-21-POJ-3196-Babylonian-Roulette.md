---
layout: post
title: POJ 3196 Babylonian Roulette
date: 2014-08-21 20:02:37
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3196

# 理解
好长的题目- -，是一个关于赌博的问题。给你三个数pot，bet，fpot，分别代表初始金额，赌注金额，封盘金额，每次加钱可能是赌注的-1，-2，-3，1，2，3倍，求最少多少次可以到达封盘金额。

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

int main(int argc, char const *argv[])
{
    int pot;
    int bet;
    int fpot;
    while (scanf("%d%d%d", &pot, &bet, &fpot) != -1, pot + bet + fpot)
    {
        if (pot > fpot)pot -= fpot;
        else pot = fpot - pot;
        if (pot % bet != 0)
            printf("No accounting tablet\n");
        else
        {
            pot = pot / bet;
            int ans;
            ans = 0;
            ans += pot / 3; pot %= 3;
            ans += pot / 2, pot %= 2;
            ans += pot;
            printf("%d\n", ans);
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。