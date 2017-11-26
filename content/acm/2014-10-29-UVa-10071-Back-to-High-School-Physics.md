---
categories: Exercise
date: 2014-10-29T20:09:12Z
title: UVa 10071 Back to High School Physics
toc: true
url: /2014/10/29/UVa-10071-Back-to-High-School-Physics/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1012

# 理解
很简单的一道水题，通过简单的计算就能得出最后的结果是2vt。

<!--more-->

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

int main(int argc, char const *argv[])
{
	ll t,v;
	while(~scanf("%lld%lld", &v,&t ))
    {
        printf("%lld\n", 2*v*t);
    }
	return 0;
}

```

# 更新日志
- 2014年10月29日 已AC。