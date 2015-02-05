title: Codeforces Beta Round 3 C Tic-tac-toe
date: 2014-11-2 17:30:22
tags: [ACM, Codeforces, C, 模拟]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/problemset/problem/3/C

# 理解
一开始看到3*3，第一反应是想要枚举出所有可能的情况，也就是总共有9^3次种，但是发现自己很难处理这些情况，后来还是决定用暴力模拟的方法来做。

## 错误解法
为了简化情况的讨论，我取'.'为0，'X'为1，'0'为2。这样，只要三个数的积为0，说明没有人胜利；三个数的积为1，说明先手胜；三个数的积为8，说明后手胜。这样，在判定胜负的时候，情况就简单了很多。
但是，我犯的错误就是对非法的状况考虑得不全面，或者说，懒得去自己判定是否非法，直接将非法的判断写在else语句里面，导致这段语句摆在前面挂test4，摆在后面挂test8这样尴尬局面的发生。

## 正确解法
赛后我重新写了这道题，正面强干，没有转换成int数组来处理。将胜负判定和非法判定全都写成了独立的函数，在最开始先判断是否非法，然后判定有没有出现胜者，最后判定是谁进行下一步。

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

int xcnt;
int ocnt;
char brd[3][3];

bool win(char tmp)
{
    for (int i = 0; i < 3; i++)
    {
        if (brd[i][0] == tmp && brd[i][1] == tmp && brd[i][2] == tmp) return true;
        if (brd[0][i] == tmp && brd[1][i] == tmp && brd[2][i] == tmp) return true;
    }

    if (brd[1][1] != tmp) return false;

    if (brd[0][0] == tmp && brd[2][2] == tmp) return true;
    if (brd[0][2] == tmp && brd[2][0] == tmp) return true;

    return false;
}

bool legal()
{
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            xcnt += brd[i][j] == 'X';
            ocnt += brd[i][j] == '0';
        }
    }

    if (xcnt - ocnt > 1) return false;
    if (xcnt - ocnt < 0) return false;
    if (win('X') && xcnt == ocnt) return false;
    if (win('0') && xcnt - ocnt == 1) return false;

    return true;
}


int main(int argc, char const *argv[])
{
    xcnt = 0;
    ocnt = 0;

    char stmp[4];
    for (int i = 0; i < 3; i++)
    {
        scanf("%s", stmp);
        for (int j = 0; j < 3; j++) brd[i][j] = stmp[j];
    }

    do
    {
        if (!legal())
        {
            printf("illegal\n");
            break;
        }
        if (win('X'))
        {
            printf("the first player won\n");
            break;
        }
        if (win('0'))
        {
            printf("the second player won\n");
            break;
        }
        if (xcnt + ocnt == 9)
        {
            printf("draw\n");
            break;
        }
        if (xcnt == ocnt)
        {
            printf("first\n");
            break;
        }
        if (xcnt - ocnt == 1)
        {
            printf("second\n");
            break;
        }
    }
    while (true);
    return 0;
}
```

# 更新日志
- 2014年11月2日 已AC。