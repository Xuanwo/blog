---
categories: Exercise
date: 2014-07-22T13:51:22Z
title: POJ 1703 Find them, Catch them
toc: true
url: /2014/07/22/POJ-1703-Find-them-Catch-them/
---

## 题目
源地址：

http://poj.org/problem?id=1703

# 理解
这个并查集有点不一样，之前做过的全都是判断是否连通，这一次确实要判断是否不连通。想了一想，其实还是可以转换过来的。假定r1，r2分别表示ab，bc之间的关系，0表示相同，1表示不同，则有下面的逻辑表。

|(a, b)| (b, c) | (a, c) | (r1+r2)%2|
| :-----: | :-----:  | :-----:  |:-----:|
|0	    |0       |0       |0         |
|0       |1       |1       |1         |
|1       |0       |1       |1         |
|1       |1       |0       |0         |

<!--more-->

# 代码

```
#include<cstdio>

const int maxn = 100000 + 10;

int p[maxn];
int r[maxn];

int find(int x)
{
    if (x == p[x]) return x;
    int t = p[x];
    p[x] = find(p[x]);
    r[x] = (r[x] + r[t]) % 2;
    return p[x];
}

void Union(int x, int y)
{
    int fx = find(x);
    int fy = find(y);

    p[fx] = fy;
    r[fx] = (r[x] + 1 + r[y]) % 2;
}
void set(int n)
{
    for (int x = 1; x <= n; x++)
    {
        p[x] = x;
        r[x] = 0;
    }
}

int main(int argc, char const *argv[])
{
    int T;
    int n, m;
    scanf("%d", &T);
    while (T--)
    {
        scanf("%d%d%*c", &n, &m);
        set(n);

        char c;
        int x, y;
        while (m--)
        {
            scanf("%c%d%d%*c", &c, &x, &y);
            if (c == 'A')
            {
                if (find(x) == find(y))
                {
                    if (r[x] != r[y]) printf("In different gangs.\n");
                    else printf("In the same gang.\n");
                }
                else printf("Not sure yet.\n");
            }
            else if (c == 'D')
            {
                Union(x, y);
            }
        }
    }
    return 0;
}

```

# 更新日志
- 2014年07月22日 已AC。