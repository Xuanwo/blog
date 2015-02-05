title: CodeVS 1842 递归第一次
date: 2014-10-20 21:40:51
tags: [ACM, CodeVS, C, 递归]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codevs.cn/problem/1842/

# 理解
还是一道水题，不过卡了RE。研究之后发现，问题出在我的记忆化搜索上面，我的记忆化数组的下标出现了负值，所以出现了RE。后来想了想，通过加上一个最小负数的绝对值，使得出现的每一个x都是非负数，然后解决了这个问题。

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
#define ll long long int
using namespace std;

#define MAXN 10000

int x;
int n[MAXN];

int f(int x)
{
    if(n[x+30]!=0) return n[x+30];
    if(x>=0)    return n[x+30]=5;
    else
    {
        return n[x+30]=f(x+1)+f(x+2)+1;
    }
}

int main(int argc, char const *argv[])
{
	memset(n,0,sizeof(n));
	scanf("%d", &x);
	printf("%d\n", f(x));
	return 0;
}
```

# 更新日志
- 2014年10月20日 已AC。