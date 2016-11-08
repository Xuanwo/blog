---
layout: post
title: POJ 3194 Equidivisions
date: 2014-07-12 23:12:37
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=3194

# 理解
本以为只要逐个判断每一个数是否有相邻即可，事实上，少考虑了一种情况。
比如下面给出的这种：

```
2211
1111
1111
1122

```
根据我原来的思路这种也是good，但其实并不是如此。当然，这个例子并不完备，但用于指出原来思路的漏洞已经够了。正确的思路应当是使用DFS来寻找是否存在独立的区块。

<!-- more -->

# 代码

```
#include <iostream>
#include <cstring>
using namespace std;
int N, ans;
int map[101][101];
int visit[101][101];

int step[4][2] = { {-1, 0}, {0, 1}, {1, 0}, {0, -1} };

int color[101];
bool Check(int x, int y)
{
    if (x >= N || x < 0 || y >= N || y < 0)
        return false;
    return true;
}
void DFS(int CurX, int CurY)
{
    ans++;
    visit[CurX][CurY] = 1;
    color[map[CurX][CurY]] = 1;
    for (int i = 0; i < 4; i++)
    {
        int x = CurX+step[i][0];
        int y = CurY+step[i][1];
        if (Check(x, y) == false || visit[x][y] == 1)
            continue;
        if (map[CurX][CurY] == map[x][y] || color[map[x][y]] == 0)
        {
            DFS(x, y);
        }
    }
}
int main()
{
    while (cin>>N && N !=0)
    {
        int index = 1;
        ans = 0;
        memset(map, 0, sizeof(map));
        memset(visit, 0, sizeof(visit));
        memset(color, 0, sizeof(color));
        for (int i = 0; i < N-1; i++)
        {
            for (int j = 0; j < N; j++)
            {
                int a, b;
                cin>>a>>b;
                map[a-1][b-1] = index;
            }
            index++;
        }
        DFS(0, 0);
        if (ans == N*N)
            cout<<"good"<<endl;
        else
            cout<<"wrong"<<endl;
    }
    return 0;
}

```

# 更新日志
- 2014年07月12日 已AC。