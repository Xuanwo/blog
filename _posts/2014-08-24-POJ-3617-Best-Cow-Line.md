---
layout: post
title: POJ 3617 Best Cow Line
date: 2014-08-24 21:42:20
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3617

# 理解
根据题目中所描述的数据结构来构建一个字典序最小的字符串。
贪心算法：不断取S的开头和末尾中较小的一个字符添加到T的末尾。
特别的，当两个字符大小一样时，则需要比较下一个字符。

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

#define MAX_N 2000

int n, i;
char s[MAX_N + 1];

int main(int argc, char const *argv[])
{
    cin >> n;
    for (i = 0; i < n; i++)
    {
        getchar();
        scanf("%c", &s[i]);
    }
    int a = 0, b = n - 1;
    int flag = 0;
    while (a <= b)
    {
        bool left = false;
        for (i = 0; a + i <= b; i++)
        {
            if (s[a + i] < s[b - i])
            {
                left = true;
                break;
            }
            else if (s[a + i] > s[b - i])
            {
                left = false;
                break;
            }
        }
        ++flag;
        cout << (left ? s[a++] : s[b--]) << (flag % 80 ? "" : "\n");
    }
    return 0;
}

```

# 更新日志
- 2014年08月24日 已AC。
- 2014年08月25日 代码BUG修正，解决了PE问题，昨天没看就以为自己过了真的是。。。