title: POJ 2470 Ambiguous permutations
date: 2014-08-22 22:09:08
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=

# 理解
对于一个有N个元素的队列，队列元素为[1,2,...,N-1,N]，进行一次队列变换，当前队列“数字i的位置”将成为变换后队列的第i个元素的值（下标从1开始）。

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


int arr[110000];
int end[110000];

int change(int arr[], int n)
{
    int i, j;
    int flag = 1;

    for (i = 1; i <= n; i++)
    {
        end[arr[i]] = i;
    }
    for (i = 1; i <= n; i++)
    {
        if (end[i] != arr[i])
        {
            flag = 0;
        }
    }
    return flag;
}

int main(int argc, char const *argv[])
{
    int n, i;

    while (scanf("%d", &n), n != 0)
    {
        memset(arr, 0, sizeof(arr));
        memset(end, 0, sizeof(end));
        for (i = 1; i <= n; i++)
        {
            scanf("%d", &arr[i]);
        }
        if (change(arr, n))
        {
            printf("ambiguous\n");
        }
        else
        {
            printf("not ambiguous\n");
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。