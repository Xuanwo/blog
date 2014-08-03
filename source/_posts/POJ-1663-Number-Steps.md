title: POJ 1663 Max Factor
date: 2014-08-03 12:27:41
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1663

# 理解
发现奇偶之间的规律之后，这也就是一道水题。

<!-- more -->

# 代码
```
#include <stdio.h>
using namespace std;

int main(int argc, char const *argv[])
{
    int N, x, y;
    scanf("%d", &N);
    while (N--)
    {
        scanf("%d%d", &x, &y);
        if (x < 0 || y < 0)
            printf("No Number\n");
        else if (x == y || x == y + 2)
            printf("%d\n", x % 2 ? (x + y - 1) : (x + y) );
        else
            printf("No Number\n");
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月03日 已AC。