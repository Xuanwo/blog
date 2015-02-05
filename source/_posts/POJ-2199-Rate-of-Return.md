title: POJ 2199 Rate of Return
date: 2014-07-20 14:25:25
tags: [ACM, POJ, C, 二分]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2199

# 理解
感觉题目并不是很难。给出n个月，每个月都存进去一定的钱，然后第n+1个月给出到这个月为止的本息和。运用二分法，逐步逼近，直到达到了精度要求。

<!-- more -->

# 新技能get
二分法循环形式
```
up = 2;
down = 1;
mid = (up + down) / 2;
while ((mid - down) > eps)
{
    temp = 0;
    for (i = 0; i < count; i++)
    {        
    	temp += cof[i] * pow(mid, month[i]);//迭代条件，自行修改
    }
    if (temp < total)
        down = mid;
    else
        up = mid;
    mid = (up + down) / 2;
}
```

# 代码
```
#include <cstdio>
#include <cmath>
using namespace std;

double up, mid, down, rate;
double cof[12];
int month[12];
int lastMon;
double total, temp;
int count;
int Case = 0;

int main()
{
    int i;
    scanf("%d", &count);
    while (count != -1)
    {
        Case++;
        for (i = 0; i < count; i++)
        {
            scanf("%d%lf", &month[i], &cof[i]);
        }
        scanf("%d%lf", &lastMon, &total);
        for (i = 0; i < count; i++)
        {
            month[i] = lastMon - month[i] + 1;
        }
        up = 2;
        down = 1;
        mid = (up + down) / 2;
        while ((mid - down) > 0.000001)
        {
            temp = 0;
            for (i = 0; i < count; i++)
            {
                temp += cof[i] * pow(mid, month[i]);
            }
            if (temp < total)
                down = mid;
            else
                up = mid;
            mid = (up + down) / 2;
        }
        printf("Case %d: %.5lf\n", Case, mid - 1);
        if (scanf("%d", &count) && count != -1)
        {
            printf("\n");
        }
    }
    return 0;
}
```

# 更新日志
- 2014年07月19日 已AC。