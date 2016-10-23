---
title: POJ 1753 Flip Game
date: 2014-07-12 13:48:16
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1753

# 理解
我一开始的思路是错误的，企图通过正面的方法来找出从当前情况达到全白和全黑的方法，多次尝试之后，发现很难找到一条通用的方法，只能找出几个比较简单的特例。后来才明白过来，应当从全黑或者全白的情况出发，再来判断给定的图是不是其中的一个子集。因为是一个4X4的格子，不难看出，总共的情况只有2^16种。只要一一枚举即可。最后的步数就是这颗树的深度，使用DFS即可实现。

<!-- more -->

# 新技能get
深度优先搜索`DFS`
对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次。

# 代码

```
#include<iostream>
using namespace std;

bool chess[6][6]={false};
bool flag;
int step;
int r[]={-1,1,0,0,0};
int c[]={0,0,-1,1,0};

bool judge_all(void)
{
    int i,j;
    for(i=1;i<5;i++)
        for(j=1;j<5;j++)
            if(chess[i][j]!=chess[1][1])
                return false;
    return true;
}

void flip(int row,int col)
{
    int i;
    for(i=0;i<5;i++)
        chess[row+r[i]][col+c[i]]=!chess[row+r[i]][col+c[i]];
    return;
}

void dfs(int row,int col,int deep)
{
    if(deep==step)
    {
        flag=judge_all();
        return;
    }

    if(flag||row==5)return;

    flip(row,col);
    if(col<4)
        dfs(row,col+1,deep+1);
    else
        dfs(row+1,1,deep+1);

    flip(row,col);
    if(col<4)
        dfs(row,col+1,deep);
    else
        dfs(row+1,1,deep);

    return;
}

int main(void)
{
    char temp;
    int i,j;
    for(i=1;i<5;i++)
        for(j=1;j<5;j++)
        {
            cin>>temp;
            if(temp=='b')
                chess[i][j]=true;
        }

    for(step=0;step<=16;step++)
    {
        dfs(1,1,0);
        if(flag)break;
    }

    if(flag)
        cout<<step<<endl;
    else
        cout<<"Impossible"<<endl;
    return 0;
}

```

# 更新日志
- 2014年07月12日 已AC。