title: UVa 10082 WERTYU
date: 2014-11-25 10:34:01
tags: [ACM, UVa, C, 字符串]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=829&page=show_problem&problem=1023

# 理解
很简单的一道题，不过想了很久。我觉得需要注意的地方大概有三处：
- 不用自己手写所有情况的判断，使用一个字符串数组可以高效地解决问题。
- 可以采用一边读入一边处理的方法，不需要开一个数组来保存所有的数，更何况那样做还要处理空格和回车的问题。
- 读题的时候忽略了两处地方，多行以及没有`QAZ`这些字符，导致最后处理的时候出现了问题。
注意到这些，这道题就可以轻松A了。

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
#define inf 0x3f3f3f3f
#define ll long long int
using namespace std;

#define MAXN 50

char a[MAXN]="`1234567890-=QWERTYUIOP[]\\ASDFGHJKL;'ZXCVBNM,./";
char b;
int len=strlen(a);

int main(int argc, char const *argv[])
{
	while(~scanf("%c", &b))
    {
        if(b==' ')  printf(" ");
        else if(b=='\n') printf("\n");
        else
        {
            for(int i=0;i<len;i++)
            {
                if(b==a[i]) printf("%c", a[i-1]);
            }
        }
    }
	return 0;
}
```

# 更新日志
- 2014年11月25日 已AC。

