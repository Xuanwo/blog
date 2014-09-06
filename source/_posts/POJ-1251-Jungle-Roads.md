title: POJ 1251 Jungle Roads
date: 2014-08-06 22:52:00
tags: [ACM, POJ, C/C++, Graph, Kruskal, 最小生成树, Prim]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1251

# 理解
同样是练习题，使用了Kruskal算法，对着模板敲的，理解的还不是很透彻。

补充一个Prim算法的代码，神模板好评，自己对最小生成树的理解有了很大提高。在凌晨时分debug了半天，通过逐行打印，最终确认我错误的原因，没有进行初始化。虽然有点哭笑不得，但是感觉自己花了这三个小时是值得的。以后要避免这样的错误。

<!-- more -->

# 代码
## Kruskal算法
```
#include <iostream>
#include <algorithm>
using namespace std;
#define MAX 26

typedef struct
{
    int x, y;
    int w;
} edge;

edge e[MAX *MAX];
int rank[MAX];
int father[MAX];
int sum;


bool cmp(const edge a, const edge b)
{
    return a.w < b.w;
}


void Make_Set(int x)
{
    father[x] = x;
    rank[x] = 0;
}


int Find_Set(int x)
{
    if (x != father[x])
    {
        father[x] = Find_Set(father[x]);
    }
    return father[x];
}


void Union(int x, int y, int w)
{

    if (x == y) return;
    if (rank[x] > rank[y])
    {
        father[y] = x;
    }
    else
    {
        if (rank[x] == rank[y])
        {
            rank[y]++;
        }
        father[x] = y;
    }
    sum += w;
}

int main()
{
    int i, j, k, m, n, t;
    char ch;
    while (cin >> m && m != 0)
    {
        k = 0;
        for (i = 0; i < m; i++) Make_Set(i);
        for (i = 0; i < m - 1; i++)
        {
            cin >> ch >> n;
            for (j = 0; j < n; j++)
            {
                cin >> ch >> e[k].w;
                e[k].x = i;
                e[k].y = ch - 'A';
                k++;
            }
        }
        sort(e, e + k, cmp);
        sum = 0;
        for (i = 0; i < k; i++)
        {
            Union(Find_Set(e[i].x), Find_Set(e[i].y), e[i].w);
        }
        cout << sum << endl;
    }
    return 0;
}
```

## Prim算法
```
#include <iostream>
#include <cstdio>
#include <string.h>
using namespace std;
#define MAXN 200
#define inf 1000000000

typedef int elem_t;

elem_t prim(int n, elem_t mat[][MAXN], int *pre)
{
    elem_t min[MAXN], ret = 0;
    int v[MAXN], i, j, k;
    for (i = 0; i < n; i++)
        min[i] = inf, v[i] = 0, pre[i] = -1;
    for (min[j = 0] = 0; j < n; j++)
    {
        for (k = -1, i = 0; i < n; i++)
            if (!v[i] && (k == -1 || min[i] < min[k]))
                k = i;
        for (v[k] = 1, ret += min[k], i = 0; i < n; i++)
            if (!v[i] && mat[k][i] < min[i])
                min[i] = mat[pre[i] = k][i];
    }
    return ret;
}

int main(int argc, char const *argv[])
{
    int n, i, j, k, cnt, x, sum;
    char ch;
    int pre[MAXN];
    elem_t mat[MAXN][MAXN];
    while (cin >> n && n)
    {
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++)
            {
                mat[i][j] = inf;
                if(i==j)    mat[i][j]=0;
            }
        for (i = 0; i < n - 1; i++)
        {
            cin >> ch >> cnt;
            for (j = 0, k = int(ch - 'A'); j <= cnt - 1; j++)
            {
                cin >> ch >> x;
                mat[k][int(ch - 'A')] = x;
                mat[int(ch - 'A')][k] = x;
            }
        }
        sum = prim(n, mat, pre);
        cout<<sum<<endl;
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月06日 已AC。