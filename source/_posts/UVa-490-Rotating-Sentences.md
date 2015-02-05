title: UVa 490 Rotating Sentences
date: 2014-11-1 09:21:56
tags: [ACM, UVa, C, 字符串, 简单]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=94&page=show_problem&problem=431

# 理解
题意很好理解，就是将字符串旋转九十度。
一开始脑洞开的比较大，想要搞两个字符串数组，然后两个for遍历。后来仔细想想根本就不需要，只要在输出的时候，处理一下顺序就可以了。
然后被卡在了输入输出上面，之前没有做过这种类型的题目，不知道单组的输入怎么结束。后来听学长解释才明白，就算是单组，也可以用EOF来结束的，之后的问题就比较简单了。但是提交之后，挂了一发PE。仔细检查之后，认为问题出在题目中输入的那个换行，除此之外，还有自己先前调用的一个计数变量i的值比应有的值多了1。
Debug之后，幸福的A了

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

#define MAXN 1<<10

char a[MAXN][MAXN];
int i=0;
int Max=0,tmp=0;;

int main(int argc, char const *argv[])
{
    memset(a,0,sizeof(a));
    while(gets(a[i++]))
    {
        tmp=strlen(a[i-1]);
        if(Max<tmp) Max=tmp;
    }
    for(int j=0; j<Max; j++)
    {
        for(int k=i-1; k>=0; k--)
        {
            if(!a[k][j])    a[k][j]=' ';
        }
    }
    for(int j=0; j<Max; j++)
    {
        for(int k=i-2; k>=0; k--)
        {
            printf("%c", a[k][j]);
        }
        printf("\n");
    }
    return 0;
}

```

# 更新日志
- 2014年11月1日 已AC。