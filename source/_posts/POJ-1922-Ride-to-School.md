title: POJ 1922 Ride to School
date: 2014-08-05 20:36:00
tags: [ACM, POJ, C, 贪心, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1922

# 理解
第一眼感觉就是贪心，只要选择最快的单车就好，不用考虑中间的过程。

<!-- more -->

# 代码

```
#include <stdio.h>
using namespace std;

int n;
double m = 999999.0;
double s, t;

int main()
{
    scanf("%d", &n);
    while (n != 0)
    {
        while (n--)
        {
            scanf("%lf%lf", &s, &t);
            if (t >= 0)
            {
                t += 4500.0 / (s / 3.6);
                if (t < m)
                    m = t;
            }
        }
        printf("%d\n", (int)(m + 0.999999));
        m = 999999.0;
        scanf("%d", &n);
    }
    return 0;
}

```

# 更新日志
- 2014年08月05日 已AC。