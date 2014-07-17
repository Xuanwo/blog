title: POJ 2386 Lake Counting
date: 2014-07-12 21:34:56
tags: [ACM, POJ, C/C++, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2386

# 理解
当年学习DFS的AC掉的一道水题。DFS的经典模板，通过找出全部的相连池塘块来确定有几块池塘。

<!-- more -->

# 代码
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