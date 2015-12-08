---
title: POJ 2407 Relatives
date: 2014-08-16 22:04:50
tags: [ACM, POJ, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2407

# 理解
套用欧拉公式，其实不懂= =。

<!-- more -->

# 新技能get
欧拉函数：
>
在数论，对正整数n，欧拉函数是少于或等于n的数中与n互质的数的数目。此函数以其首名研究者欧拉命名，它又称为Euler's totient function、φ函数、欧拉商数等。 例如φ(8)=4，因为1,3,5,7均和8互质。 从欧拉函数引伸出来在环论方面的事实和拉格朗日定理构成了欧拉定理的证明。

φ函数的值 　
通式：φ(x)=x(1-1/p1)(1-1/p2)(1-1/p3)(1-1/p4)…..(1-1/pn),其中p1,p2……pn为x的所有质因数，x是不为0的整数。
φ(1)=1（唯一和1互质的数(小于等于1)就是1本身）。
(注意：每种质因数只一个。比如12=2*2*3那么φ(12)=12*(1-1/2)*(1-1/3)=4）

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
#define inf (1<<30)
using namespace std;


int Euler (int n)
{
    int i, res = n;
    for (i = 2; i * i <= n; i++)
    {
        if (n % i == 0)
        {
            n /= i;
            res = res - res / i;
            while (n % i == 0)
                n /= i;
        }
    }
    if (n > 1)
        res = res - res / n;
    return res;
}

int main(int argc, char const *argv[])
{
    int n;
    while (scanf ("%d", &n), n)
        printf ("%d\n", Euler(n));
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。