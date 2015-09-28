title: POJ 2386 Lake Counting
date: 2014-07-12 21:34:56
tags: [ACM, POJ, C, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2386

# 理解
当年学习DFS的AC掉的一道水题。DFS的经典模板，通过找出全部的相连池塘块来确定有几块池塘。

<!-- more -->

# 代码
## 原始版本

```
#include  <cstdio>
#include  <cstring>
using namespace std;

int x, y, i, j, ans;
char Map[100][100];
int visited[100][100];

int dfs(int i, int j)
{
    if (!visited[i][j] && Map[i][j] == 'W')
    {
        visited[i][j] = 1;
        if (j + 1 < y && Map[i][j + 1] == 'W')     dfs(i, j + 1);
        if (j + 1 < y && i - 1 >= 0 && Map[i - 1][j + 1] == 'W')    dfs(i - 1, j + 1);
        if (i - 1 >= 0 && Map[i - 1][j] == 'W')    dfs(i - 1, j);
        if (i - 1 >= 0 && j - 1 >= 0 && Map[i - 1][j - 1] == 'W')   dfs(i - 1, j - 1);
        if (j - 1 >= 0 && Map[i][j - 1] == 'W')     dfs(i, j - 1);
        if (j - 1 >= 0 && i + 1 < x && Map[i + 1][j - 1] == 'W')     dfs(i + 1, j - 1);
        if (i + 1 < x && Map[i + 1][j] == 'W')      dfs(i + 1, j);
        if (i + 1 < x && j + 1 < y && Map[i + 1][j + 1] == 'W')     dfs(i + 1, j + 1);
    }
    return 0;
}

int main()
{
    scanf("%d%d", &x, &y);

    ans = 0;
    memset(visited, 0, sizeof(visited));
    for (i = 0; i < x; i++)    scanf("%s", Map[i]);
    for (i = 0; i < x; i++)
    {
        for (j = 0; j < y; j++)
        {
            if (Map[i][j] == 'W' && !visited[i][j])
            {
                dfs(i, j);
                ans ++ ;
            }
        }
    }
    printf("%d\n", ans);

    return 0;
}

```

## 优化版本

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
#define MAXN 110
using namespace std;

int n, m;
char field[MAXN][MAXN + 1];

void dfs(int x, int y)
{
    field[x][y] = '.';
    for (int dx = -1; dx <= 1; dx++)
    {
        for (int dy = -1; dy <= 1; dy++)
        {
            int nx = x + dx, ny = y + dy;
            if (0 <= nx && nx < n && 0 <= ny && ny < m && field[nx][ny] == 'W')
                dfs(nx, ny);
        }
    }
    return;
}

int main(int argc, char const *argv[])
{

    int res = 0;
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        cin >> field[i];
    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < m; j++)
        {
            if (field[i][j] == 'W')
            {
                dfs(i, j);
                res++;
            }
        }
    }
    cout << res << endl;
    return 0;
}

```

# 更新日志
- 2014年07月12日 已AC。
- 2014年08月18日 更新了优化后的代码，提升可读性，并且运用了新的处理方法。