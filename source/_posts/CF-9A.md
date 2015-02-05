title: Codeforces Beta Round 9 A Die Roll (Div.2 Only)
date: 2014-11-13 15:29:45
tags: [ACM, Codeforces, C, 模拟]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/9/problem/A

# 理解
阅读题= =，实际上，只要Dot的点数比其他两个人中大的那个人大就行。
直接用switch搞定。

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

int m,n;

int main(int argc, char const *argv[])
{
    while(~scanf("%d%d",&n,&m))
    {
        if(n<m)
            swap(n,m);
        int x=6-n+1;
        switch(x)
        {
        case 0:
            printf("0/1\n");
            break;
        case 1:
            printf("1/6\n");
            break;
        case 2:
            printf("1/3\n");
            break;
        case 3:
            printf("1/2\n");
            break;
        case 4:
            printf("2/3\n");
            break;
        case 5:
            printf("5/6\n");
            break;
        default:
            printf("1/1\n");
        }
        return 0;
    }
}

```

# 更新日志
- 2014年11月13日 已AC。