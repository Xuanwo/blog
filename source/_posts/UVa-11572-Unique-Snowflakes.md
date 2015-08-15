title: UVa 11572 Unique Snowflakes
date: 2014-11-5 19:38:51
tags: [ACM, UVa, C, 模拟]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://uva.onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=2619

# 理解
题意是酱紫的：给定一组数，叫你求出不含有重复数字的最长子序列的长度。
使用数组pos[x]记录数字x第一次出现的位置，初始化为-1。枚举这个数列，依次记录每一个数的位置。然后用start标记当前这个子序列的起点。显然的，当枚举到i的时候，如果有`pos[arr[i]]<start`，说明这个数肯定在[start, i-1]之间出现过。此时就停止本次枚举，要是`pos[arr[i]]>start`，则长度+1，并且进行下一次枚举。直到结束，最后的长度一定是最长的子序列。

<!-- more -->

# 代码
```#include <cstdio>
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

#define MAXN 1000010

int t,n,a;
int arr[MAXN];
int pos[MAXN];
int cnt,start,maxx;

void init()
{
    memset(pos, -1, sizeof(pos));
    scanf("%d", &n);
    cnt=0,start=0,maxx=0;
    for(int i=0; i<n; ++i)
        scanf("%d", &arr[i]);
    arr[n] = arr[n-1];
}

int main(int argc, char const *argv[])
{
    scanf("%d", &t);
    while(t--)
    {
        init();
        for(int i=0; i<=n; ++i)
        {
            if(pos[arr[i]] >= start)
            {
                int tmp = i - start;
                maxx = max(tmp, maxx);
                start = pos[arr[i]]+1;
                pos[arr[i]] = i;
            }
            else
            {
                pos[arr[i]] = i;
            }

        }
        printf("%d\n", maxx);
    }
    return 0;
}
```
# 更新日志
- 2014年11月5日 已AC。