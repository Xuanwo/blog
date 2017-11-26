---
categories: Exercise
date: 2014-08-22T21:35:15Z
title: POJ 2579 Blurred Vision
toc: true
url: /2014/08/22/POJ-2579-Blurred-Vision/
---

## 题目
源地址：

http://poj.org/problem?id=2579

# 理解
对于一个R*C的矩阵，输出矩阵中每一个2*2的小方格四个值的平均值（向下取整）。
挨个遍历即可，注意边界。

<!--more-->

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

int arr[10][10];
char sign[3][20] = {"START", "END", "ENDOFINPUT"};

int main(void)
{
    int i, j;
    int r, c;
    int ave;
    char tmp[20];

    while (scanf("%s", tmp), strcmp(tmp, sign[2]))
    {
        memset(arr, 0, sizeof(arr));
        scanf("%d%d", &r, &c);
        getchar();
        for (i = 0; i < r; i++)
        {
            for (j = 0; j < c; j++)
            {
                arr[i][j] = getchar() - '0';
            }
            getchar();
        }
        for (i = 1; i < r; i++)
        {
            for (j = 1; j < c; j++)
            {
                ave = arr[i][j] + arr[i - 1][j] + arr[i][j - 1] + arr[i - 1][j - 1];
                printf("%d", ave / 4);
            }
            printf("\n");
        }
        scanf("%s", tmp);
        getchar();
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。