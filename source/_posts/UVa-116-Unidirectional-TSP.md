---
title: UVa 116 Unidirectional TSP
date: 2014-11-16 15:39:47
tags: [ACM, UVa, C, DP]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=52

# 理解
这道题和之前做过的一道求最大四位数和有点像。那道题我是用暴力+乱搞过得，这道题则是用了刚学的DP。
不用看题，光是看图和样例就能明白大概的题意：给定一个m*n的矩阵，要求从左往右依次选择n个数，使得这n个数的和最小。不过存在这样的限制条件：首先，每次都只能选择当前数的相邻数，也就是右上，右方，右下；其次，要求字典序最小。
找到这样的一个序列并不难，不过要求输出字典序最小的就有点麻烦。通过从右向左来扫描，就能解决这样的问题。

<!-- more -->

# 代码

```

#define MAXN 10+10
#define MAXM 100+10

int m,n;
int road[MAXN][MAXM],dp[MAXN][MAXM],path[MAXN][MAXM];
int a,b,c,Min;
int ans,id;

void init()
{
    memset(road,0,sizeof(road));
    memset(dp,0,sizeof(dp));
    memset(path,0,sizeof(path));
    for(int i=0; i<n; ++i)
    {
        for(int j=0; j<m; ++j)
        {
            scanf("%d", &road[i][j]);
        }
    }
}

int main(int argc, char const *argv[])
{
    while(~scanf("%d%d", &n,&m))
    {
        init();
        for(int j=m-1; j>=0; --j)
        {
            for(int i=0; i<n; ++i)
            {
                a=dp[(i-1+n)%n][j+1];
                b=dp[i][j+1];
                c=dp[(i+1)%n][j+1];
                Min=min(a,min(b,c));

                dp[i][j]=road[i][j]+Min;
                path[i][j]=inf;
                if(Min==a)
                {
                    path[i][j]=(i-1+n)%n;
                }
                if(Min==b)
                {
                    path[i][j]=min(path[i][j],i);
                }
                if(Min==c)
                {
                    path[i][j]=min(path[i][j],(i+1)%n);
                }
            }
        }

        ans=inf;
        for(int i=0; i<n; ++i)
        {
            if(ans>dp[i][0])
            {
                ans=dp[i][0],id=i;
            }
        }
        printf("%d", id+1);
        id=path[id][0];

        for(int j=1; j<m; ++j)
        {
            printf(" %d", id+1);
            id=path[id][j];
        }

        printf("\n%d\n",ans);
    }
    return 0;
}


```

# 更新日志
- 2014年11月16日 已AC。