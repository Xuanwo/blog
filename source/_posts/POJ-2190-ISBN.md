title: POJ 2190 ISBN
date: 2014-08-16 14:25:01
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2190

# 理解
题目不难，只需求解给定一个数为ISBN数十，？上那个数字代表的是几。需要考虑的一些特殊情况：
1. 无解的时候，输出-1
2. 末尾数为10的时候，输出X
3. 如果结果没有修改，要直接初始化为-1

<!-- more -->

# 代码
```
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <ctime>
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <deque>
#include <list>
#include <set>
#include <map>
#include <stack>
#include <queue>
#include <numeric>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<30)
using namespace std;

char str[15];

int main(int argc, char const *argv[])
{
    int at, end;
    int i, j;
    int sum, result;
    while (scanf("%s", str) != EOF)
    {
        sum = 0;
        for (i = 0; i < 10; i++)
        {
            if (str[i] == '?')
            {
                at = 10 - i;
            }
            else
            {
                if (str[i] != 'X')
                {
                    sum += (str[i] - '0') * (10 - i);
                }
                else
                {
                    sum += 10;
                }
            }
        }
        end = (at == 1 ? 10 : 9);
        result = -1;
        for (i = 0; i <= end; i++)
        {
            if ((sum + (i * at)) % 11 == 0)
            {
                result = i;
                break;
            }
        }
        if (result != 10)
        {
            printf("%d\n", result);
        }
        else if (result == 10 && at == 1)
        {
            printf("X\n");
        }
        else
        {
            printf("-1\n");
        }
    }
    return 0;
}
```

# 更新日志
- 2014年08月16日 已AC。