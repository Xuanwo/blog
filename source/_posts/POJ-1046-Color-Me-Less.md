title: POJ 1046 Color Me Less
date: 2014-07-21 15:55:53
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1046

# 理解
题目并不难，暴力水过即可。用到了结构体的知识，可惜我对结构体的理解还是太过于表层。其实我可以把结构体作为函数的参数输入，这样可以减少很大的代码量。

<!-- more -->
# 代码
```#include <iostream>
#include <cmath>
#include <cstdio>
#include <cstdlib>
using namespace std;

struct list
{
    int r, g, b;
} standard[16];

double dis, tmp;
int  ansr, ansg, ansb;
int r, g, b;

double cal(int r1, int r2, int g1, int g2, int b1, int b2)
{
    return sqrt((double)((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2)));
}


int main(int argc, char const *argv[])
{
    for (int i = 0; i < 16; i++) scanf("%d%d%d", &standard[i].r, &standard[i].g, &standard[i].b);
    while (scanf("%d%d%d", &r, &g, &b) && r != -1)
    {
        dis = 450.0;
        ansr=ansg=ansb=0;
        for (int i = 0; i < 16; i++)
        {
            tmp = cal(r, standard[i].r, g, standard[i].g, b, standard[i].b);
            if (tmp<dis)
            {
                dis = tmp;
                ansr = standard[i].r;
                ansg = standard[i].g;
                ansb = standard[i].b;
            }
            else
                continue;
        }
        printf("(%d,%d,%d) maps to (%d,%d,%d)\n", r, g, b, ansr, ansg, ansb);
    }
    return 0;
}
```
# 更新日志
- 2014年07月日 已AC。