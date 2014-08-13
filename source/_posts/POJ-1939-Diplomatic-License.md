title: POJ 1939 Diplomatic License
date: 2014-08-05 20:51:00
tags: [ACM, POJ, C/C++, ]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1939

# 理解
求多边形相邻两个点的中点= =，这是英语题吧。。。

<!-- more -->

# 代码
```
#include <stdio.h>

double cor[2][30000];

int main()
{
    int n, i;
    while (scanf("%d", &n) != EOF)
    {
        for (i = 0; i < n; i++)
            scanf("%lf%lf", &cor[0][i], &cor[1][i]);
        printf("%d", n);
        for (i = 0; i < n; i++)
            printf(" %lf %lf", (cor[0][i] + cor[0][(i + 1) % n]) / 2, (cor[1][i] + cor[1][(i + 1) % n]) / 2);
        putchar('\n');
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月05日 已AC，C提交过了，G++直接超时两发。