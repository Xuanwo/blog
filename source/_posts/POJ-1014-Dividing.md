title: POJ 1014 Dividing
date: 2014-07-16 15:25:02
tags: [ACM, POJ, C, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1014

# 理解
我的思路非常直接，直接当成一道数学题来解。于是把所有的数都mod2，得到了一个二进制串，然后以这个为基础，开始寻找特例，结果挂的很惨。比如`0 3 2 0 0 0`，这种情况是在mod2的时候直接就舍去的。说明我这种方法本质上有着缺陷。网上的大牛们大多采用了多重背包的方法，但是有一个人在discuss中提出了mod60的方法。实际上，这个是mod2思路的进一步延伸，也就是解决了`0 3 2 0 0 0`这种类型的特例。然后再不断的用sum去减，判断最后能都减至0，实质上是用了DFS。
<!-- more -->

# 代码
```#include <cstdio>
using namespace std;

int num[6] = {0};
int value[6] = {1, 2, 3, 4, 5, 6};
int mod[6] = {60, 30, 20, 15, 12, 10};
int t = 0;
int cp[6] = {0};

int divide(int a)
{
    if (a == 0) return 1;
    for (int i = 5; i >= 0; --i)
    {
        if (cp[i] && a >= value[i])
        {
            cp[i]--;
            if (divide(a - value[i]) == 1) return 1;
            cp[i]++;
        }
    }
    return 0;
}

int main(int argc, char const *argv[])
{
    while (true)
    {
        int sum = 0;
        for (int i = 0; i < 6; ++i)
        {
            scanf("%d", &num[i]);
            num[i] = num[i] % mod[i];
            sum += value[i] * num[i];
            cp[i] = num[i];
        }
        if (!sum) break;
        printf("Collection #%d:\n", ++t);
        if (sum % 2 != 0) printf("Can't be divided.\n");
        else
        {
            sum = sum / 2;
            if (divide(sum)) printf("Can be divided.\n");
            else printf("Can't be divided.\n");
        }
        printf("\n");
    }
    return 0;
}
```
# 更新日志
- 2014年07月16日 已AC。