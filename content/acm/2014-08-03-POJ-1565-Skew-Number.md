---
categories: Exercise
date: 2014-08-03T11:43:36Z
title: POJ 1565 Skew数
toc: true
url: /2014/08/03/POJ-1565-Skew-Number/
---

## 题目
源地址：

http://poj.org/problem?id=1565

# 理解
不难，按照规则计算即可，注意大数的处理。

<!--more-->

# 代码

```
#include <iostream>
#include <cstring>
using namespace std;

int main(int argc, char const *argv[])
{
    char num[35];
    while (cin >> num && num[0] != '0')
    {
        unsigned int pow = 1, sum = 0;
        for (int i = strlen(num) - 1; i >= 0; i --)
        {
            pow *= 2;
            sum += (num[i] - '0') * (pow - 1);
        }
        cout << sum << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月03日 已AC。