---
title: POJ 1321 棋盘问题
date: 2014-07-12 21:30:59
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1321

# 理解
感觉还是蛮简单的一道题目，主要是因为数据特别水，最大只有8*8的棋盘，用DFS按照行来搜索。主要的问题在于如何确保同列不存在重复的棋子。

<!-- more -->

# 代码

```
#include <iostream>
using namespace std;

char pic[8][8];
int col[8];
int c;
int n, k;

void dfs(int begin, int num)
{
    for (int j = 0; j < n; j++)
    {
        if (pic[begin][j] == '#' && col[j] == 0)
        {
            if (num == 1)
                c++;
            else
            {
                col[j] = 1;
                for (int h = begin + 1; h < n - num + 2; h++)
                    dfs(h, num - 1);
                col[j] = 0;
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    while ((cin >> n >> k) && !(n == -1 && k == -1))
    {
        c = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                cin >> pic[i][j];
        for (int i = 0; i < n; i++)
            col[i] = 0;
        for (int i = 0; i <= n - k; i++)
        {
            dfs(i, k);
        }
        cout << c << endl;
    }
}

```

# 更新日志
- 2014年07月12日 已AC。