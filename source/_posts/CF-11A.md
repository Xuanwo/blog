title: Codeforces Beta Round 11 A Increasing Sequence
date: 2014-11-16 10:45:44
tags: [ACM, Codeforces, C/C++, 贪心]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/problemset/problem/11/A

# 理解
给定一个序列，给定一个递增值。要求计算出最少需要多少步，能将这个序列变为递增数列。
第一个想法就是贪心，甚至都不需要读完数列，直接在输入时处理就可以了。

<!-- more -->

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf 0x3f3f3f3f
#define ll long long int
using namespace std;

int n,d;
int t=0,one,two,temp;

int main(int argc, char const *argv[])
{
    while (~scanf("%d%d",&n,&d))
    {
        t=0;
        scanf("%d",&one);
        for (int i=2; i<=n; i++)
        {
            scanf("%d",&two);
            if (one>two)
            {
                temp=(one-two)/d+1;
                t+=temp;
                two+=temp*d;
            }
            else if (one == two)
                t++,two+=d;
            one=two;
        }
        printf("%d\n",t);
    }
    return 0;
}
```

# 更新日志
- 2014年11月16日 已AC。