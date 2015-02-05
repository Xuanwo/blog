title: UVa 1347 Tour
date: 2014-11-16 14:35:27
tags: [ACM, UVa, C, DP]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4093

# 理解
给出n个定点，要求计算出连接这些点的最短闭合路径。
使用dp[i][j]来保存从i到1再从1到j的最短距离。然后可以得到这样两条递推公式：
```
dp[i][i-1]=min(dp[i][i-1],dp[i-1][j]+dis(i,j));
dp[i][j]=dp[i-1][j]+dis(i,i-1);
```
最后的结果就是遍历一遍dp[n][i]+dis(n,i)，找到最小值。

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

#define MAXN 100+10

int n;
double x[MAXN],y[MAXN],dp[MAXN][MAXN];
double ans;

double dis(int a,int b)
{
    return sqrt((x[a]-x[b])*(x[a]-x[b])+(y[a]-y[b])*(y[a]-y[b]));
}

void init()
{
    memset(dp,0,sizeof(dp));
    dp[2][1]=dis(1,2);
    for(int i=1; i<=n; i++)
    {
        scanf("%lf%lf", &x[i], &y[i]);
    }
}

int main(int argc, char const *argv[])
{
    while(~scanf("%d", &n))
    {
        init();
        for(int i=3; i<=n; i++)
        {
            dp[i][i-1]=inf;
            for(int j=1; j<i-1; j++)
            {
                dp[i][i-1]=min(dp[i][i-1],dp[i-1][j]+dis(i,j));
                dp[i][j]=dp[i-1][j]+dis(i,i-1);
            }
        }
        ans=inf;
        for(int i=1; i<n; i++)
        {
            ans=min(ans,dp[n][i]+dis(n,i));
        }
        printf("%.2lf\n",ans);
    }
    return 0;
}
```

# 更新日志
- 2014年11月16日 已AC。