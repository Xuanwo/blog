---
title: POJ 2153 Rank List
date: 2014-07-16 22:55:02
tags: [ACM, POJ, C, Map, STL]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2153

# 理解
感觉不是很难，因为数据量不是很大，将人和成绩一一映射，然后遍历即可。

<!-- more -->

# 新技能get
[STL库中Map](http://www.cplusplus.com/reference/map/map/?kw=map)

# 代码

```
#include <iostream>
#include <string>
#include <map>
#include <cstdio>

using namespace std;

int main(int argc, char *argv[])
{
    int n, m;
    int i, j;
    char str[200];
    string str1;

    map<string , int>score;

    scanf("%d", &n);
    getchar();


    for (i = 0; i < n; i++ )
    {
        gets(str);
        str1 = str;
        score[str1] = 0;
    }

    int cnt[5005] = {0};

    scanf("%d", &m);

    string li = "Li Ming";

    int rank = 0;
    int s = 0;
    int temp = 0;
    int temp2 = 0;
    int num;
    for (int k = 0; k < m; k++)
    {
        for (i = 0; i < n; i++)
        {
            scanf("%d", &num);
            getchar();
            gets(str);
            str1 = str;
            temp2 = score[str1];
            score[str1] = num + temp2;
            cnt[num + temp2]++;
        }
        s = score[li];
        rank = 1;
        temp += 100;
        for (i = temp; i > s; i--)
        {
            rank += cnt[i];
            cnt[i] = 0;
        }
        for (i = s; i >= 0; i--)
            cnt[i] = 0;
        printf("%d\n", rank);
    }
    return 0;
}


```

# 更新日志
- 2014年07月16日 已AC。