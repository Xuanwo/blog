title: POJ 3325 ICPC Score Totalizer Software
date: 2014-08-22 17:18:27
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3325

# 理解
去掉一个最高分，一个最低分，求平均值。
**小学的时候经常做这样的题目- -**

<!-- more -->

# 代码
```#include <cstdio>
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
#define inf (1<<28)
using namespace std;

int main(int argc, char const *argv[])
{
    int max, min, tmp;
    int n, sum;
    int i, j;

    while (scanf("%d", &n), n != 0)
    {
        min = 1001;
        max = -1;
        for (i = sum = 0; i < n; i++)
        {
            scanf("%d", &tmp);
            if (tmp < min)
            {
                min = tmp;
            }
            if (tmp > max)
            {
                max = tmp;
            }
            sum += tmp;
        }
        sum -= (max + min);
        printf("%d\n", sum / (n - 2));
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。