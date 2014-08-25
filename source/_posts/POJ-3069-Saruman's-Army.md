title: POJ 3069 Saruman's Army
date: 2014-08-25 09:31:30
tags: [ACM, POJ, C/C++, 贪心]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3069

# 理解
每一个点有自己的范围，要求所有的点都被覆盖。
一开始的解法就是贪心，从最左边开始考虑，距离这个点r以内的区域内一定要有被标记的点（包括自身），只要不断的叠加上去就OK。
后来自己想过另外一种解法，每个点的区域都进行标记，一旦两个点有重叠的部分，则意味着有一个点是多余的。不过计算之后感觉时间复杂度有点高，可能达到了O(N^3)的级别，就没有继续向下去。

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

#define MAXN 1001

int point[MAXN];
int r, n;
int cover[MAXN];

void init()
{
    memset(point, 0, sizeof(point));
    memset(cover, 0, sizeof(cover));
    for (int i = 0; i < n; i++)    cin >> point[i];
    sort(point, point + n);
}

int main(int argc, char const *argv[])
{
    while (cin >> r >> n && r != -1 && n != -1)
    {
        init();
        int i = 0, ans = 0;
        while (i < n)
        {
            int s = point[i++];
            while (i < n && point[i] <= s + r) i++;
            int p = point[i - 1];
            while (i < n && point[i] <= p + r) i++;
            ans++;
        }
        printf("%d\n", ans);
    }
    return 0;
}
```

# 更新日志
- 2014年08月25日 已AC。