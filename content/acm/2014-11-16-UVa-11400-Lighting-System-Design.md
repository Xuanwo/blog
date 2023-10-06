---
categories: Code
date: 2014-11-16T16:33:57Z
title: UVa 11400 Lighting System Design
toc: true
url: /2014/11/16/UVa-11400-Lighting-System-Design/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2395

# 理解
变量多的题目确实头疼，我来稍微捋一下。
题目中给出n中灯泡，不同的灯泡要用不同的电源，相同的灯泡可以使用相同的电源。然后每种灯泡有着四种参数，电压v，电源费用k，每个灯泡的费用c，所需要的该种灯泡的数量l。小脑一动就能明白，每次更换只会采用同一种灯泡，因为不同中灯泡的话要买两种电源，一定不是最优解。
这样的话，按照电压进行排序之后，可以得到递推公式：
`dp[i]=min(dp[i], dp[j]+(sum[i]-sum[j])*s[i].c+s[i].k)`
其中sum[i]=sum[i-1]+s[i].l;

<!--more-->

# 代码

```

#define MAXN 1000+10

struct node
{
    int v,k,c,l;
}s[MAXN];

int n,sum[MAXN],dp[MAXN];

bool cmp(node a, node b)
{
    return a.v<b.v;
}

void init()
{
    memset(sum,0,sizeof(sum));
    memset(dp,0,sizeof(dp));
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d", &s[i].v,&s[i].k,&s[i].c,&s[i].l);
    }
    sort(s+1,s+n+1,cmp);
}

int main(int argc, char const *argv[])
{
    while(~scanf("%d", &n)&&n)
    {
        init();
        for(int i=1;i<=n;i++)
        {
            sum[i]+=sum[i-1]+s[i].l;
        }
        dp[1]=s[1].k+s[1].c*s[1].l;
        for(int i=2;i<=n;i++)
        {
            dp[i]=inf;
            for(int j=0;j<i;j++)
            {
                dp[i]=min(dp[i], dp[j]+(sum[i]-sum[j])*s[i].c+s[i].k);
            }
        }
        printf("%d\n", dp[n]);
    }
	return 0;
}

```

# 更新日志
- 2014年11月16日 已AC。