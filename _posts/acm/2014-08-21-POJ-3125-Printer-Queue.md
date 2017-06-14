---
layout: post
title: POJ 3125 Printer Queue
date: 2014-08-21 19:43:07
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=3125

# 理解
打印队列，看名字都感觉是队列的经典应用，不过没有使用STL，而是模拟了一个。

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

int main(int argc, char const *argv[])
{
    int a[10010];
    int front, rear, i;
    int cases, n, d, time, ok;
    scanf("%d", &cases);
    while (cases--)
    {
        front = 0; rear = 0; time = 0; ok = 0;
        scanf("%d%d", &n, &d);
        for (i = 0; i < n; i++)
        {
            scanf("%d", &a[i]);
            rear++;
        }
        while (front <= rear)
        {
            for (i = front; i < rear; i++)
            {
                if (a[i] > a[front])
                {
                    a[rear++] = a[front];
                    break;
                }
            }

            if (i >= rear)
            {
                time += 1;
                if (front == d)
                {
                    printf("%d\n", time);
                    ok = 1;
                    break;
                }
                else
                    front++;
            }
            else if (front == d)
            {
                d = rear - 1;
            }
            else front++;
            if (ok) break;
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月21日 已AC。