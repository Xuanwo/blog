---
categories: Exercise
date: 2014-08-12T00:19:00Z
title: POJ 3751 时间日期格式转换
toc: true
url: /2014/08/12/POJ-3751-Date-Transfer/
---

## 题目
源地址：

http://poj.org/problem?id=3751

# 理解
通过标记来判断正午和午夜，水题。

<!--more-->

# 代码

```

#include <iostream>
#include <cstdio>
using namespace std;

int t, y, mm, d, h, m, s, tag;
char ch[2][3] = {"am", "pm"};

int main(int argc, char const *argv[])
{

    cin >> t;
    while (t--)
    {
        scanf("%d/%d/%d-%d:%d:%d", &y, &mm, &d, &h, &m, &s);
        if (h < 12)
            tag = 0, h = (h == 0) ? 12 : h;
        else
            tag = 1, h = (h == 12) ? 12 : h - 12;
        printf("%02d/%02d/%04d-%02d:%02d:%02d%s\n", mm, d, y, h, m, s, ch[tag]);
    }
    return 0;
}


```

# 更新日志
- 2014年08月12日 已AC。