title: Codeforces Beta Round 5 B Center Alignment
date: 2014-11-5 15:43:15
tags: [ACM, Codeforces, C, 字符串]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/5/problem/B

# 理解
题目不难，不过输出上有点问题，因为题目要求左右均匀分布，上一次偏左则下一次需要偏右。
当总长度为偶数的时候，没有太大的问题；但是当总长度为奇数时，则需要考虑到底应该偏左还是偏右的问题。那么就需要两次判断，首先判断总长度，也就是最大长度是不是
偶数，当总长度不是偶数时，则判断这个字符串是不是偶数。使用一个计数变量num来保存是否是否应该偏左，每一次判断完毕之后都自增一次，这样就能实现保持左右均衡。

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-4)
#define inf (1<<28)
#define ll long long int
using namespace std;


string tmp,a;
queue<string> word;
int Max,n=0;
int len,num=0;;

int main()
{
    while(getline(cin,tmp))
    {
        n++;
        if(Max<tmp.size())  Max=tmp.size();
        word.push(tmp);
    }
    for(int i=0; i<Max+2; i++)  printf("*");
    printf("\n");
    for(int i=0; i<n; i++)
    {
        printf("*");
        a=word.front();
        word.pop();
        int l=Max-a.size();
        int s=l/2;
        if(l%2!=0)
        {
            num++;
            if(num%2!=0)
            {
                for(int j=0; j<s; j++)   printf(" ");
                cout<<a;
                for(int j=0; j<l-s; j++)   printf(" ");
                printf("*\n");
            }
            else
            {
                for(int j=0; j<l-s; j++)   printf(" ");
                cout<<a;
                for(int j=0; j<s; j++)   printf(" ");
                printf("*\n");

            }
        }
        else
        {
            for(int j=0; j<s; j++)   printf(" ");
            cout<<a;
            for(int j=0; j<l-s; j++)   printf(" ");
            printf("*\n");
        }
    }
    for(int i=0; i<Max+2; i++)  printf("*");
    return 0;
}
```

# 更新日志
- 2014年11月5日日 已AC。