title: POJ 3224 Lab杯
date: 2014-08-18 22:15:49
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3224

# 理解
直接每行取分，如果是3分就+1，比较出获得3分最多的人，输出号码。

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
    int n;
    int max, maxi, sum, tmp;
    int i, j;

    while (scanf("%d", &n) != EOF)
    {
        for (i = 1, max = -1; i <= n; i++)
        {
            for (j = 1, sum = 0; j <= n; j++)
            {
                scanf("%d", &tmp);
                if (tmp == 3)
                {
                    sum ++;
                }
            }
            if (sum > max)
            {
                max = sum;
                maxi = i;
            }
        }
        printf("%d\n", maxi);
    }
    return 0;
}
```

# 更新日志
- 2014年08月18日 已AC。