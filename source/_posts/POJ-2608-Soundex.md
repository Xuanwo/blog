title: POJ 2608 Soundex
date: 2014-08-17 16:36:16
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2608

# 理解
输出字符串所对应的值，没有的话，就不输出。不过现在有点后悔，是不是用Map来做会更好一些。

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
#define inf (1<<30)
using namespace std;

char str[30];
int arr[50];

void init()
{
    arr[0] = 0;  // A
    arr[1] = 1;  // B
    arr[2] = 2;  // C
    arr[3] = 3;  // D
    arr[4] = 0;  // E
    arr[5] = 1;  // F
    arr[6] = 2;  // G
    arr[7] = 0;  // H
    arr[8] = 0;  // I
    arr[9] = 2;  // J
    arr[10] = 2; // K
    arr[11] = 4; // L
    arr[12] = 5; // M
    arr[13] = 5; // N
    arr[14] = 0; // O
    arr[15] = 1; // P
    arr[16] = 2; // Q
    arr[17] = 6; // R
    arr[18] = 2; // S
    arr[19] = 3; // T
    arr[20] = 0; // U
    arr[21] = 1; // V
    arr[22] = 0; // W
    arr[23] = 2; // X
    arr[24] = 0; // Y
    arr[25] = 2; // Z
}

int main(int argc, char const *argv[])
{
    char last, tmp;
    int len, i;

    init();
    while (scanf("%s", str) != EOF)
    {
        len = strlen(str);
        last = 0;
        for (i = 0; i < len ; i++)
        {
            if (arr[str[i] - 'A'] != 0 && arr[str[i] - 'A'] != last)
            {
                printf("%d", (last = arr[str[i] - 'A']));
            }
            else
            {
                last = arr[str[i] - 'A'];
            }
        }
        printf("\n");
    }
    return 0;
}
```

# 更新日志
- 2014年08月17日 已AC。