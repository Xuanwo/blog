---
categories: Code
date: 2014-08-22T22:41:28Z
title: POJ 1250 Tanning Salon
toc: true
url: /2014/08/22/POJ-1250-Tanning-Salon/
---

## 题目
源地址：

http://poj.org/problem?id=1250

# 理解
旅行者的问题，按照题目意思来就好。

<!--more-->

# 新技能get

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
using namespace std;

const int MAX = 60;

int main(int argc, char const *argv[])
{
    int n, i, id, ans;
    char str[MAX];
    bool vis[MAX], tan[MAX];
    while (cin >> n && n)
    {
        memset(vis, 0, sizeof(vis));
        memset(tan, 0, sizeof(tan));
        cin >> str;
        ans = 0;
        for (i = 0; i < strlen(str); i ++)
        {
            id = str[i] - 'A';
            if (!vis[id])
            {
                vis[id] = true;
                if (n > 0)
                {
                    n --;
                    tan[id] = true;
                }
                else ans ++;
            }
            else
            {
                if (tan[id]) n ++;
            }
        }
        if (ans == 0)
            printf("All customers tanned successfully.\n");
        else
            printf("%d customer(s) walked away.\n", ans);
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。