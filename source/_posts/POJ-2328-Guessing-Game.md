title: POJ 2328 Guessing Game
date: 2014-08-22 22:28:14
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2328

# 理解
猜数字游戏，还是比较熟悉的模型。
先确定一个正确数字，另一个人猜数字，然后回答猜测数字比正确数字是太高、太低还是正确。现在题中给定猜测的过程，让我们用程序验证这个猜测过程中，回答是否正确。

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
using namespace std;

char str[3][20] = {"too high", "too low", "right on"};
int answer[1100];
int getnum[1100];

int getanswer(char ans[])
{
    if (strcmp(str[0], ans) == 0)
    {
        return 1;
    }
    else if (strcmp(str[1], ans) == 0)
    {
        return -1;
    }
    else if (strcmp(str[2], ans) == 0)
    {
        return 0;
    }
}

int main(int argc, char const *argv[])
{
    char tmp[20];
    int num, rightnum;
    int i, j;
    int flag;

    while (scanf("%d", &num), num != 0)
    {
        getchar();
        gets(tmp);
        answer[0] = getanswer(tmp);
        getnum[0] = num;
        for (i = 0; answer[i] != 0; )
        {
            i++;
            scanf("%d", &num);
            getchar();
            gets(tmp);
            answer[i] = getanswer(tmp);
            getnum[i] = num;
        }
        rightnum = getnum[i];
        i++;
        for (flag = 1, j = 0; j < i - 1; j++)
        {
            if (getnum[j] - rightnum > 0 && answer[j] == 1 )
            {
                continue;
            }
            else if (getnum[j] - rightnum < 0 && answer[j] == -1)
            {
                continue;
            }
            else
            {
                flag = 0;
                break;
            }
        }
        if (flag)
        {
            printf("Stan may be honest\n");
        }
        else if (flag == 0)
        {
            printf("Stan is dishonest\n");
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月22日 已AC。