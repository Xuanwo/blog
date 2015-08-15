title: POJ 2521 How much did the businessman lose
date: 2014-08-17 16:14:20
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2521

# 理解
小学的时候经常做的题目啊，只要保持头脑清醒，计算出交易过程中因为假币损失的钱。

<!-- more -->

# 代码
```#include <cstdio>
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
#define inf (1<<30)
using namespace std;

int main(int argc, char const *argv[])
{
    int n, m, p, c;
    while (cin >> n >> m >> p >> c && n + m + p + c)
    {
        cout << p - (m - n) << endl;
    }

}
```
# 更新日志
- 2014年08月17日 已AC。