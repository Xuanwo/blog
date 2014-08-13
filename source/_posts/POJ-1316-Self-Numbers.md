title: POJ 1316 Self Numbers
date: 2014-07-23 02:43:24
tags: [ACM, POJ, C/C++, 模拟]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1316

# 理解
水题，开一个数组模拟，水过～

<!-- more -->

# 代码
```
#include <stdio.h>

int data[10010] = {0};

int sum(int num)
{
    int ans = 0;
    while (num > 0)
    {
        ans += num % 10;
        num /= 10;
    }
    return ans;
}

int main(int argc, char const *argv[])
{
    int i = 0;
    for (i = 1; i < 10001; ++i)
    {
        data[i + sum(i)] = 1;
    }
    for (i = 1; i < 10001; ++i)
    {
        if (!data[i])
        {
            printf("%d\n", i);
        }
    }
}
```

# 更新日志
- 2014年07月23日 已AC。