title: Codeforces Beta Round 4 A Watermelon
date: 2014-11-3 11:23:56
tags: [ACM, Codeforces, C, 简单]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/4/problem/A

# 理解
真不愧是过了1W+的题= =，水的真可怕。
唯一的trick是当w等于2的时候，不能分成两个偶数。

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

int w;

int main(int argc, char const *argv[])
{
    scanf("%d", &w);
	if(w==2)
        printf("NO\n");
    else
    {
        if(w%2==0)
            printf("YES\n");
        else
            printf("NO\n");
    }
	return 0;
}
```

# 更新日志
- 2014年11月3日 已AC。