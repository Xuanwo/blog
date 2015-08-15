title: UVa 1025 A Spy in the Metro
date: 2014-11-15 11:04:23
tags: [ACM, UVa, C, DP]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3466

# 理解
其实题目还是蛮吓人的= =，因为上来就是Line1~7的输入。其实题意不难，有从左到右编号为1~n的车站，有m1辆车从第1站往右开，有m2辆车从第2站往左开。主角在t=0的时候从第1站出发，要在t时刻遇见车站n的一个间谍。要求求出最短的等待时间，没有的话就输出impossible。
小脑一动，可以知道，每一次有三个选择：等待，向左，向右。我们可以用dp[t][i]来表示第t时刻在第i个车站，然后用vis[t][i][sta]来表示三种选择。全部预处理一遍之后，dp求解最短时间即可。


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

#define MAXN 250+10
#define MAXM 70+10

int vis[MAXN][MAXM][3];
int dp[MAXN][MAXM];
int t[MAXN];
int d1[MAXM],d2[MAXM];
int n,t,m1,m2;
int ca=1;

void init()
{
    scanf("%d",&t);
    for(int i=1; i<n; i++)
        scanf("%d",&t[i]);
    scanf("%d",&m1);
    for(int i=1; i<=m1; i++)
        scanf("%d",&d1[i]);
    scanf("%d",&m2);
    for(int i=1; i<=m2; i++)
        scanf("%d",&d2[i]);
    memset(vis,0,sizeof vis);
}

int main(int argc, char const *argv[])
{
    while(~scanf("%d",&n),n)
    {
        init();
        for(int i=1; i<=m1; i++)
        {
            vis[d1[i]][1][0]=1;
            int temp=d1[i];
            for(int j=1; j<n; j++)
            {
                temp+=t[j];
                if(temp<=t)
                    vis[temp][j+1][0]=1;
                else
                    break;
            }
        }
        for(int i=1; i<=m2; i++)
        {
            vis[d2[i]][n][1]=1;
            int temp=d2[i];
            for(int j=n-1; j>=1; j--)
            {
                temp+=t[j];
                if(temp<=t)
                    vis[temp][j][1]=1;
                else
                    break;
            }
        }
        for(int i=1; i<n; i++) dp[t][i]=inf;
        dp[t][n]=0;

        for(int i=t-1; i>=0; i--)
        {
            for(int j=1; j<=n; j++)
            {
                dp[i][j]=dp[i+1][j]+1;
                if(j<n&&vis[i][j][0]&&i+t[j]<=t)
                    dp[i][j]=min(dp[i][j],dp[i+t[j]][j+1]);
                if(j>1&&vis[i][j][1]&&i+t[j-1]<=t)
                    dp[i][j]=min(dp[i][j],dp[i+t[j-1]][j-1]);
            }
        }

        printf("Case Number %d: ",ca++);
        if(dp[0][1]>=inf)
            printf("impossible\n");
        else
            printf("%d\n",dp[0][1]);
    }
    return 0;
}

```

# 更新日志
- 2014年11月15日 已AC。