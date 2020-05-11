---
categories: Code
date: 2014-07-22T21:37:10Z
title: POJ 1218 THE DRUNK JAILER
toc: true
url: /2014/07/22/POJ-1218-THE-DRUNK-JAILER/
---

## 题目
源地址：

http://poj.org/problem?id=1218

# 理解
汗= =，偷鸡水过了，正好是牢房数的平方根向下取整，不过没有严格的证明

<!--more-->

# 代码

```
#include <iostream>
#include <cmath>
using namespace std;

int main()
{
    int n, a, k;
    cin >> n;
    while (n--)
    {
        cin >> k;
        a = sqrt(k);
        cout << a << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年07月22日 已AC，有待证明。