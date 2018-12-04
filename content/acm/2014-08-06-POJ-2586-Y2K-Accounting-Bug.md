---
categories: Code
date: 2014-08-06T15:23:00Z
title: POJ 2586 Y2K Accounting Bug
toc: true
url: /2014/08/06/POJ-2586-Y2K-Accounting-Bug/
---

## 题目
源地址：

http://poj.org/problem?id=2586

# 理解
总共有五种情况：
1、若SSSSD亏空，那么全年可能最大盈利情况为: SSSSDSSSSDSS
2、若SSSDD亏空，那么全年可能最大盈利情况为：SSSDDSSSDDSS
3、若SSDDD亏空，那么全年可能最大盈利情况为: SSDDDSSDDDSS
4、若SDDDD亏空，那么全年可能最大盈利情况为: SDDDDSDDDDSD
5、若DDDDD亏空，那么全年可能最大盈利情况为: DDDDDDDDDDDD

<!--more-->

# 代码

```
#include <iostream>
#include <cstdio>
using namespace std;

int main(int argc, char const *argv[])
{
    int sur, def;
    while (scanf("%d%d", &sur, &def) != EOF)
    {
        int val;
        if (def > 4 * sur)  val = 10 * sur - 2 * def;
        else if (2 * def > 3 * sur)  val = 8 * sur - 4 * def;
        else if (3 * def > 2 * sur)  val = 6 * sur - 6 * def;
        else if (4 * def > sur)  val = 3 * sur - 9 * def;
        else  val = -12 * def;

        if (val <= 0)  cout << "Deficit" << endl;
        else  cout << val << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月06日 已AC。