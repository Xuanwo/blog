title: POJ 3278 Catch That Cow
date: 2014-08-18 17:00:55
tags: [ACM, POJ, C, BFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3278

# 理解
BFS最基础的应用，只有三个方向，一个是乘二，一个是加一，一个是减一。

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
#define MAXN 100010
using namespace std;

int n, k, tmp, res;
int maze[MAXN];
int vis[MAXN];

void init()
{
    memset(maze, 0, sizeof(maze));
    memset(vis, 0, sizeof(vis));
    cin >> n >> k;
}

int bfs()
{
    queue<int> que;
    int next;
    que.push(n);
    vis[n] = 1;
    while (que.size())
    {
        tmp = que.front();
        que.pop();
        for (int i = 0; i <= 2; i++)
        {
            if (i == 0)    next = tmp * 2;
            else if (i == 1)   next = tmp + 1;
            else next = tmp - 1;

            if (next > MAXN || next < 0 )  continue;
            if (!vis[next])
            {
                que.push(next);
                maze[next] = maze[tmp] + 1;
                vis[next] = 1;
            }
            if (next == k) return maze[next];
        }
    }
    return -1;
}

int main(int argc, char const *argv[])
{
    init();
    cout << bfs();
    return 0;
}

```

# 更新日志
- 2014年08月18日 已AC。