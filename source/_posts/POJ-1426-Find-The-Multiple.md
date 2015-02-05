title: POJ 1426 Find The Multiple
date: 2014-08-12 04:27:00
tags: [ACM, POJ, C, STL, Queue, BFS]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1426

# 理解
使用了BFS来搜索满足条件的数，注意必须使用long long，否则数据不够。

<!-- more -->

# 代码
```
#include <iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<stack>
#include<queue>
#include<iomanip>
#include<cmath>
#include<map>
#include<vector>
#include<algorithm>
using namespace std;

long long a;

void bfs()
{
    queue<long long>q;
    int i, j;
    long long x = 1, pos;
    q.push(x);
    while (!q.empty())
    {
        pos = q.front();
        q.pop();
        for (i = 0; i < 2; i++)
        {
            x = pos * 10 + i;
            if (x % a == 0)
            {
                cout << x << endl;
                return;
            }
            q.push(x);
        }
    }
}

int main(int argc, char const *argv[])
{
    int i, j;
    while (cin >> a && a)
    {
        if (a == 1)
        {
            cout << "1" << endl;
            continue;
        }
        bfs();
    }
    return 0;
}
```
	
# 更新日志
- 2014年08月12日 已AC。