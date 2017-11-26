---
categories: Exercise
date: 2014-08-22T21:32:53Z
title: POJ 2636 Electrical Outlets
toc: true
url: /2014/08/22/POJ-2636-Electrical-Outlets/
---

## 题目
源地址：

http://poj.org/problem?id=2636

# 理解
今天做的时候发现`2636.cpp`文件已经存在了，有点神奇= =，改了一下头文件，直接提交了。

<!--more-->

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

int main(int argc, char const *argv[])
{
    int N, K, O, ans;
    int i;
    scanf("%d", &N);
    while (N--)
    {
        ans = 0;
        scanf("%d", &K);
        for (i = 0; i < K; i++)
        {
            scanf("%d", &O);
            ans += O;
        }
        printf("%d\n", ans - K + 1);
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。