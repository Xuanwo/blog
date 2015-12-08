---
title: POJ 1256 Anagram
date: 2014-07-23 02:07:50
tags: [ACM, POJ, C, STL]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1256

# 理解
再次遇到一道使用`next_permutation`的题目，不过这一次需要针对题目的给出的条件重新写一个`cmp`函数。

<!-- more -->

# 代码

```

#include <cstdio>
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

bool cmp(char a, char b)
{
    if (tolower(a) == tolower(b))
        return a < b;
    else
        return tolower(a) < tolower(b);
}

int main()
{
    int t;
    cin >> t;
    while (t--)
    {
        string str;
        cin >> str;
        sort(str.begin(), str.end(), cmp);
        do
        {
            cout << str << endl;
        }
        while (next_permutation(str.begin(), str.end(), cmp));
    }
    return 0;
}

```

# 更新日志
- 2014年07月23日 已AC。