title: Codeforces Beta Round 4 B Before an Exam
date: 2014-11-3 19:13:39
tags: [ACM, Codeforces, C, 简单]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codeforces.com/contest/4/problem/B

# 理解
水题一枚。
首先计算出最小的边界和，然后计算出最大的边界和。只要题目给定的sum不在这个范围内，一定无解。然后使用贪心的方法，计算出tem=最大边界和-sum。然后一个一个减去两个边界之间的差值，直到tem被减为零。

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

#define MAXN 30+10

int sum,d,Max[MAXN],Min[MAXN];

int main(int argc, char const *argv[])
{
	while(~scanf("%d %d",&d,&sum))
	{
		int Maxt=0,Mint=0;
		for(int i=0;i<d;i++)
		{
			scanf("%d %d",Min+i,Max+i);
			Mint+=Min[i];
			Maxt+=Max[i];
		}
		if(sum>=Mint&&sum<=Maxt)
		{
			puts("YES");
			int tem=Maxt-sum;
			for(int i=0;i<d;i++)
			{
				if(Max[i]-Min[i]<tem)
				{
					tem-=(Max[i]-Min[i]);
					Max[i]=Min[i];
				}
				else
				{
					Max[i]-=tem;
					break;
				}
			}
			for(int i=0;i<d;i++)
				if(i!=d-1)
				printf("%d ",Max[i]);
			    else
				printf("%d\n",Max[i]);
		}
		else
		{
			puts("NO");
		}
	}
}
```

# 更新日志
- 2014-11-3 已AC。