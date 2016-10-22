---
layout: post
title: POJ 1504 Adding Reversed Numbers
date: 2014-07-25 03:40:50
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1504

# 理解
同样是长长的题目，其实是要求把数字从左到右相加，本质是要用字符数组模拟加法。当然，用java会更快一点，不过这次选择了用C++来写。姿势不是很优美，代码太丑陋了，应该有更优美的写法。

<!-- more -->

# 代码

```
#include <iostream>
#include <string>
#include <cstdio>
using namespace std;

int n;
string a, b;
char c[100];
int i;
int ans;

int main(int argc, char const *argv[])
{
    cin >> n;
    while (n--)
    {
        cin >> a >> b;
        if (a.length() < b.length())   a.swap(b);
        for (i = 0; i < a.length() + 1; i++) c[i] = '0';
        ans = 0;
        for (i = 0; i < b.length(); i++)
        {
            c[i] += a[i] + b[i] - 3 * '0';
            if (c[i] >= 10)
            {
                c[i + 1]++;
                c[i] = c[i] - 10 + '0';
            }
            else
                c[i] = c[i] + '0';
        }
        for (i = b.length(); i < a.length(); i++)
        {
            c[i] += a[i] - 2 * '0';
            if (c[i] >= 10)
            {
                c[i + 1]++;
                c[i] = c[i] - 10 + '0';
            }
            else
                c[i] = c[i] + '0';
        }
        for (i = 0; i <= a.length(); i++)
        {
            ans = ans * 10 + c[i] - '0';
        }
        if (ans % 10 == 0)   ans /= 10;
        printf("%d\n", ans);
    }
    return 0;
}

```

# 更新日志
- 2014年07月25日 已AC。