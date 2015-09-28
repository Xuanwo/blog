title: UVa 11054 Wine trading in Gergovia
date: 2014-11-5 19:34:31
tags: [ACM, UVa, C, 贪心]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1995

# 理解
我又逗了= =，想得太复杂。
其实不管两个村庄距离有多远或者是他们的需求量有多大，每个村庄实际上都只能跟最近的两个村庄交易，因为运输的时候会经过每一个村庄。因此直接搞就可以了。

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

#define MAXN 100000+10

int n;
int bott[MAXN];
ll ans;
int i;

int main(int argc, char const *argv[])
{
    while(scanf("%d" , &n) && n)
    {
        for(i = 0 ; i < n ; i++)
            scanf("%d" , &bott[i]);
        ans = 0;
        for(i = 1 ; i < n ; i++)
        {
            bott[i] += bott[i-1];
            ans += abs(bott[i-1]);
        }
        printf("%lld\n" , ans);
    }

    return 0;
}

```

# 更新日志
- 2014年11月5日 已AC。