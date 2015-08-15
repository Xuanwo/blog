title: UVa 11093 Just Finish it up
date: 2014-11-6 14:18:10
tags: [ACM, UVa, C, 模拟, 剪枝]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2034

# 理解
比赛的时候没有敲出来。
当时看范神拿了一血，默默地去看题。然后觉得应该跟小白书上那个加油站的优先队列是一样的题目，敲了一会儿之后感觉不对，然后就放弃了这道题。后来想想，这两道题的区别在于，一个是环形的路线，一个是单向的路径，处理的方法应该是不一致的。比赛过后想到，其实就算是环形，也是可以处理成单向问题的。只要开一个两倍MAXN的数组，然后从起点开始截取n个数，就能将一个环从起点处截成一条直线。然后就能用类似的办法进行处理了。
具体的实现过程是这样：只要用一个数组保存可以添加的油量，然后不断减去消耗的油量，然后再不断进行求和。很显然，当`a[i]>=start`时，这个站点时可以通过的；当`a[i]<start`时，这个站点是不可通过的。然后再遍历寻找字典序最小的起点。

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

int a[2*MAXN],x;
int n,t,flag=0;

int main(int argc, char const *argv[])
{
	scanf("%d", &t);
	while(t--)
    {
        flag++;
        scanf("%d", &n);
        for(int i=1;i<=n;i++)
        {
            scanf("%d", &a[i]);
            a[n+i]=a[i];
        }
        for(int i=1;i<=n;i++)
        {
            scanf("%d", &x);
            a[i]-=x;
            a[n+i]-=x;
        }

        a[0]=0;
        for(int i=1;i<=2*n;i++)
        {
            a[i]+=a[i-1];
        }
        int s=0,mi=1,cn=0;
        for(int i=0;i<=2*n;i++)
        {
            if(a[i]>=mi)
            {
                if(++cn>n)  break;
            }
            else
            {
                mi=a[i];
                s=i;
                cn=1;
                if(i>=n)    break;
            }
        }
        printf("Case %d: ", flag);
        if(cn>n)    printf("Possible from station %d\n", s+1);
        else printf("Not possible\n");
    }
	return 0;
}
```

# 更新日志
- 2014年11月6日 已AC。