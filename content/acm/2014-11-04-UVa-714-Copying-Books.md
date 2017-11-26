---
categories: Exercise
date: 2014-11-04T13:29:52Z
title: UVa 714 Copying Books
toc: true
url: /2014/11/04/UVa-714-Copying-Books/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=113&page=show_problem&problem=655

# 理解
比赛的时候读懂了题意，但是没有拿出来敲，因为感觉自己应该是敲不出来的。实际上，这是一道小白书上提到过的题目，也就是最大值最小化问题。
![算法竞赛入门经典P151](/imgs/exercise/UVa-714.jpg)
使用一个pos数组来保存是否在此分段，然后使用二分最小值来确定pos的取值。
实际上我还不是能够非常具体地描述中间二分的过程，不妨在二分的循环当中打印pos数组的值来找一找感觉。


```
Input:
1
9 3
100 200 300 400 500 600 700 800 900

Output:
0 0 0 0 0 1 0 0 0
0 0 0 0 0 1 0 0 0
0 0 0 0 0 0 1 0 0
0 0 0 1 0 0 1 0 0
0 0 0 1 0 0 1 0 0
0 0 0 0 0 0 0 1 0
0 0 0 0 0 0 1 1 0
0 0 0 0 1 0 1 1 0
0 1 0 0 1 0 1 1 0
0 1 0 0 1 0 1 1 0
0 0 0 0 0 0 0 1 0
0 0 0 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 0 0 0 0 0 1 0
0 0 0 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 0 0 0 1 0
0 0 0 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 0 0 0 0 0 1 0
0 0 0 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 1 0 0 1 0 1 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 0 0 1 0 0
0 0 0 0 1 0 1 0 0
0 0 0 0 1 0 1 0 0

100 200 300 400 500 / 600 700 / 800 900

```

除去最后一行是答案，不去考虑之外，我们可以看到这是一个在中央取值，然后不断向右靠拢的过程。

<!--more-->

# 代码

```

#define MAXN 500+10

int m,k;
ll arr[MAXN],sum,Min, ans;
bool vis[MAXN];

int divide(ll M)
{
    memset(vis,0,sizeof(vis));
    int cnt=0;
    int pos=m-1;
    while(pos>=0)
    {
        ll sum=0;
        bool ok=true;
        while(pos>=0&&sum+arr[pos]<=M)
        {
            ok=false;
            sum+=arr[pos];
            --pos;
        }
        if(ok)
        {
            return k+1;
        }
        if(pos>=0)  vis[pos]=true;
        ++cnt;
        for(int i=0;i<m;i++)
        {
            cout<<vis[i]<<' ';
        }
        cout<<endl;
    }
    return cnt;
}

ll binary()
{
    ll l=Min,r=sum,mid;
    while(l<r)
    {
        mid=(l+r)>>1;
        if(divide(mid)<=k)
            r=mid;
        else
            l=mid+1;
    }
    return r;
}

void init()
{
    scanf("%d%d", &m,&k);
    sum=0,Min=0;
    for(int i=0; i<m; ++i)
    {
        scanf("%lld", &arr[i]);
        sum+=arr[i];
        if(arr[i]>Min)  Min=arr[i];
    }
}

int main(int argc, char const *argv[])
{
    int t;
    scanf("%d", &t);
    while(t--)
    {
        init();
        ans=binary();
        int cnt=divide(ans);
        for(int i=0; i<m-1&&cnt<k; ++i)
        {
            if(!vis[i])
            {
                vis[i]=true;
                ++cnt;
            }
        }
        for(int i=0; i<m; ++i)
        {
            if(i)   printf(" %lld", arr[i]);
            else printf("%lld", arr[i]);
            if(vis[i])
            {
                printf(" /");
            }
        }
        printf("\n");
    }
    return 0;
}

```

# 更新日志
- 2014年11月4日 已AC。