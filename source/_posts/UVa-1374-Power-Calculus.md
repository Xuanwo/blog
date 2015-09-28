title: UVa 1374 Power Calculus
date: 2014-11-2 15:04:43
tags: [ACM, UVa, C, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=512&page=show_problem&problem=4120

# 理解
这次的题意比较清楚，就是给定n，求出从1变换到n的最小步数。
同样的迭代深搜，- -，我不行了= =，一口气补了三道，整个人都虚了。。

还是来小结一下吧。以前做的DFS都是裸题，很容易就能看出来。而迭代深搜这一类的题目，通常都是给定一些条件，要求求出指定条件的一些组合，可能是字符串也有可能是数。而且，通常都会有暴力的做法，不过姿势不优越的话，很容易超时。
然后在迭代深搜的过程中，一定要注意初始状态和边界条件，要不然很容易陷入死循环或者无法得到完整的结果。

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

#define N 3005

int aid, tmp, v[N], rec[N], pTow[50], ans[N];

bool dfs(int d, int s)
{
    if (d == tmp && s == aid) return true;
    if (d >= tmp || s > 1500) return false;
    if (s * pTow[tmp - d] < aid) return false;

    rec[d] = s;
    v[s] = 1;

    for (int i = 0; i <= d; i++)
    {
        int u = rec[i] + s;
        if (v[u] == 0)
            if (dfs(d + 1, u)) return true;

        u = abs(s - rec[i]);
        if (v[u] == 0)
            if (dfs(d + 1, u)) return true;
    }
    v[s] = 0;
    return false;
}

int solve()
{
    tmp = 0;
    memset(v, 0, sizeof(v));
    while (1)
    {
        if (dfs(0, 1)) break;
        tmp++;
    }
    return tmp;
}

void init()
{
    pTow[0] = 1;
    for (int i = 1; i <= 31; i++) pTow[i] = pTow[i - 1] * 2;
}

int main(int argc, char const *argv[])
{
    init();
    while (scanf("%d", &aid) == 1 && aid)
    {
        printf("%d\n", solve());
    }
    return 0;
}

```

# 更新日志
- 2014年11月2日 已AC。