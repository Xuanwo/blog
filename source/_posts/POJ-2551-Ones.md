---
title: POJ 2551 Ones
date: 2014-08-17 16:17:59
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2551

# 理解
将一个数取下来，然后从1对n本身取模（%），之后将取模之后的数字乘以10加1，再取模，直到取模为0。
比如当n=3时，变化的情况是这样的：3->31(余1)->311(余1)->3111(整除)

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
    int num;
    int n;
    int i, j;
    while (scanf("%d", &n) != EOF)
    {
        num = i = 1;
        num %= n;
        for (; num; i++)
        {
            num = num * 10 + 1;
            num %= n;
        }
        printf("%d\n", i);
    }
    return 0;
}

```

# 更新日志
- 2014年08月17日 已AC。