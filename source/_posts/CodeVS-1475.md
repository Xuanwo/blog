---
title: CodeVS 1475 m进制转十进制
date: 2014-10-20 20:55:41
categories: Exercise
toc: true
---
# 题目
源地址：

http://codevs.cn/problem/1475/

# 理解
跟上一道题差不多- -，也是简单的写了一个循环，然后使用累积法计算十进制的值。不过有一个小小的坑，就是'A'字符的ANSI值不是'9'+1，而是'9'+7。为了省的麻烦，我还是采用了-'A'+10这样的方法。

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
#define ll long long int
using namespace std;

#define MAXN 16

int n,m;
char num[MAXN]= {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
char str[MAXN];

void init()
{
    memset(str,0,sizeof(str));
    scanf("%s%d", str,&m);
    n=0;
}

void solve(char str[],int m)
{
    int i=0,len=strlen(str);
    for(i=0; i<len; i++)
    {
        if(str[i]<='9')
            n+=(str[i]-'0')*pow(m,len-i-1);
        else
            n+=(str[i]-'A'+10)*pow(m,len-i-1);
    }
}

int main(int argc, char const *argv[])
{
    init();
    solve(str,m);
    printf("%d\n", n);
    return 0;
}

```

# 更新日志
- 2014年10月20日 已AC。