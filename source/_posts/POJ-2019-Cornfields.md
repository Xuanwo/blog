title: POJ 2019 Cornfields
date: 2014-08-06 14:20:00
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2019

# 理解
暴力水过的= =，大牛说是RMQ的题目，要是POJ数据强的话，估计就超时了。

<!-- more -->

# 代码
```
{% raw %}
#include <cstdio>
#include <cstdlib>

int field[300][300];
int N, B, K;
int X, Y;
int i, j;
int min, max, tmp;

int main(int argc, char const *argv[])
{
    scanf("%d%d%d", &N, &B, &K);
    for (i = 1; i <= N; i++)
    {
        for (j = 1; j <= N; j++)
        {
            scanf("%d", &field[i][j]);
        }
    }
    while (K --)
    {
        scanf("%d%d", &X, &Y);
        min = max = field[X][Y];
        for (i = X; i < X + B; i++)
        {
            for (j = Y; j < Y + B; j++)
            {
                if (min > field[i][j])
                {
                    min = field[i][j];
                }
                if (max < field[i][j])
                {
                    max = field[i][j];
                }
            }
        }
        printf("%d\n", max - min);
    }
    return 0;
}
{% endraw %}
```
	
# 更新日志
- 2014年08月06日 已AC。