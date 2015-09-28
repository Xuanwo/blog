title: UVa 11134 Fabled Rooks
date: 2014-11-4 12:58:56
tags: [ACM, UVa, C, 贪心]
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=2075

# 理解
比赛的时候没有写出来。其实很容易可以看出来，这个题目可以变成两个子题目，也就是X和Y方向并没有直接的关系，完全可以看成在X方向是不重叠摆放和在Y方向是不重叠摆放的问题。
一开始的想法是只要对它进行排序，然后逐个判断是否符合题意就OK，但是后来发现这样并不能解决问题。后来看了题解，决定采用优先队列来维护可以选择的区间。也就是每次都在区间[l,r]中选取l最小且r最小的区间，然后设一个变量maxx保存一下当前已经摆放到了什么位置。要是存在一个l<maxx，那么则需要将这个l修改为maxx，并且重新放入队列中。这样，就能保证后面的棋子都不会和前面已经摆好的重叠。

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-4)
#define inf (1<<28)
#define ll long long int
using namespace std;

#define MAXN 5010

int n;
int i,j;

struct NODE
{
    int l, r, id;
    friend bool operator<(const Node& a, const Node&b)
    {
        if(a.l != b.l) return a.l > b.l;
        return a.r > b.r;
    }
} arr1[MAXN], arr2[MAXN];
int ans[MAXN][2];

bool check(Node* arr, int pos)
{
    priority_queue<Node>Q;
    for(int i=0; i<n; ++i) Q.push(arr[i]);
    int maxx=0;
    while(!Q.empty())
    {
        Node tmp = Q.top();
        Q.pop();
        if(tmp.r < maxx) return false;
        if(tmp.l < maxx)
        {
            tmp.l=maxx;
            Q.push(tmp);
            continue;
        }
        int cur = max(maxx, tmp.l);
        ans[tmp.id][pos] = cur;
        maxx = cur+1;
    }
    return true;
}

int main(int argc, char const *argv[])
{

    while(scanf("%d", &n) && n)
    {
        for(i=0; i<n; ++i)
        {
            scanf("%d%d%d%d",&arr1[i].l,&arr2[i].l,&arr1[i].r,&arr2[i].r);
            arr1[i].id = arr2[i].id = i;
        }

        if(check(arr1,0) && check(arr2,1))
        {
            for(i=0; i<n; ++i)
                printf("%d %d\n", ans[i][0], ans[i][1]);
        }
        else
        {
            puts("IMPOSSIBLE");
        }
    }
    return 0;
}

```

# 更新日志
- 2014年10月27日 已AC。