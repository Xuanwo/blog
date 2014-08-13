title: POJ 1844 Sum
date: 2014-08-05 17:09:00
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1844

# 理解
有这样两种情况：
1. Sum(i) == S ，那么很明显 i 就是答案,直接输出即可。
2. Sum(i) > S , 从 i 开始,依次往后面 +1 枚举 ，只要遇到 (Sum(i) - S) % 2 == 0 输出答案就可以了。

<!-- more -->

# 代码
```
#include<stdio.h>

const int maxn = 100000;

int main(int argc, char const *argv[])
{
    int s;
    while (scanf("%d", &s) != EOF)
    {
        int sum = 0;
        int i;
        for (i = 1; i < maxn; i++)
        {
            sum = (1 + i) * i / 2;
            if (sum >= s) break;
        }
        int index = i;

        for (;;)
        {
            sum = (1 + index) * index / 2;
            if ((sum - s) % 2 == 0)
            {
                printf("%d\n", index);
                break;
            }
            index++;
        }
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月05日 已AC。