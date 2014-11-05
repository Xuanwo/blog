title: UVa 12627 Erratic Expansion
date: 2014-11-5 20:11:48
tags: [ACM, UVa, C/C++, 分治]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4352

# 理解
因为有图，所以题意还是蛮清楚的。求给定时间，给定范围中气球的个数= =。
也是我心比天高太年轻，试图直接把红球个数和n关系直接撸出来，后来发现着实有点困难。不过发现每当过去一小时，这一行的红球数都会变为原来的两倍。这样问题就变得简单了起来，我只要使用一次递归分治就可以了~

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
#define inf (1<<28)
#define ll long long int
using namespace std;

#define MAXN 30+10

ll dp[MAXN];
int K,A,B;
int t,tcase=0;

ll f(int n,int k)
{
    if(n==0) return k>=1;
    if(dp[n]!=-1&&(1<<n)==k) return dp[n];
    n--;
    if(k<=(1<<n)) return f(n,k)*2;
    dp[n]=f(n,1<<n);
    return dp[n]*2+f(n,k-(1<<n));
}


int main(int argc, char const *argv[])
{
    memset(dp,-1,sizeof(dp));
    scanf("%d",&t);
    while(t--)
    {
        scanf("%d%d%d",&K,&A,&B);
        ll ans=f(K,B)-f(K,A-1);
        printf("Case %d: %lld\n",++tcase,ans);
    }
    return 0;
}
```

# 更新日志
- 2014年11月5日 已AC。