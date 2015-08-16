title: POJ 3048 Max Factor
date: 2014-07-14 17:21:24
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3048

# 理解
这不是我做过的最简单的题目，但一定是我做起来最逗比的题目。题意很明白，就是输出给定的数里面有最大值质因数的那个。题意中明确说明给定的数的范围是1到20000，然后我就开始机智了，20000的开方约为141，我只要打一个1到150以内所有素数的表，就OK啦～空间换时间，复杂度低得很。开开心心的敲完代码，结果WA了。看了一下discuss，针对一些特例微调了一下代码，结果还是WA。然后就进入坑爹模式，一坑就是一个下午。直到终于忍不住了，去问学长，学长看了一眼，说150到20000之间的质数呢？恍然大悟= =，没有考虑本身也是质数的情况，坑。

<!-- more -->

# 新技能get
- 卡题过久时，应当毫不犹豫地放弃或者寻求帮助。
- 不要执着于小数据特例而忘记大数据的测试，

# 代码
```#include <iostream>
#include <cstdio>
#include <cstring>
#include <cmath>
using namespace std;
int p[4000], pNum = 0;
bool f[20001];
void Prime()
{
    int i, j;
    for (i = 2; i < 20001; i++)
    {
        if (!f[i])
        {
            p[pNum++] = i;
        }
        for (j = 0; j < pNum && i * p[j] < 20001; j++)
        {
            f[i * p[j]] = 1;
            if (!(i % p[j])) break;
        }
    }
}
int main()
{
    int i, n, t, mmax = -1, pos;
    scanf("%d", &n);
    Prime();
    while (n--)
    {
        scanf("%d", &t);
        if (t == 1)
        {
            if (mmax < 1)
            {
                mmax = 1;
                pos = 1;
            }
        }
        else
        {
            for (i = pNum - 1; i >= 0; i--)
            {
                if (t >= p[i] && t % p[i] == 0)
                {
                    if (mmax < p[i])
                    {
                        mmax = p[i];
                        pos = t;
                        break;
                    }
                }
            }
        }
    }
    printf("%d\n", pos);
}
```
# 更新日志
- 2014年07月14日 已AC。