---
title: POJ 3030 Nasty Hacks
date: 2014-08-21 09:57:23
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3030

# 理解
输入三个数，分别代表不做广告的效果、做广告的效果、做广告的花销，输出决定。

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
    int n, a, b, c;
    cin >> n;
    while (n--)
    {
        cin >> a >> b >> c;
        if (a > b - c)cout << "do not advertise" << endl;
        else if (a == b - c)cout << "does not matter" << endl;
        else cout << "advertise" << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。