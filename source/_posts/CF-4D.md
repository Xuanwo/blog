title: Codeforces Beta Round 4 D Mysterious Present
date: 2014-11-7 10:05:24
tags: [ACM, Codeforces, C/C++, DP]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/problemset/problem/4/D

# 理解
题目好像是俄罗斯套娃的二维版，就是求一个二维的最长上升子序列问题。
只要按照其中一个变量排序，然后求第二个变量的最长上升子序列即可。

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
#define eps (1e-8)
#define inf 0x3f3f3f3f
#define ll long long int
using namespace std;

#define MAXN 5000+10

struct node
{
    int no;
    int w;
    int h;
    int prev;
    int l;
    node(int no, int w, int h, int prev, int l)
    {
        this->no = no;
        this->w = w;
        this->h = h;
        this->prev = prev;
        this->l = l;
    }

    bool operator < (const node& e) const
    {
        return (w < e.w);
    }
};

int n, w, h;
int tmpw, tmph;

int cmp(node e1, node e2)
{
    if (e1.w < e2.w && e1.h < e2.h) return 1;
    return -1;
}

int main(int argc, char const *argv[])
{
    vector<node> envs;
    scanf("%d %d %d", &n, &w, &h);
    for (int i = 0; i < n; i++)
    {
        scanf("%d %d", &tmpw, &tmph);
        if (tmpw <= w || tmph <= h) continue;
        envs.push_back(node(i+1, tmpw, tmph, -1, 1));
    }
    sort(envs.begin(), envs.end());
    for (int i = 0; i < envs.size(); i++)
    {
        for (int j = 0; j < i; j++)
        {
            if (cmp(envs[j], envs[i]) <= 0) continue;
            if (envs[i].l >= envs[j].l + 1) continue;
            envs[i].l = envs[j].l + 1;
            envs[i].prev = j;
        }
    }
    int maxl = 0, pos = -1;
    for (int i = 0; i < envs.size(); i++)
    {
        if (envs[i].l <= maxl) continue;
        maxl = envs[i].l;
        pos = i;
    }

    if (maxl == 0)
    {
        printf("0\n");
    }
    else
    {
        stack<int> s;
        while (pos != -1)
        {
            s.push(envs[pos].no);
            pos = envs[pos].prev;
        }

        printf("%d\n%d", s.size(), s.top());
        s.pop();
        while (!s.empty())
        {
            printf(" %d", s.top());
            s.pop();
        }
        printf("\n");
    }
    return 0;
}
```

# 更新日志
- 2014年11月7日 已AC。