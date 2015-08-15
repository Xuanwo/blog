title: POJ 2871 A Simple Question of Chemistry
date: 2014-08-18 22:39:35
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2871

# 理解
给一列数，从第二个数开始，输出其与上一个数字之差，输出取两位小数，输入以“999”数字结束。

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
    float last = 0, now;

    scanf("%f", &last);
    while (last != 999 && scanf("%f", &now), now != 999)
    {
        printf("%.2f\n", now - last);
        last = now;
    }
    printf("End of Output\n");
    return 0;
}
```
# 更新日志
- 2014年08月18日 已AC。