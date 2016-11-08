---
layout: post
title: UVa 445 Marvelous Mazes
date: 2014-11-1 09:47:48
categories: Exercise
toc: true
---
## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=94&page=show_problem&problem=386

# 理解
我又逗了= =。
题意很简单，给你指定规则的字符串，要求你转换成一个图。
我写了一个特别复杂的实现，结果总是得不到想要的结果。后来才意识到switch语句妙用，顿感自己太不机智了。
实际上，只要对每一个字符进行判断就可以了，如果是数字就叠加起来得到c，如果是b就输出前面算出的c个空格，如果是！就输出回车，如果是字母就输出前面算出来的c个字母。根本就不需要进行复杂的正数处理操作，涨姿势了。
除此之外，还有没有必要等到全部输入完了之后再进行处理。因为本地编译的时候看起来输入和输出混在了一起，实际上，输入来自于stdin，输出来自于stdout，是不会出现混淆的。所以可以放心大胆地进行单行处理，这样就省掉一个超大的二维数组。

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

char s[100010];

int main(int argc, char const *argv[])
{
    while(gets(s))
    {
        int c=0;
        for(int i=0; s[i]!='\0'; i++)
        {
            switch(s[i])
            {
            case 'b':
            {
                for(int j=0; j<c; j++)
                    printf(" ");
                c=0;
                break;
            }
            case '1':
                c=c+1;
                break;
            case '2':
                c=c+2;
                break;
            case '3':
                c=c+3;
                break;
            case '4':
                c=c+4;
                break;
            case '5':
                c=c+5;
                break;
            case '6':
                c=c+6;
                break;
            case '7':
                c=c+7;
                break;
            case '8':
                c=c+8;
                break;
            case '9':
                c=c+9;
                break;
            case '!':
                printf("\n");
            default:
            {
                for(int j=0; j<c; j++)
                    printf("%c",s[i]);
                c=0;
                break;
            }
            }
        }
        printf("\n");
    }
    return 0;
}

```

# 更新日志
- 2014年11月1日 已AC。