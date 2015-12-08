---
title: POJ 3302 Subsequence
date: 2014-08-22 17:21:34
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3302

# 理解
直接用一个循环，遍历str1，与str2进行单字符匹配，如果匹配成功就count++。
如果count==strlen(str1),则输出YES，遍历正序、逆序各一次，都没有则输出NO。

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
using namespace std;

char str1[110];
char str2[110];

int main(int argc, char const *argv[])
{
    int ii, casenum;
    int count;
    int len1, len2;
    int i, j;
    int flag;

    scanf("%d", &casenum);
    getchar();
    for (ii = 0; ii < casenum; ii++)
    {
        scanf("%s%s", str1, str2);
        len1 = strlen(str1);
        len2 = strlen(str2);
        flag = 0;
        for (i = j = count =  0; !flag && j < len1; j++)
        {
            if (str1[j] == str2[i])
            {
                count++;
                i++;
            }
            if (count == len2)
            {
                flag = 1;
            }
        }
        for (count = i = 0, j = len1 - 1; !flag && j >= 0; j--)
        {
            if (str1[j] == str2[i])
            {
                count++;
                i++;
            }
            if (count == len2)
            {
                flag = 1;
            }
        }
        if (flag)
        {
            printf("YES\n");
        }
        else
        {
            printf("NO\n");
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。