title: POJ 3083 Children of the Candy Corn
date: 2014-08-19 16:58:57
tags: [ACM, POJ, C, DFS, BFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3083

# 理解
最开始的代码程序直接报错，反复调试之后，发现我陷入了无限的循环之中。因为先写的左转优先的代码，面对这样的数据时：

```
########
#......#
#.####.#
#.####.#
#.####.#
#.####.#
#...#..#  //此行倒数第二和第三的`.`会使得左转优先策略陷入无限循环
#S#E####

```
因此，仅仅是写DFS是不够的，我还需要对当前的朝向再进行判断。
除了这个之外，就是一个BFS了，最短路径用DFS不太合适。

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
#define MAXN 45
using namespace std;

#define see(x) cout<<#x<<":"<<x<<endl;
const int N = 50;
char maze[N][N];

typedef struct
{
    int x, y, dis;
} Node;

const int move[4][4] = { {0, -1}, { -1, 0}, {0, 1}, {1, 0} };
bool vis[N][N] = {0};
int r, c;
queue<Node> q;
int bfs()
{
    int i;
    Node temp, temp1;
    int minn = inf;
    while (!q.empty())
    {
        temp = q.front();
        q.pop();
        if (maze[temp.x][temp.y] == 'E')
        {
            if (temp.dis < minn)
            {
                minn = temp.dis;
            }
        }

        else
        {
            for (i = 0; i < 4; i++)
            {
                temp1.x = temp.x + move[i][0];
                temp1.y = temp.y + move[i][1];
                temp1.dis = temp.dis + 1;
                if (temp1.x >= 0 && temp1.x < r && temp1.y >= 0 && temp1.y < c && maze[temp1.x][temp1.y] != '#' && !vis[temp1.x][temp1.y])
                {
                    vis[temp1.x][temp1.y] = 1;
                    q.push(temp1);
                }
            }
        }
    }
    return minn;
}
int dfs(int x, int y, int dir, char mark)
{
    int i, ndir, nx, ny;
    if (maze[x][y] == 'E')
    {
        return 1;
    }
    if (mark == 'l')
    {
        for (i = dir - 1; i < dir + 3; i++)
        {
            nx = x + move[(i + 4) % 4][0];
            ny = y + move[(i + 4) % 4][1];
            ndir = (i + 4) % 4;
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && maze[nx][ny] != '#')
            {
                //    cout<<"nx: "<<nx<<"   ny: "<<ny<<"    "; see(ndir)
                return dfs(nx, ny, ndir, mark) + 1;
            }
        }
    }
    if (mark == 'r')
    {
        for (i = dir + 1; i > dir - 3; i--)
        {
            nx = x + move[(i + 4) % 4][0];
            ny = y + move[(i + 4) % 4][1];
            ndir = (i + 4) % 4;
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && maze[nx][ny] != '#')
            {
                return dfs(nx, ny, ndir, mark) + 1;
            }
        }
    }
    return 0;
}
int main()
{
    int t, lp, rp, sp;
    int i, j, k, dir;
    Node s;
    scanf("%d", &t);
    while (t--)
    {
        scanf("%d%d", &c, &r);
        for (i = 0; i < r; i++)
            scanf("%s", maze[i]);
        for (i = 0; i < r; i++)
        {
            for (j = 0; j < c; j++)
            {
                if (maze[i][j] == 'S')
                {
                    s.x = i; s.y = j; s.dis = 1;
                    break;
                }
            }
        }
        if (s.x == 0)
        {
            dir = 3;
        }
        else if (s.x == 1)
        {
            dir = 1;
        }
        else if (s.y == 0)
        {
            dir = 2;
        }
        else
        {
            dir = 0;
        }
        lp = dfs(s.x, s.y, dir, 'l');

        vis[s.x][s.y] = 1;
        rp = dfs(s.x, s.y, dir, 'r');

        memset(vis, 0, sizeof(vis));
        vis[s.x][s.y] = 1;  s.dis = 1;
        q.push(s);
        sp = bfs();
        printf("%d %d %d\n", lp, rp, sp);
    }
    return 0;
}

```

# 更新日志
- 2014年08月19日 已AC。