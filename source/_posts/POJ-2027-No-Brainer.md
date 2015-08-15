title: POJ 2027 No Brainer
date: 2014-08-16 00:11:09
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2027

# 理解
超级大水题= =，比较一下X和Y的大小。

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

int main(int argc, char const *argv[])
{
    int casenum, ii;
    int a, b;
    scanf("%d", &casenum);
    for (ii = 0; ii < casenum; ii++)
    {
        scanf("%d%d", &a, &b);
        if (a < b)
        {
            printf("NO BRAINS\n");
        }
        else
        {
            printf("MMM BRAINS\n");
        }
    }
    return 0;
}
```

# 更新日志
- 2014年08月16日 已AC。