title: POJ 1543 Perfect Cubes
date: 2014-08-03 11:36:27
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1543

# 理解
暴力提交过了= =，怪我喽？

<!-- more -->

# 代码

```

#include <cstdio>

using namespace std;

int main(int argc, char const *argv[])
{
    int a, b, c, d, n;
    scanf("%d", &n);
    for (a = 6; a <= n; a++)
        for (b = 2;; b++)
        {
            if (a * a * a <= b * b * b)
                break;
            for (c = b + 1;; c++)
            {
                if (a * a * a <= b * b * b + c * c * c)
                    break;
                for (d = c + 1;; d++)
                {
                    if (a * a * a < b * b * b + c * c * c + d * d * d)
                        break;
                    if (a * a * a == b * b * b + c * c * c + d * d * d)
                        printf("Cube = %d, Triple = (%d,%d,%d)\n", a, b, c, d);
                }
            }
        }
    return 0;
}

```

# 更新日志
- 2014年08月03日 已AC。