title: POJ 1781 In Danger
date: 2014-08-15 20:46:00
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1781

# 理解
同样的，打表找规律，发现当n是2的次方幂时，结果都是1；当n不是2的次方幂时，结果是与比n大的最小的2的次方幂的差值的两倍。

<!-- more -->

# 代码
```#include <cstdio>
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

int p[30];

int main(int argc, char const *argv[])
{
    for (int i = 0; i <= 27; i++)
    {
        p[i] = 1 << i;
    }
    char s[10];
    int i;
    while (~scanf("%s", s))
    {
        if (strcmp(s, "00e0") == 0) break;
        int n;
        n = (s[0] - '0') * 10 + s[1] - '0';
        for (i = 1; i <= s[3] - '0'; i++)
            n = n * 10;
        for (i = 0; i <= 27; i++)
            if (p[i] >= n)
                break;
        if (p[i] == n)
            printf("1\n");
        else
            printf("%d\n", (n - p[i - 1]) * 2 + 1);
    }
    return 0;
}
```
# 更新日志
- 2014年08月15日 已AC。