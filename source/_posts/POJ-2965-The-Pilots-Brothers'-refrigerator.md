title: POJ 2965 The Pilots Brothers' refrigerator
date: 2014-07-23 23:31:18
tags: [ACM, POJ, C, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2965

# 理解
参考的某神牛的解法：
> 
证明:
1. 要使一个为'+'的符号变为'-',必须其相应的行和列的操作数为奇数;可以证明,如果'+'位置对应的行和列上每一个位置都进行一次操作,则整个图只有这一'+'位置的符号改变,其余都不会改变.
2. 设置一个4*4的整型数组,初值为零,用于记录每个点的操作数,那么在每个'+'上的行和列的的位置都加1,得到结果模2(因为一个点进行偶数次操作的效果和没进行操作一样),然后计算整型数组中一的
3. 个数即为操作数,'-'的位置为要操作的位置(其他原来操作数为偶数的因为操作并不发生效果,因此不进行操作)

只适用于这一道题，POJ上那道棋盘翻转貌似不能通用。

<!-- more -->

# 代码
```#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;

bool mark[4][4];
char s[4][4];
int i, j, k;
int ci[16], cj[16];
int nas = 0;

int main(int argc, char const *argv[])
{
    memset(mark, 0, sizeof(mark));
    for (i = 0; i < 4; i++)
        cin >> s[i];
    for (i = 0; i < 4; i++)
        for (j = 0; j < 4; j++)
        {
            char c = s[i][j];
            if (c == '+')
            {
                mark[i][j] = !mark[i][j];
                for (k = 0; k < 4; k++)
                {
                    mark[i][k] = !mark[i][k];
                    mark[k][j] = !mark[k][j];
                }
            }
        }
    for (i = 0; i < 4; i++)
        for (j = 0; j < 4; j++)
            if (mark[i][j] == true)
            {
                ci[nas] = i + 1;
                cj[nas] = j + 1;
                nas ++;
            }
    printf("%d\n", nas);
    for (i = 0; i < nas; i++)
    {
        printf("%d %d\n", ci[i], cj[i]);
    }
    return 0;
}
```
# 更新日志
- 2014年07月23日 已AC。