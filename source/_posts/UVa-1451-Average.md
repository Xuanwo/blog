title: UVa 1451 Average
date: 2014-11-4 19:58:06
tags: [ACM, UVa, C, 几何]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=4197

# 理解
这道题被康逗逗怒拿了FB，默默地去看题，结果完全看不出什么头绪。题意扯到了DNA神马的，其实完全不重要。实际上就是给你一个由0和1组成的串，叫你求出一段长度至少为L的连续子序列，使得这个子序列的平均数最小。如果出现多解，则要求取长度小而且起点小的那个序列。
感觉像是一个DP的题目，但是对如何高效地求出这个最优解没有什么思路。后来在题解中看到了一篇论文[《浅谈数形结合思想在信息学竞赛中的应用》](http://pan.baidu.com/s/1pJJS1Ij)。首先，我们可以将目标图形化，取每一个数的序号为X上的变量，取0和1为高度，则可以得出任意两点之间的斜率为`(sum[j]-sum[i])*1.0/(j-i)`。然后开始维护一个曲线，保证这个斜率上的每一段曲线都是斜率最大的。
在一个for循环中，设最后的节点是i，i~(L,n)。然后开始寻找这个曲线中满足>L要求的最大斜率。

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

int t,n,L;
char str[MAXN];
int sum[MAXN], qu[MAXN];
double ans;
int i;

double getK(int i, int j)
{
    return (sum[j]-sum[i])*1.0/(j-i);
}

int main(int argc, char const *argv[])
{
    scanf("%d", &t);
    while(t--)
    {
        scanf("%d %d%s", &n, &L, str+1);
        memset(sum,0,sizeof(int)*(n+5));
        memset(qu,0,sizeof(int)*(n+5));
        for(i=1; i<=n; ++i)
            sum[i]=sum[i-1]+str[i]-'0';
        int len=L;
        ans=getK(0,L);
        int st=0,ed=L;
        int front=0,rear=-1;
        for(i=L; i<=n; ++i)
        {
            int temp=i-L;
            while(front<rear&&getK(qu[rear],temp)<=getK(qu[rear-1], qu[rear]))
                rear--;
            qu[++rear]=temp;
            while(front<rear&&getK(qu[front],i)<=getK(qu[front+1],i))
                front++;
            double t=getK(qu[front],i);
            if(t==ans&&len>i-qu[front])
            {
                len=i-qu[front];
                st=qu[front];
                ed=i;
            }
            else if(t>ans)
            {
                ans=t;
                len=i-qu[front];
                st=qu[front];
                ed=i;
            }
            cout<<debug<<getK(qu[front], i)<<endl;
        }
        printf("%d %d\n", st+1,ed);
    }
    return 0;
}
```

# 更新日志
- 2014年11月4日 已AC。