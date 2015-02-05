title: UVa 524 Prime Ring Problem
date: 2014-11-2 13:47:34
tags: [ACM, UVa, C, DFS]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=465

# 理解
一开始写了一个特别暴力的程序，吃饭之前让它一直跑，但是一直到我吃完饭回来还在跑14- -，默然泪。
然后推倒重来，开始用回朔法重写。实际上，我并不需要把所有的排列完全生成出来再进行判断，通过回朔法，我可以在生成排列的同时进行判断。这里也运用了深搜的思想，实际上是一个n*n的矩阵，我要找出满足表达式`i+A[cur-1]`为指数的那条路径。
搞定了主要的算法，下面就是一些细节的处理。首先，我不需要每一次都调用isPrime函数，因为n<=16，也就是可能出现的最大和是小于32的，我可以在预处理中先判断好是否为质数再拿来用。其次，事先必须指定A[0]=1，vis[1]=1，同时dfs()是从1开始的，注意数组的下标。最后，是输出的处理：每一行末尾的空格，每组数据之间的空行，不要多也不要少，虽然琐碎但是却会决定你能否AC。

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

#define MAXN 50

int n,flag=0;
int A[MAXN],isp[MAXN],vis[MAXN];

bool isPrime(int x)
{
    for(int j=2; j<=(int)sqrt(x); j++)
    {
        if(x%j==0)  return false;
    }
    return true;
}

void dfs(int cur)
{
    if(cur==n && isp[A[0]+A[n-1]])
    {
        for(int i=0; i<n; i++)
        {
            printf("%d", A[i]);
            if(i!=n-1)  printf("%c", ' ');
        }
        printf("\n");
    }
    else
        for(int i=2; i<=n; i++)
        {
            if((!vis[i]&&isp[i+A[cur-1]]))
            {
                A[cur]=i;
                vis[i]=1;
                dfs(cur+1);
                vis[i]=0;
            }
        }
}

int main(int argc, char const *argv[])
{

    for(int i=1; i<100; i++)
    {
        if(isPrime(i))  isp[i]=i;
        else isp[i]=0;
    }
    while(~scanf("%d", &n))
    {
        flag++;
        if(flag>1)
            printf("\n");
        printf("Case %d:\n", flag);
        memset(vis,0,sizeof(vis));
        A[0]=1;
        vis[1]=1;
        dfs(1);
    }
    return 0;
}
```

# 更新日志
- 2014年11月2日 已AC。