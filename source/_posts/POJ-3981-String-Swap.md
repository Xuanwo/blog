title: POJ 3981 字符串替换
date: 2014-08-06 16:00:00
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3981

# 理解
大水题一道，字符串函数的简单运用

<!-- more -->

# 代码
```
#include <iostream>
#include <string>

using namespace std;

int main(int argc, char const *argv[])
{
	string str;
	while(getline(cin, str))
	{
		int start = str.find("you");
		while(start != string::npos) 
		{
			str.replace(start, 3, "we");
			start = str.find("you", start+2); 
		}
		cout << str << endl;
	}
	return 0;
}
```
	
# 更新日志
- 2014年08月06日 已AC。