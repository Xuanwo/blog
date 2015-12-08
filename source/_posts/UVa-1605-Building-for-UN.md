---
title: UVa 1605 Building for UN
date: 2014-11-5 19:10:54
tags: [ACM, UVa, C, 构造]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4480

# 理解
题意要求安排出一个设计方案，使得每一个国家都相邻。
乍一看很复杂，但其实只要构造两层，第一层中第i行都是i国家，第二层中第i列都是i国家，就能满足题意。
额，算是机智题？

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


int n, i, j, k;
char c;

char intTochar(int x)
{
    if(x>26)  return x-27+'A';
    return x-1+'a';
}

int main(int argc, char const *argv[])
{

    while(~scanf("%d",&n))
    {
        printf("2 %d %d\n",n,n);
        for(i=1; i<=n; i++)
        {
            c=intTochar(i);
            for(j=1; j<=n; j++)
            {
                printf("%c",c);
            }
            printf("\n");
        }
        printf("\n");
        for(i=1; i<=n; i++)
        {
            for(j=1; j<=n; j++)
            {
                c=intTochar(j);
                printf("%c",c);
            }
            printf("\n");
        }
        printf("\n");
    }
    return 0;
}

```

# 更新日志
- 2014年11月5日 已AC。