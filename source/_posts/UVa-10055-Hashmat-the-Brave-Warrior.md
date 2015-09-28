title: UVa 10055  Hashmat the Brave Warrior
date: 2014-10-29 13:24:02
tags: [ACM, UVa, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=996

# 理解
AOAPC上的基础题，一个非常简单的求两个数之间的差，注意数据的范围，应当采用%lld。

<!-- more -->

# 代码

```
#include  <stdio.h>

using namespace std;

int main()
{
	long long int a,b;
	while(scanf("%lld%lld", &a,&b)==2)
	{
		printf("%lld\n", a>b?a-b:b-a);
	}
	return 0;
}

```

# 更新日志
- 2014年10月29日 已AC。