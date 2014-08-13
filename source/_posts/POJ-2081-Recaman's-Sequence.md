title: POJ 2081 Recaman's Sequence
date: 2014-07-17 23:53:55
tags: [ACM, POJ, C/C++, 打表, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2081

# 理解
简单的计算题。利用打表的方法，空间换时间。

<!-- more -->

# 代码
```
#include <iostream>

using namespace std;

char ext[2600000] = {0};
int a[500001];

void reset()
{
    int i;
    a[0] = 0;
    ext[0] = 1;
    for (i = 1; i <= 500000; i++)
    {
        a[i] = a[i - 1] - i;
        if (a[i] < 0 || ext[a[i]])
        {
            a[i] = a[i - 1] + i;
        }
        ext[a[i]] = 1;
    }
}

int main(int argc, char const *argv[])
{
    int k;
    reset();
    while (cin >> k && k != -1)
    {
        cout << a[k] << endl;
    }
    return 0;
}
```

# 更新日志
- 2014年07月17日 已AC。