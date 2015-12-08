---
title: Codeforces Beta Round 2 B The least round way
date: 2014-11-3 15:02:38
tags: [ACM, Codeforces, C, DP]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/contest/2/problem/B

# 理解
比赛的时候没有做出来，一看就知道应该是一个DP，选取一个2或者5最少的路径。
首先处理一下，设TWO为0，FIVE为1。在输入的时候就进行判断，当前输入的数和'0'，'2'，'5'之间的关系。得到的结果存在一个数组中，这样就得到整个数组中最多的0的个数。然后对2和5的数量进行比较，只需要考虑比较少的那个。
然后对第一个数为0的情况进行特判，此时只要随手输出就可以了。如果第一个数不为0，则开始取2比较少的路径开始行走。

>
大概是我写得不是很优美= =，在提交的时候遇到了各种问题，debug了半天，还是没有找出究竟错在哪里。直到我脑洞一开，把所有变量的定义放在了main函数的里面，居然过了！过了！！了！！！
蛋疼，不知道问题到底在哪里= =，唉，存疑。

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
#include <functional>
#include <stdarg.h>
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-4)
#define inf (1<<28)
#define ll long long int
using namespace std;

#define N 1100+10

const int TWO = 0;
const int FIVE = 1;

int main()
{
    int sum[N][N][2];
    int dir[N][N][2];
    char output[N*4];
    int n,i,j,k;
    ll tmp,ans;
    int x,y,n25[2];
    int len, type,nowx,nowy;
    bool ok;

    while(~scanf("%d",&n))
    {
        ok = false;
        for(i=0; i<n; i++)
        {
            for(j=0; j<n; j++)
            {
                scanf("%d",&tmp);
                if(tmp == 0)
                {
                    ok = true;
                    x = i,y = j;
                    n25[TWO] = n25[FIVE] = 1;
                }
                else
                {
                    n25[TWO] = n25[FIVE] = 0;
                    while(tmp %2 == 0)
                    {
                        n25[TWO]++;
                        tmp >>= 1;
                    }
                    while(tmp %5 == 0)
                    {
                        n25[FIVE]++;
                        tmp /= 5;
                    }
                }

                for(k=0; k<2; k++)
                {
                    if(!i && !j)
                    {
                        sum[i][j][k] = n25[k];
                    }
                    else if(j && i)
                    {
                        if(sum[i-1][j][k] < sum[i][j-1][k])
                        {
                            dir[i][j][k] = 1;
                            sum[i][j][k] = sum[i-1][j][k] + n25[k];
                        }
                        else
                        {
                            dir[i][j][k] = 0;
                            sum[i][j][k] = sum[i][j-1][k] + n25[k];
                        }
                    }
                    else if(!i)
                    {
                        dir[i][j][k] = 0;
                        sum[i][j][k] = sum[i][j-1][k] + n25[k];
                    }
                    else if(!j)
                    {
                        dir[i][j][k] = 1;
                        sum[i][j][k] = sum[i-1][j][k] + n25[k];
                    }
                }
            }
        }

        k = TWO;
        if(sum[n-1][n-1][TWO] > sum[n-1][n-1][FIVE]) k = FIVE;
        if(sum[n-1][n-1][k] > 1 && ok)
        {
            printf("1\n");
            for(int i = 0; i < x; i++) putchar('D');
            for(int j = 0; j < y; j++) putchar('R');
            for(int i = x; i < n-1; i++) putchar('D');
            for(int j = y; j < n-1; j++) putchar('R');
            putchar('\n');
        }
        else
        {
            printf("%d\n", sum[n-1][n-1][k]);
            output[2*n-2] = 0;
            for(i = n-1, j = n-1; i > 0 || j > 0; dir[i][j][k]?i--:j--)
                output[i+j-1] = dir[i][j][k]?'D':'R';
            printf("%s\n", output);
        }
    }
    return 0;
}

```

# 更新日志
- 2014年11月3日 已AC。