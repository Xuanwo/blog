title: UVa 10976 Fractions Again?!
date: 2014-10-27 16:13:36
tags: [ACM, UVa, C, 暴力]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1917

# 理解
直接暴力做，最多有n-1种可能，每种可能全都尝试一遍，看看能不能找到合适的解，定eps为1e-4，幸运1A。

<!-- more -->

# 代码

```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <string>
#include <iostream>
#include <sstream>
#include <map>
#include <set>
#include <vector>
#include <list>
#include <cctype>
#include <algorithm>
#include <utility>
#include <math.h>

using namespace std;

#define LL long long int
#define MAXN 10000+10

LL xbuf[MAXN];
LL ybuf[MAXN];

int main()
{
    LL k;
    while(~scanf("%lld",&k))
    {
        LL y = 1;
        LL cnt = 0;

        memset(xbuf, 0, sizeof(xbuf));
        memset(ybuf, 0, sizeof(ybuf));

        for(y=1; y<=2*k; y++)
        {
            double x = 1.0 / (1.0/k - 1.0/y);
            LL xInt = (LL)(x+0.5);

            if(x>0 && fabs(x-xInt)<1e-4)
            {
                xbuf[cnt] = xInt;
                ybuf[cnt] = y;
                cnt++;
            }
        }
        printf("%lld\n", cnt);
        for(int i=0; i<cnt; i++)
        {
            printf("1/%lld = 1/%lld + 1/%lld\n", k, xbuf[i], ybuf[i]);
        }
    }
}

```

# 更新日志
- 2014年10月27日 已AC。