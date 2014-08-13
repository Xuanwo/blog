title: POJ 1298 史上最难的问题
date: 2014-07-23 02:35:36
tags: [ACM, POJ, C/C++, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1298

# 理解
问题的纠结之处在于编译器根本就不给`gets`和`puts`改过自新的机会，调试花了很久= =。恩，我也应该培养避免使用这些函数的习惯。回到题目上来，题意还是比较清楚的，向后移动五位即可。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main()
{
    char *p, cipher[128];
    gets(cipher);
    while (strcmp(cipher, "ENDOFINPUT"))
    {
        if (!strcmp(cipher, "START"))
        {
            gets(cipher);
            while (strcmp(cipher, "END"))
            {
                for (p = cipher; *p; ++p)
                {
                    if ('A' <= *p && *p <= 'Z')
                    {
                        *p = *p < 'F' ? 21 + *p : *p - 5;
                    }
                    putchar(*p);
                }
                gets(cipher);
            }
            putchar('\n');
        }
        gets(cipher);
    }
    return 0;
}
```

# 更新日志
- 2014年07月23日 已AC。