title: POJ 1326 Mileage Bank
date: 2014-07-23 14:10:08
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1326

# 理解
题目倒是不难，但是这个输入真的是。。。。

<!-- more -->

# 代码
```#include <iostream>
#include <cstring>
#include <cstdio>
using namespace std;

char temp1[100], temp2[100], a[2];

int s, sum;

int main(int argc, char const *argv[])
{
    while (1)
    {
        sum = 0;
        while (1)
        {
            scanf("%s", temp1);
            if (temp1[0] == '0')
                break;
            if (temp1[0] == '#')
                return 0;
            scanf("%s%d%s", temp2, &s, a);

            if (a[0] == 'F')
                sum += s * 2;
            else if (a[0] == 'Y')
            {
                if (s <= 500)
                    sum += 500;
                else
                    sum += s;
            }
            else if (a[0] == 'B')
                sum += s * 1.5 + 0.5;
        }
        cout << sum << endl;
    }
    return 0;
}
```
# 更新日志
- 2014年07月23日 已AC。