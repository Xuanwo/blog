title: CodeVS 1212 最大公约数
date: 2014-10-15 12:04:02
tags: [ACM, CodeVS, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codevs.cn/problem/1212/

# 理解
水题。
只要使用gcd递归就可以搞定。

<!-- more -->

# 新技能get
**GCD模板代码**

```
int gcd(int a, int b)
{
	return b==0?a:gcd(b,a%b);
}

```

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

ll a,b;

ll gcd(ll a, ll b)
{
	return b==0?a:gcd(b,a%b);
}

int main(int argc, char const *argv[])
{
	scanf("%lld%lld", &a, &b);
	printf("%lld", gcd(a,b));
	return 0;
}

```

# 更新日志
- 2014年10月15日 已AC。