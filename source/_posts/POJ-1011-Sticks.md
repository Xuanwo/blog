title: POJ 1011 木棒
date: 2014-07-16 12:20:44
tags: [ACM, POJ, C, DFS, 剪枝]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1011

# 理解
一开始的想法比较简单，单纯的求和然后找出最短的那根。但是这样的做法有下面的一些问题：第一，最后的棒子的和不能比最短的棒子还短；第二，最后的棒子必须是由给定的棒子合成的。因此只能使用搜索的方法，但是常规的搜索会超时，必须辅以有效的剪枝，以下是参考之后的代码。

<!-- more -->

# 代码

```
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>
using namespace std;

int sticks[64], n, len, num, sum;
bool used[64];
bool end;

bool compare(int a, int b)
{
    return a > b;
}

bool dfs(int cur, int left, int level)
{
    if (left == 0)
    {
        if (level == num - 2)
            return true;
        for (cur = 0; used[cur]; cur++);
        used[cur] = true;
        if (dfs(cur + 1, len - sticks[cur], level + 1))
            return true;
        used[cur] = false;
        return false;
    }
    else
    {
        if (cur >= n - 1)
            return false;
        for (int i = cur; i < n; i++)
        {
            if (used[i])
                continue;
            if ((sticks[i] == sticks[i - 1]) && !used[i - 1])
                continue;
            if (sticks[i] > left)
                continue;
            used[i] = true;
            if (dfs(i, left - sticks[i], level))
                return true;
            used[i] = false;
        }
        return false;
    }
}

int main(int argc, char const *argv[])
{
    while (cin >> n)
    {
        if (n == 0)
            break;
        for (int i = 0; i < n; i++)
        {
            scanf("%d", &sticks[i]);
            sum += sticks[i];
        }
        sort(sticks, sticks + n, compare);
        end = false;
        for (len = sticks[0]; len <= sum / 2; len++)
        {
            if (sum % len == 0)
            {
                used[0] = true;
                num = sum / len;
                if (dfs(0, len - sticks[0], 0))
                {
                    end = true;
                    printf("%d\n", len);
                    break;
                }
                used[0] = false;
            }
        }
        if (!end)
            printf("%d\n", sum);
        memset(used, 0, sizeof(used));
    }
    return 0;
}


```

# 更新日志
- 2014年07月16日 已AC。