title: POJ 2538 WERTYU
date: 2014-08-22 21:44:21
tags: [ACM, POJ, C, 打表]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2538

# 理解
键盘错位，分别一一对应即可。
**做到这道题目的时候才想起来，想当年我把我们家的联想键盘拆了，装回去的时候加减号弄反了。。**

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

char str[200];

void init()
{
    int i;

    str['1'] = '`';
    for (i = 2; i <= 10; i++)
    {
        str['0' + i % 10] = '0' + i - 1;
    }
    str['-'] = '0';
    str['='] = '-';
    str['W'] = 'Q';
    str['E'] = 'W';
    str['R'] = 'E';
    str['T'] = 'R';
    str['Y'] = 'T';
    str['U'] = 'Y';
    str['I'] = 'U';
    str['O'] = 'I';
    str['P'] = 'O';
    str['['] = 'P';
    str[']'] = '[';
    str['\\'] = ']';
    str['S'] = 'A';
    str['D'] = 'S';
    str['F'] = 'D';
    str['G'] = 'F';
    str['H'] = 'G';
    str['J'] = 'H';
    str['K'] = 'J';
    str['L'] = 'K';
    str[';'] = 'L';
    str['\''] = ';';
    str['X'] = 'Z';
    str['C'] = 'X';
    str['V'] = 'C';
    str['B'] = 'V';
    str['N'] = 'B';
    str['M'] = 'N';
    str[','] = 'M';
    str['.'] = ',';
    str['/'] = '.';
}

int main(int argc, char const *argv[])
{
    char ch;

    init();
    while ((ch = getchar()) != EOF)
    {
        if (ch != ' ' && ch != '\n')
        {
            putchar(str[ch]);
        }
        else
        {
            putchar(ch);
        }
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。