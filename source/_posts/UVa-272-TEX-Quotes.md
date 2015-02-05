title: UVa 272 TEX Quotes
date: 2014-11-25 10:40:48
tags: [ACM, UVa, C, 字符串]
categories: Exercise
toc: true
---
# 题目	
源地址：http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=829&page=show_problem&problem=208

# 理解
同样的，题目很简单。只需要考虑当前处理的是前面的还是后面的那个引号。

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

char a;
int flag=0;

int main(int argc, char const *argv[])
{
	while(~scanf("%c", &a))
    {
        if(a=='"')
        {
            flag++;
            if(flag%2==1)
            {
                printf("%s", "``");
            }
            else
            {
                printf("%s", "''");
            }
        }
        else
        {
            printf("%c", a);
        }
    }
	return 0;
}
```

# 更新日志
- 2014年11月25日 已AC。

