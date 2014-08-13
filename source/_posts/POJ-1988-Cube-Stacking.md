title: POJ 1988 Cube Stacking
date: 2014-07-22 16:36:53
tags: [ACM, POJ, C/C++, 并查集]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1988

# 理解
这道题也想了很久。问题主要出在堆叠得过程中，我只考虑了根节点的变化，而没有去更新位于同一个根节点下的方块的高度变化。发现问题之后，试图寻找到一种有效得递归方法，但是失败了。无奈之后，决定再开一个deep数组来保存当前节点到根节点之间的深度差。

<!-- more -->

# 代码
```
#include <cstdio>
#include <iostream>
#include <cstring>
using namespace std;
#define N 30010

int pre[N], son[N], deep[N];

int find(int x)
{
    int temp;
    if (x == pre[x])
        return x;
    temp = pre[x];
    pre[x] = find(temp);
    deep[x] += deep[temp];
    return pre[x];
}

int main(int argc, char const *argv[])
{
    int p;
    char ope;
    int a, b;
    int query;
    int root1, root2;
    scanf("%d", &p);
    for (int i = 1; i < N; ++i)
    {
        pre[i] = i;
        son[i] = 1;
        deep[i] = 0;
    }
    for (int i = 0; i < p; ++i)
    {
        scanf("%*c%c", &ope);
        if (ope == 'M')
        {
            scanf("%d%d", &a, &b);
            root1 = find(a);
            root2 = find(b);
            if (root1 != root2)
            {
                pre[root2] = root1;
                deep[root2] = son[root1];
                son[root1] += son[root2];
            }
        }
        else
        {
            scanf("%d", &query);
            printf("%d\n", son[find(query)] - deep[query] - 1);
        }
    }
    return 0;
}
```

# 更新日志
- 2014年07月22日 已AC。