---
layout: post
title: POJ 1068 Parencodings
date: 2014-07-22 20:37:35
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1068

# 理解
模拟栈操作，主要是对题目意思的理解。

<!-- more -->

# 代码

```
#include<cstdio>
#include<iostream>
#include<stack>
using namespace std;
int a[25], b[25], c[100];

int main(int argc, char const *argv[])
{
    int i, j, t, n, p, num;
    stack<int> st;
    scanf("%d", &t);
    while (t--)
    {
        num = 0;
        cin >> n;
        a[0] = 0;
        p = 0;
        for (i = 1; i <= n; i++)
        {
            cin >> a[i];
            for (j = p; j < p + a[i] - a[i - 1]; j++)
                c[j] = j + 1;
            c[p + a[i] - a[i - 1]] = -(p + a[i] - a[i - 1] + 1);
            p = p + a[i] - a[i - 1] + 1;
        }
        j = 0;
        for (i = 0; i < p; i++)
        {
            if (c[i] > 0)
                st.push(c[i]);
            else
            {
                num = st.top();
                st.pop();
                num = (-c[i] - num) / 2 + 1;
                b[j] = num;
                j++;
            }
        }
        for (i = 0; i < j - 1; i++)
            printf("%d ", b[i]);
        printf("%d\n", b[j - 1]);
    }
    return 0;
}

```

# 更新日志
- 2014年07月22日 已AC。