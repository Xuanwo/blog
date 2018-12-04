---
categories: Code
date: 2014-08-18T22:42:34Z
title: POJ 2853 Sequence Sum Possibilities
toc: true
url: /2014/08/18/POJ-2853-Sequence-Sum-Possibilities/
---

## 题目
源地址：

http://poj.org/problem?id=2853

# 理解
因式分解，输出能用题目中的要求输出的组合的数目。

<!--more-->

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

int main(int argc, char const *argv[])
{
    int i;
    int n;
    int cases;
    int num;
    int count;
    cin >> cases;
    while (cases--)
    {
        cin >> num;
        cin >> n;
        i = 1;
        count = 0;
        while (n - i * (i + 1) / 2 >= 0)
        {
            if ((n - i * (i + 1) / 2) % i == 0)
                count++;
            i++;

        }
        cout << num << " " << count - 1 << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。