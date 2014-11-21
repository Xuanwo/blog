title: Codeforces Beta Round 12 C Fruits
date: 2014-11-21 21:54:07
tags: [ACM, Codeforces, C/C++, 字符串, 贪心]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/12/problem/C

# 理解
题意并不复杂：给定一些标价牌，然后再给定一些水果的名字，每种水果对应一个标价牌。要求输出水果总价的最大值和最小值。
第一眼感觉很简单，贪心乱搞。标价牌排序之后，如果求最小值就从前往后选；如果求最大值，就从后往前选。这个思路没有太大的问题，然后问题来了，我怎么样才能够得到一个去除重复项，并且能计算出每种水果数量的数据结构呢？
然后我就开始SB了，因为循环的时候字符串写得搓，debug半天，都不符合我的预期。等到队友们基本都过了，我才勉强A题。

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

int n,m;
int price[MAXN];
string x[MAXN];
string y[MAXN];
int flag[MAXN];
int tmp;
int ansMin,ansMax;

struct node
{
    string s;
    int flag;
}str[MAXN];

bool cmp(node a, node b)
{
    return a.flag>b.flag;
}

void init()
{
    tmp=0;
    memset(flag,0,sizeof(flag));
    scanf("%d%d", &n,&m);
    for(int i=0; i<n; i++)
    {
        scanf("%d", &price[i]);
    }
    sort(price, price+n);
    for(int i=0; i<m; i++)
    {
        cin>>x[i];
    }
    sort(x,x+m);
    y[tmp]=x[0];
    flag[0]=1;
    for(int i=1;i<m;i++)
    {
        if(x[i].compare(y[tmp])==0)
        {
            flag[tmp]++;
        }
        else
        {
            tmp++;
            y[tmp]=x[i];
            flag[tmp]=1;
        }
    }
    tmp++;
    for(int i=0;i<tmp;i++)
    {
        str[i].s=y[i];
        str[i].flag=flag[i];
    }
    sort(str,str+tmp,cmp);
}

int main(int argc, char const *argv[])
{
    init();
    for(int i=0;i<tmp;i++)
    {
        ansMin+=str[i].flag*price[i];
        ansMax+=str[i].flag*price[n-i-1];
    }
    printf("%d %d\n", ansMin, ansMax);
    return 0;
}
```

# 更新日志
- 2014年11月21日 已AC。