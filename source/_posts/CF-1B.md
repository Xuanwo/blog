title: Codeforces Beta Round 1 B Spreadsheets
date: 2014-10-21 14:35:33
tags: [ACM, Codeforces, C/C++, 模拟]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/1/problem/B

# 理解
大水题一道，不过我坑了很久，实在是代码功底太弱。
题意非常简单，给出两种表格的坐标体系，要你进行相互转化，本质上是一道26进制转化类的题目。
我遇到的坑基本上分为两类，一个是在判断当前输入的字符串属于何种类型，第二是在具体实现过程中的BUG。
首先，讲一讲判断的过程。我另外写了一个判断的函数，一开始想的比较简单，只要判断第二个是不是字符，就OK。挂在了Test 2，错误样例是`A1`。然后就在思考，这两种坐标体系的根本不同到底在哪里。实际上，RXCY体系中一定有字符R和C，R和C之间必定会有一个数字。从这一点出发，重写了一遍judge函数，总算是搞定了问题。
其次，来看一下在具体的实现过程中的BUG。这一次挂在了Test 6，一个总共有1000个的输入= =，错误的样例是`R228C494`和`R98C688`。观察之后发现，问题出在进退位上，因为在A—Z的体系中，实际上是没有代表'0'这个字符的，所以，当R或者C坐标上出现整除的时候，就会发现本应出现'Z'的地方，出现了字符'@'。不过在挂了这么多发之后，偷懒直接进行了特判，当'Z'出现字符串末尾，也就是c%26==0时，直接指定它为'Z'；当Z出现在字符串最前方时，直接在输出中过滤。
然后= =，A了。

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
#define eps (1e-8)
#define inf (1<<28)
#define ll long long int
using namespace std;
#define MAXN 40000

int t;
char str[MAXN],ans[MAXN];

bool judge(char str[])
{
    string tmp=str;
    if(tmp.find('C')>=tmp.size()||tmp.find('R')>=tmp.size()||tmp.find('C')<tmp.find('R'))    return true;
    else
    {
        for(int i=tmp.find('R'); i<=tmp.find('C'); i++)
        {
            if(str[i]<='9') return false;
        }
        return true;
    }
    return false;
}

void exceltorxcy(char str[])
{
    int r=0,c=0;
    int len=strlen(str);
    for(int i=0; i<len; i++)
    {
        if(str[i]>='A'&&str[i]<='Z')
        {
            c=c*26+str[i]-'A'+1;
        }
        else
        {
            r=r*10+str[i]-'0';
        }
    }
    printf("R%dC%d\n", r,c);
}

void rxcytoexcel(char str[])
{
    int i,j,c=0,r=0;
    int len=strlen(str);
    for(i=0; i<len; i++)
    {
        if(str[i]=='C')    break;
        if(str[i]>='0'&&str[i]<='9')
        {
            r=r*10+str[i]-'0';
        }
    }
    for(j=i; j<len; j++)
    {
        if(str[j]>='0'&&str[j]<='9')
        {
            c=c*10+str[j]-'0';
        }
    }
    i=0;
    while(c/26!=0)
    {
        if(c%26==0)
        {
            ans[i]='Z';
            c-=1;
        }
        else
        {
            ans[i]=c%26+'A'-1;
        }
        c/=26;
        i++;
    }
    ans[i]=c%26+'A'-1;
    for(; i>=0; i--)
    {
        if(ans[i]!='@')
            printf("%c", ans[i]);
    }
    printf("%d\n", r);
}

int main(int argc, char const *argv[])
{
    scanf("%d", &t);
    while(t--)
    {
        memset(ans,0,sizeof(ans));
        scanf("%s", str);
        if(judge(str))  exceltorxcy(str);
        else    rxcytoexcel(str);
    }
    return 0;
}

/*
R228C494
RZ228
R98C688

**/

```

# 更新日志
- 2014年10月21日 已AC。