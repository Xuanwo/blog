title: POJ 1004 Financial Management
date: 2014-07-04 18:41:50
tags: [ACM, POJ, 模拟, C/C++]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1004

# 理解
额，就是求解12个数的平均数。不过据说POJ不能用lf，还要我没有遇到这样的问题，交了一个float水过。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <iostream>

using namespace std;

int main()
{
	int n=12;
	float money,sum=0;
	for(int i=0;i<12;i++)
		{
			cin>>money;
			sum+=money;
		}
	printf("$%.2f", sum/12);
	return 0;
}
```

# 更新日志
- 2014年07月04日  已AC。