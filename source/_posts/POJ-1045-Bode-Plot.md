title: POJ 1045 Bode Plot
date: 2014-07-20 14:39:05
tags: [ACM, POJ, C, 水题, 物理]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1045

# 理解
额- -，居然考到了物理公式。推倒的过程中，卡在了题目中的相位不是已知量。知道看了discuss才明白，可以通过令t=0特殊值带入的方法求解。果真是物理题做得少了- -，不机智了。类似于这样的精度问题，G++都是WA，只有C++才能A。至今不知原因。

<!-- more -->

# 新技能get
特殊值带入求未知量

# 代码
```
#include <cstdio>
#include <iostream>
#include <cmath>
using namespace std;

int n;
double vs,r,c,w;

int main(int argc, char const *argv[])
{
    cin>>vs>>r>>c>>n;
    while(n--)
    {
        cin>>w;
        printf("%.3lf\n",(c*r*w*vs)/sqrt(1+(c*r*w)*(c*r*w)));
    }
    return 0;
}
```
# 更新日志
- 2014年07月日 已AC，C++。