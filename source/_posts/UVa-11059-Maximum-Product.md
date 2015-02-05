title: UVa 11059 Maximum Product
date: 2014-10-27 14:05:31
tags: [ACM, UVa, C, 暴力]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=22&page=show_problem&problem=2000

# 理解
这道题卡了两个半小时，各种神体位卡数据。
最开始题意理解错误，认为是要求出最大的乘积，实际上应该是求最大的连续积。然后在for循环的开始和结束全都卡了很多次，卡long long，卡输出，卡边界条件，直到队友看不下去了来帮我看代码，才终于解脱= =。
天若了，真的太弱了- -，遇到这种坑特别多的题目，发挥就各种失常，这样可不行。

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
#include <stack>
#include <queue>
#include <numeric>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug puts("-----\n")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

#define MAXN 18+10

int n,flag=0;
int a[MAXN];
long long int ans;
long long int tmp;

int main()
{
    while(~scanf("%d",&n))
    {
        for(int i=0;i<n;i++)
        {
            scanf("%d", &a[i]);
        }
        ans=a[0];
        for(int i=0;i<n;i++)
        {
            for(int j=n-1;j>=i;j--)
            {
                tmp=1;
                for(int x=i;x<=j;x++)
                {
                    tmp*=a[x];
                }
                if(ans<tmp) ans=tmp;
            }
        }
        if(ans<0)   ans=0;
        printf("Case #%d: The maximum product is %lld.\n\n", ++flag, ans);
    }

}

/*
3
2 4 -3

5
2 5 -1 2 -1

**/
```

# 更新日志
- 2014年10月27日 已AC。