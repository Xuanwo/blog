title: Codeforces Beta Round 5 A Chat Server's Outgoing Traffic
date: 2014-11-5 14:41:32
tags: [ACM, Codeforces, C, 字符串]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codeforces.com/contest/5/problem/A

# 理解
很简单的一道水题，实际上就是输出字符串个数和乘上当前聊天室里面的人数的和。
在具体写的时候有几个需要注意的问题：
- 输入，老生常谈了= =。空格的处理通常可以用`cin.getline(tmp,MAXN)`（对char数组）或者是`getline(cin,tmp);`（对string类）。
- 每次循环的时候，用于保存聊天内容的字符串都必须清空，否则答案会比正确结果大很多。

<!-- more -->

# 代码
```#include <cstdio>
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

#define MAXN 100+10

char tmp[MAXN],word[MAXN];
int n=0,ans=0;

int main()
{
    while(cin.getline(tmp,MAXN))
    {
        if(tmp[0]=='+') n++;
        else if(tmp[0]=='-')    n--;
        else
        {
            for(int i=0;i<strlen(tmp);i++)
            {
                if(tmp[i]==':')
                {
                    for(int j=i+1;j<strlen(tmp);j++)
                    {
                        word[j-i-1]=tmp[j];
                    }
                }
            }
        }
        ans+=strlen(word)*n;
        memset(word,0,sizeof(word));
        //cout<<debug<<word<<endl;
    }
    printf("%d\n", ans);
    return 0;
}
```
# 更新日志
- 2014年11月5日 已AC。