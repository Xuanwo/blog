title: POJ 3300 Tour de France
date: 2014-08-22 17:24:38
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3300

# 理解
好多轮子= =。
计算前后轮的齿轮比，再进行排序，找到前一种比后一种最大的那个。

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
#define inf (1<<28)
using namespace std;


int rear[15];
int front[15];
float dratio[300];

int main(int argc, char const *argv[])
{
    int f, r;
    int i, j, k;
    float max, tmp;

    while (scanf("%d", &f), f != 0)
    {
        memset(dratio, 0, sizeof(dratio));
        memset(rear, 0, sizeof(rear));
        memset(front, 0, sizeof(front));
        scanf("%d", &r);
        for (i = 0; i < f; i++)
        {
            scanf("%d", &front[i]);
        }
        for (i = k = 0, max = -1; i < r; i++)
        {
            scanf("%d", &rear[i]);
            for (j = 0; j < f; j++)
            {
                dratio[k++] = (float)rear[i] / (float)front[j];
            }
        }
        sort(dratio, dratio + k);
        max = -1;
        for (i = 0; i < k - 1 ; i++)
        {
            tmp = dratio[i + 1] / dratio[i];
            if (tmp > max)
            {
                max = tmp;
            }
        }
        printf("%.2f\n", max);
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。