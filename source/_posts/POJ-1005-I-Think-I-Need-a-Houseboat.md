title: POJ 1005 I Think I Need a Houseboat
date: 2014-07-06 19:04:08
tags: [ACM, POJ, 模拟, C/C++]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1005

# 理解
一块地按照`50 square miles each year`的速度被腐蚀，给定一个坐标要求计算到第几年的时候被腐蚀。自然是一道大水题：计算出给定坐标到原点的距离，取这个距离为半径求出实际的半圆面积，然后跟已经被腐蚀的面积比较一下即可。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <iostream>
#include <math.h>
using namespace std;

#define PI 3.14

float dis(float x, float y)
{
	return sqrt(x*x+y*y);
}

int main()
{
	int n,year,flag;
	float x,y;
	flag=1;
	cin>>n;
	while(n--)
	{
		cin>>x>>y;
		year=1;
		while(100*year<PI*dis(x,y)*dis(x,y))
			year++;
		cout<<"Property "<<flag<<": This property will begin eroding in year "<<year<<"."<<endl;
		flag++;
	}
	cout<<"END OF OUTPUT.";
	return 0;
}
```
# 更新日志
- 2014年07月06日 已AC。