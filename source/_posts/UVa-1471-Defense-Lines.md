title: UVa 1471 Defense Lines
date: 2014-11-5 19:51:46
tags: [ACM, UVa, C, 二分]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4217

# 理解
不理会逗比的国王们= =，题意很清楚，给定一个序列，要求删除一段连续的序列之后，剩下的连续递增序列最长，要求输出满足题意的序列的长度。
在初始化的时候，就可以设数组l[MAXN]，r[MAXN]来分别保存从左起和从右起的最长递增序列的长度。然后用STL内置的二分来寻找链接的地方，`lower_bound(Min + 1, Min + 1 + n, a[i])`，返回在数组Min[1~n+1]中比a[i]大的第一个数的位置。在for循环中不断更新ans的值，使得最后的结果一定最长的序列。


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

#define MAXN 200000+10

int t, n, a[MAXN], l[MAXN], r[MAXN], Min[MAXN];
int ans;

void init()
{
    ans=0;
    scanf("%d", &n);
    l[0] = 1;
    r[n - 1] = 1;
    for (int i = 0; i < n; i++)
    {
        scanf("%d", &a[i]);
        if (i)
        {
            l[i] = 1;
            if (a[i] > a[i - 1]) l[i] += l[i - 1];
        }
    }
    for (int i = n - 2; i >= 0; i--)
    {
        r[i] = 1;
        if (a[i] < a[i + 1]) r[i] += r[i + 1];
    }
}

int main(int argc, char const *argv[])
{
    scanf("%d", &t);
    while (t--)
    {
        init();
        memset(Min, 0x3f, sizeof(Min));
        for (int i = 0; i < n; i++)
        {
            int len = lower_bound(Min + 1, Min + 1 + n, a[i]) - Min;
            ans = max(ans, r[i] + len - 1);
            Min[l[i]] = min(Min[l[i]], a[i]);
        }
        printf("%d\n", ans);
    }

    return 0;
}
```
# 更新日志
- 2014年11月5日 已AC。