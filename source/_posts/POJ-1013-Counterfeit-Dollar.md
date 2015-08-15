title: POJ 1013 Counterfeit Dollar
date: 2014-07-10 14:22:44
tags: [ACM, POJ, C, 模拟]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1013

# 理解
总共有12枚银币，里面有一枚是假货。要求通过三次称量，找出那枚假币，并说出是重了还是轻了。题目中明确指出，三次称量必定能找出那枚假货，使得问题简化了很多。一开始的想法是完全模拟出来，但写到代码的时候感觉过于蛋疼，然后想能不能用一些由计算机来推导的方法。在具体的实现中，发现我很难把问题抽象成计算机可以处理的问题。在一份[解题报告](http://blog.csdn.net/lyy289065406/article/details/6661421)的启发下，想到了使用一个数值来度量每个银币可能为假币的可能性的方法。

<!-- more -->

# 代码
```
#include <iostream>
#include <stdlib.h>
using namespace std;

int main()
{
	int n;
	cin>>n;
	while(n--)
	{
		char left[3][6],right[3][6],status[3][6];

		int time['L'+1]={0};  
		bool zero['L'+1]={false};  

		for(int k=0;k<3;k++)
			cin>>left[k]>>right[k]>>status[k];	

		for(int i=0;i<3;i++)
		{
			switch(status[i][0])  
			{
			    case 'u':    
					{
						for(int j=0;left[i][j];j++)
						{
							time[ left[i][j] ]++;  
							time[ right[i][j] ]--;  
						}
						break;
					}
				case 'd':    
					{
						for(int j=0;left[i][j];j++)
						{
							time[ left[i][j] ]--;  
							time[ right[i][j] ]++;  
						}
						break;
					}
				case 'e':     
					{
						for(int j=0;left[i][j];j++)
						{
							zero[ left[i][j] ]=true;   
							zero[ right[i][j] ]=true;  
						}
						break;
					}
			}
		}

		int max=-1;  
		char alpha;
		for(int j='A';j<='L';j++)
		{
			if(zero[j])  
				continue;

			if(max<=abs(time[j]))
			{
				max=abs(time[j]);
				alpha=j;
			}
		}

		cout<<alpha<<" is the counterfeit coin and it is ";
		if(time[alpha]>0)
			cout<<"heavy."<<endl;
		else
			cout<<"light."<<endl;
	}
	return 0;
}
```

# 更新日志
2014年07月10日 已AC(C++下通过，G++下WA)，准备择日修复。