---
layout: post
title: UVa 458 The Decoder
date: 2014-10-30 15:16:38
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=399

# 理解
看起来有点吓人，实际上是一道很水的题目。
直接在编译器里面计算了一下'1'-'*'的值，为7。只要字符串里面的每一个字符都减去7，就能得到想要的结果。采用了一个姿势不是很优越的遍历，不知道还有没有更好的优化空间。

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

#define MAXN 1<<10

char a[MAXN],b[MAXN];

int main(int argc, char const *argv[])
{
    while(~scanf("%s",a))
    {
        memset(b,0,sizeof(b));
        for(int i=0;i<strlen(a);i++)
        {
            b[i]=a[i]-7;
        }
        printf("%s\n", b);
    }
	return 0;
}

```

# 更新日志
- 2014年10月30日 已AC。