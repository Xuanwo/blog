title: POJ 3518 Prime Gap
date: 2014-07-23 23:50:16
tags: [ACM, POJ, C, 二分]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3518

# 理解
虽然看起来并没有二分计算的代码，但是应用了二分的思想。设两个端点，分别向两个方向扩展，最后的结果就是两个端点的差值。

<!-- more -->

# 代码

```
#include  <iostream>
#include  <cmath>

using namespace std;

bool isPrime(int n)
{
    for(int i=2;i<=sqrt((double)n);i++)
    {
        if(n%i==0)  return false;
    }
    return true;
}

int main()
{
    int n;
    while(cin>>n&&n!=0)
    {
        if(isPrime(n))
        {
            cout<<0<<endl;
        }
        else
        {
            int x=n-1;
            int y=n+1;
            while(!isPrime(x))  x--;
            while(!isPrime(y))  y++;

            cout<<y-x<<endl;
        }
    }
    return 0;
}

```

# 更新日志
- 2014年07月23日 已AC。