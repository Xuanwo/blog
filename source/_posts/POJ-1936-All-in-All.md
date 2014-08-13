title: POJ 1936 All in All
date: 2014-08-05 20:41:00
tags: [ACM, POJ, C/C++, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1936

# 理解
字符串的题目。因为数据水所以这是一道水题，要是数据再强一点估计就TLE了。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <string.h>
#define N 100001
using namespace std;

char s[N], t[N];
int slen, tlen, i, j, tag;

int main()
{
    while ( scanf("%s  %s", s, t) != EOF )
    {
        slen = strlen(s);
        tlen = strlen(t);
        for (i = 0 , j = 0; i < tlen && j < slen; ++i)
            if (s[j] == t[i])
                ++j;
        if (j == slen)  puts("Yes");
        else puts("No");
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月05日 已AC。