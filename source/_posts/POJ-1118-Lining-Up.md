title: POJ 1118 Lining Up
date: 2014-08-17 16:47:52
tags: [ACM, POJ, C, 几何]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1118

# 理解
暴力过，求出所有点的斜率并存在一个数组中，再进行比较。

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


int aid[1000][2];
float xielv[1000];

int main(int argc, char const *argv[])
{
    int i, j, k;
    int max, tmp;
    int n;

    while (scanf("%d", &n), n != 0)
    {
        memset(aid, 0, sizeof(aid));
        for (i = 0; i < n; i++)
        {
            scanf("%d%d", &aid[i][0], &aid[i][1]);
        }
        max = 2;
        for (i = 0; i < n - 1; i++)
        {
            for (j = i + 1, k = 0; j < n; j++)
            {
                if (aid[j][0] == aid[i][0])
                {
                    xielv[k++] = 32767;
                }
                else
                {
                    xielv[k++] = (float)(aid[j][1] - aid[i][1]) / (float)(aid[j][0] - aid[i][0]);
                }
            }
            sort(xielv, xielv + k);
            for (j = 1, tmp = 2; j <= k; j++)
            {
                if (xielv[j] == xielv[j - 1])
                {
                    tmp ++;
                    if (tmp > max)
                    {
                        max = tmp;
                    }
                }
                else
                {
                    tmp = 2;
                }
            }
        }
        printf("%d\n", max);
    }
    return 0;
}
```

# 更新日志
- 2014年08月17日 已AC。