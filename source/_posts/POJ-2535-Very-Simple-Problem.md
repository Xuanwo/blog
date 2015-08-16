title: POJ 2535 Very Simple Problem
date: 2014-08-22 22:04:55
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2535

# 理解
N个评委，P道题目，每个评委对每道题进行评分。对于单个评委来说，如果他评分中的最高分的题目被视为该评委认定的“最困难的题目”，他评分中的最低分的题目被视为该评委认定的“最简单的题目”。对于每一道题，如果没有评委评定为“最困难的题目”，且有超过半数（不等于）的评委评定为“最简单的题目”，则这就可以被认为是“非常简单的题目”。

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


int N, P;
int arr[110];
int easy[110];
int hard[110];

int main(int argc, char const *argv[])
{
    int i, j;
    int tmp, flag;
    int min, max;

    while (scanf("%d%d", &N, &P) != EOF)
    {
        memset(easy, 0, sizeof(easy));
        memset(hard, 0, sizeof(hard));
        for (i = 0; i < N; i++)
        {
            min = 10000;
            max = -1;
            for (j = 0; j < P; j++)
            {
                scanf("%d", &arr[j]);
                if (min > arr[j])
                {
                    min = arr[j];
                }
                if (max < arr[j])
                {
                    max = arr[j];
                }
            }
            for (j = 0; j < P; j++)
            {
                if (arr[j] == min)
                {
                    easy[j]++;
                }
                if (arr[j] == max && !hard[j])
                {
                    hard[j] = 1;
                }
            }
        }
        flag = 0;
        for (i = 0; i < P; i++)
        {
            if (easy[i] > N / 2 && hard[i] == 0)
            {
                if (flag)
                {
                    printf(" ");
                }
                printf("%d", i + 1);
                flag = 1;
            }
        }
        if (flag == 0)
        {
            printf("0\n");
        }
        else
        {
            printf("\n");
        }
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。