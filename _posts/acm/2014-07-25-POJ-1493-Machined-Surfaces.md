---
layout: post
title: POJ 1493 Machined Surfaces
date: 2014-07-25 02:59:11
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1493

# 理解
题目虽然这么长，但是意思很简单，就是求左右合并之后中间剩下的空格数量。分别求出每行的空格数，排序，跟最小真相减之后叠加即可。

<!-- more -->

# 代码

```
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <cstdlib>
using namespace std;
#define MAX 100

char tmp[30];
int n;
int space[MAX];
int ans;

int main(int argc, char const *argv[])
{
    while (cin >> n && n != 0)
    {
        memset(space, 0, sizeof(space));
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < 25; j++)
            {
                scanf("%c", &tmp[j]);
                if (tmp[j] == ' ') space[i]++;
            }
            getchar();
        }
        sort(space, space + n);
        ans = 0;
        for (int i = 0; i < n; i++)    ans += space[i] - space[0];
        cout << ans << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年07月25日 已AC。