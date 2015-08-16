title: POJ 2575 Jolly Jumpers
date: 2014-08-22 21:37:59
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2575

# 理解
又是一道已经A过的题目，咦，都是什么时候做的啊？

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



int main(int argc, char const *argv[])
{
    int num;

    while (cin >> num)
    {
        int i;
        int *Jump = (int *)malloc(sizeof(int) * num);
        bool *flag = (bool *)malloc(sizeof(bool) * num);
        memset(flag, false, sizeof(bool)*num);

        for (int j = 0; j < num; j++)
        {
            cin >> Jump[j];
        }

        for (i = 1; i < num; i++)
        {
            int tmp;
            tmp = abs(Jump[i] - Jump[i - 1]);
            if (flag[tmp])
            {
                break;
            }
            flag[tmp] = true;
        }

        if (i == num)
        {
            cout << "Jolly" << endl;
        }
        else
        {
            cout << "Not jolly" << endl;
        }
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。