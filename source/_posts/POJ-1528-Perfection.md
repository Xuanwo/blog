title: POJ 1528 Perfection
date: 2014-07-25 04:34:58
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1528

# 理解
1. 一个数n的正因数之和等于n则输出`PERFECT`
2. 大于n，输出`ABUNDANT`
3. 小于n，输出`DEFICIENT`

*注意：因数不包括它本身*

<!-- more -->

# 代码
```#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;
#define MAX 60001

int num[MAX];
int n,k=0;

void fun()
{
    int i, j;
    memset(num, 0, sizeof(num));
    for (i = 1; i < MAX; i++)
    {
        for (j = i + i; j < MAX; j += i)
        {
            num[j] += i;
        }
    }
}

int main()
{
    fun();
    while (scanf("%d", &n) != EOF)
    {
        k++;
        if (k == 1)
            printf("PERFECTION OUTPUT\n");
        if (n == 0)
        {
            printf("END OF OUTPUT\n");
            break;
        }
        if (n / 10 == 0)
            printf("    %d", n);
        else if (n / 100 == 0)
            printf("   %d", n);
        else if (n / 1000 == 0)
            printf("  %d", n);
        else if (n / 10000 == 0)
            printf(" %d", n);
        else
            printf("%d", n);
        if (num[n] == n)
        {
            printf("  PERFECT\n");
        }
        else if (num[n] < n)
        {
            printf("  DEFICIENT\n");
        }
        else
            printf("  ABUNDANT\n");
    }
    return 0;
}
```
# 更新日志
- 2014年07月25日 已AC。