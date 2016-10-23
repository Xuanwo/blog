---
title: UVa 10003 Cutting Sticks
date: 2014-11-16 17:12:15
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=944

# 理解
之前在COJ上好像做过类似的题目。
同样是木材切割，不过这次每次切割都会消耗跟木棒长度相同的代价，要求的是最小代价的切割。
小脑一动就可以知道，存在递推公式：
`dp[x][y]=min(dp[x][y],dp[x][a[k]]+dp[a[k]][y]+y-x)`

<!-- more -->

# 代码

```

#define MAXN 1000+10
#define MAXM 50+10

int a[MAXM],dp[MAXN][MAXN];
int n,m;

void init()
{
    memset(a,0,sizeof(a));
    scanf("%d", &m);
    a[0]=0,a[m+1]=n;
    for(int i=1; i<=m; i++)
    {
        scanf("%d", &a[i]);
    }
    for(int i=0; i<=m; i++)
    {
        dp[a[i]][a[i+1]]=0;
    }
}

int main(int argc, char const *argv[])
{
    while(~scanf("%d",&n)&&n)
    {
        init();
        for(int l=2; l<=m+1; l++)
        {
            for(int i=0; i<=m-l+1; i++)
            {
                int j=i+l,x=a[i],y=a[j];
                dp[x][y]=inf;
                for(int k=i+1; k<j; k++)
                {
                    dp[x][y]=min(dp[x][y],dp[x][a[k]]+dp[a[k]][y]+y-x);
                }
            }
        }
        printf("The minimum cutting is %d.\n",dp[0][n]);
    }
    return 0;
}

```

# 更新日志
- 2014年11月16日 已AC。