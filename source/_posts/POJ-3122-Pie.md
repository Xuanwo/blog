---
title: POJ 3122 Pie
date: 2014-07-23 23:47:09
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3122

# 理解
这也是一道水题，二分切之。

<!-- more -->

# 代码

```
#include <stdio.h>
#include <math.h>
#include <algorithm>

using namespace std;

int N, F;
double pi = acos(-1.0);
double pie[10032];
double sum, maxp;

int main()
{
    double l, r, m;
    int i, t, c;

    scanf("%d", &t);
    while (t--)
    {
        scanf("%d%d", &N, &F);
        F++;
        maxp = sum = 0;
        for (i = 0; i < N; i++)
        {
            scanf("%d", &c);
            pie[i] = c * c * pi;
            maxp = max(maxp, pie[i]);
            sum += pie[i];
        }
        l = maxp / F;
        r = sum / F;
        while (l + 0.00001 < r)
        {
            m = (l + r) / 2;
            c = 0;
            for (i = 0; i < N; i++)
                c += floor(pie[i] / m);
            if (c < F)
                r = m;
            else
                l = m;
        }
        printf("%.4lf\n", l);
    }

    return 0;
}

```

# 更新日志
- 2014年07月23日 已AC。