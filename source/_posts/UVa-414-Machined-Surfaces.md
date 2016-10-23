---
title: UVa 414 Machined Surfaces
date: 2014-10-31 17:13:19
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=355

# 理解
题意还是比较好理解的，实际上就是求将两端合并，中间还会剩余多少个空格。只要找到X最多的那一行，问题就变得简单了。
不过还是逗了一发，因为忘记把freopen注释掉= =，蛋疼。

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

int N;
int a[20],Max = 0;
char line[30];
int ans;

int main()
{
    //freopen ("414.in","r",stdin);
    while(scanf("%d",&N),N)
    {
        ans=0,Max=0;
        memset(a,0,sizeof(a));
        memset(line,0,sizeof(line));
        getchar();
        for (int i=0; i<N; i++)
        {
            gets(line);
            for (int j=0; line[j]; j++)
                if (line[j]=='X')
                    a[i]++;
            if (a[i]>Max)
                Max = a[i];
        }
        for (int i=0; i<N; i++)
            ans += (Max-a[i]);
        printf("%d\n",ans);
    }
    return 0;
}

```

# 更新日志
- 2014年10月31日 已AC。