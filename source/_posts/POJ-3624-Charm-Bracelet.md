---
title: POJ 3624 Charm Bracelet
date: 2014-10-5 10:52:48
tags: [ACM, POJ, C, DP, 01背包]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3624

# 理解
这道题拖了很久很久，一直没有搞定，对DP以及背包问题的理解，一直处在一个瓶颈之中，特别烦躁。
知道今天在比赛群里面问了学长，才发现是空间优化的问题，二维的记忆化数组会直接超出容量限制。想通了这一点后，优化就变得简单了。只要另外定义一个新的数组f[MAXN]，从M->w[i]进行循环，最后的f[m]就是所要求的结果。

<!-- more -->

# 代码
**挂在空间占用上的代码**

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

#define MAXN 3403
#define MAXW 12881

int n, m;
int w[MAXN], d[MAXN];
int dp[MAXN][MAXW];

void init()
{
    memset(w, 0, sizeof(w));
    memset(d, 0, sizeof(d));
    memset(dp, 0, sizeof(dp));
    cin >> n >> m;
    for (int i = 0; i < n; i++)
    {
        cin >> w[i] >> d[i];
    }
}

//不作任何优化的搜索，TLE
/*
int rec(int i, int j)
{
    int res;
    if (i == n)
    {
        res = 0;
    }
    else if (j < w[i])
    {
        res = rec(i + 1, j);
    }
    else
    {
        res = max(rec(i + 1, j), rec(i + 1, j - w[i]) + d[i]);
    }
    return res;
}
**/

//采用记忆化搜索，出现WA，TLE，MLE，然后我一怒之下还交了一发CE= =，不知道错在哪里。
/*
int rec(int i, int j)
{
    if (dp[i][j] >= 0)     return dp[i][j];
    int res;
    if (i == n)
    {
        res = 0;
    }
    else if (j < w[i])
    {
        res = rec(i + 1, j);
    }
    else
    {
        res = max(rec(i + 1, j), rec(i + 1, j - w[i]) + d[i]);
    }
    return dp[i][j] = res;
}
**/

void solve()
{
    for (int i = n - 1; i >= 0; i--)
    {
        for (int j = 0; j <= m; j++)
        {
            if (j < w[i])
            {
                dp[i][j] = dp[i + 1][j];
            }
            else
            {
                dp[i][j] = max(dp[i + 1][j], dp[i + 1][j - w[i]] + d[i]);
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    init();
    solve();
    printf("%d\n", dp[0][m]);
    return 0;
}

```
**修改之后成功AC的代码**

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

#define MAXN 20000

int n, m;
int w[MAXN], d[MAXN];
int dp[MAXN];

void init()
{
    memset(w, 0, sizeof(w));
    memset(d, 0, sizeof(d));
    memset(dp, 0, sizeof(dp));
    cin >> n >> m;
    for (int i = 0; i < n; i++)
    {
        cin >> w[i] >> d[i];
    }
}

void solve()
{
    for (int i = 0; i < n; i++)
    {
        for (int j = m; j >= w[i]; j--)
        {
            dp[j] = max(dp[j], dp[j - w[i]] + d[i]);
        }
    }
}

int main(int argc, char const *argv[])
{
    init();
    solve();
    printf("%d\n", dp[m]);
    return 0;
}

```

# 更新日志
- 2014年10月05日 已AC。