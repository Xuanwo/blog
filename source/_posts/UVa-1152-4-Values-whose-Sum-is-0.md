title: UVa 1152 4 Values whose Sum is 0
date: 2014-11-5 19:31:30
tags: [ACM, UVa, C, 二分, 暴力]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3593

# 理解
题意非常清楚，就是在一个矩阵里面找出四个数，使得他们的和为零。
一开始的想法是DFS，把这个看成一个四层的图，不停搜索就行了。但是DFS写得太搓了，各种姿势挂，后来决定二分暴力乱搞。
思路是这样，把这个矩阵分成左右两份，然后只要一个两层的for循环，就能用两个数组保存下所有可能出现的数字组合的和。有一个小小的技巧是，第二份在保存的时候保存为他们的负数，这样在后面的二分中，只要判断是不是相等就可以了，减少了计算量。
最后感慨一下，一千六百万的数组也能开的出来= =。

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

#define MAXN 16100000

int a[4][4444],n,t;
int num1[MAXN],num2[MAXN],c;
int i,j,ans,casen=0;


int bin(int left,int right,int k)
{
    while(left<=right)
    {
        int mid=(left+right)/2;
        int num=0;
        if(num2[mid]==k)
        {
            num=1;
            for(i=mid-1; i>=0&&num2[i]==k; i--)  num++;
            for(i=mid+1; i<n*n&&num2[i]==k; i++)  num++;
            return num;
        }
        else if(num2[mid]>k)
            right=mid-1;
        else left=mid+1;
    }
    return 0;
}

void init()
{
    scanf("%d",&n);
    ans=0;
    c=0;
    for(i=0; i<n; i++)
    {
        scanf("%d %d %d %d",&a[0][i],&a[1][i],&a[2][i],&a[3][i]);
    }
    for(i=0; i<n; i++)
    {
        for(j=0; j<n; j++)
        {
            num1[c]=a[2][i]+a[3][j];
            num2[c++]=-(a[0][i]+a[1][j]);
        }
    }
    sort(num2,num2+c);
}

int main(int argc, char const *argv[])
{
    int i,j;
    scanf("%d", &t);
    while(t--)
    {
        casen++;
        if(casen>1) printf("\n");
        init();
        for(i=0; i<c; i++)
        {
            ans+=bin(0,n*n-1,num1[i]);
        }
        printf("%d\n",ans);
    }
    return 0;
}
```

# 更新日志
- 2014年11月5日 已AC。