title: POJ 1953 World Cup Noise
date: 2014-08-12 05:19:00
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1953

# 理解
稍微推了几个，发现是斐波那契数列，水之。

<!-- more -->

# 代码
```
#include <stdio.h>

int main(int argc, char const *argv[])
{
    __int64 x[46] = {0, 2, 3, 5, 8,};
    int T, i, ans, a, c = 1;
    scanf("%d", &T);
    for (i = 5 ; i  < 46; ++i)
        x[i] = x[i - 1] + x[i - 2];
    do
    {
        scanf("%d", &a);
        printf("Scenario #%d:\n", c++);
        printf("%I64d\n\n", x[a]);
    }
    while (--T);

    return 0;
}
```
	
# 更新日志
- 2014年08月12日 已AC。