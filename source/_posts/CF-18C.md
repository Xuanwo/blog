title: Codeforces Beta Round 18 C Stripe (Div.2 Only)
date: 2014-11-26 13:16:29
tags: [ACM, Codeforces, C/C++, 暴力]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/problemset/problem/18/C

# 理解
题意很简单，把一个给定的数列分成两份，要求两份数字之和相等。直接暴力乱搞，预处理的时候用两个数组分别保存前后缀的数字之和，然后只要遍历一遍，就能得到最后的结果。

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

#define MAXN 100000+10

int a[MAXN];
int b[MAXN];
int c[MAXN];
int n,ans;

void init()
{
    scanf("%d",&n);
    b[0]=0;
    for(int i=1; i<=n; i++)
    {
        scanf("%d",&a[i]);
        b[i]=b[i-1]+a[i];
    }
    for(int j=n; j>=1; j--)
    {
        c[j]=c[j+1]+a[j];
    }
}

int main(int argc, char const *argv[])
{
    init();
    for(int i=1; i<n; i++)
    {
        if(b[i]==c[i+1])
            ans++;
    }
    printf("%d\n",ans);
    return 0;
}
```

# 更新日志
- 2014年11月26日 已AC。