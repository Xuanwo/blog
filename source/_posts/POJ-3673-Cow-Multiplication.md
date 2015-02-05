title: POJ 3673 Cow Multiplication
date: 2014-08-21 21:59:04
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3673

# 理解
按照题意初始化，并运算即可。

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
#define inf (1<<28)
using namespace std;

#define MAX 300

int main(int argc, char const *argv[])
{
    char input[MAX];
    cin.getline(input, MAX);
    int count = 0;
    char *a , *b;
    a = strtok(input, " ");
    b = strtok(NULL, " ");

    for (int i = 0; i < strlen(a); i++)
    {
        for (int j = 0; j < strlen(b); j++)
        {
            count += (a[i] - '0') * (b[j] - '0');
        }
    }
    printf("%d\n", count);
    return 0;
}
```

# 更新日志
- 2014年08月21日 已AC。