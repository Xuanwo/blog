title: POJ 1247 Magnificent Meatballs
date: 2014-07-23 02:03:12
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1247

# 理解
让给的肉丸子少的人继续给，直到最后判断是否相等。

<!-- more -->

# 代码
```
#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;

int table[33];

int main(int argc, char const *argv[])
{
    int n;
    while(cin>>n,n)
    {
        memset(table,0,sizeof(table));
        int i;
        for(i=1;i<=n;i++)
        {
            cin>>table[i];
        }
        int sumE=0,sumS=0;
        int postE=n,postS=1;
        while(postS<=postE)
        {
            if(sumE>=sumS) {sumS+=table[postS];postS++;}
            else {sumE+=table[postE];postE--;}
        }
        if(sumE!=sumS)
        {
            cout<<"No equal partitioning."<<endl;
        }
        else cout<<"Sam stops at position "<<--postS<<" and Ella stops at position "<<++postE<<"."<<endl;
    }
    return 0;
}
```

# 更新日志
- 2014年07月23日 已AC。