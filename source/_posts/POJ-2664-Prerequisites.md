title: POJ 2664 Prerequisites?
date: 2014-08-22 21:30:44
tags: [ACM, POJ, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=

# 理解
将已经选择的课程标记下来，然后对于每一个类别分别进行验证是否已经符合了要求。

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

int arr[10010];

int main(int argc, char const *argv[])
{
    int k, c;
    int num, need, tmp, taken;
    int flag;
    int i, j;

    while (scanf("%d", &k), k != 0)
    {
        memset(arr, 0, sizeof(arr));
        scanf("%d", &c);
        for (i = 0; i < k; i++)
        {
            scanf("%d", &tmp);
            arr[tmp] = 1;
        }
        flag = 1;
        for (i = 0; i < c; i++)
        {
            scanf("%d%d", &num, &need);
            for (j = taken = 0; j < num; j++)
            {
                scanf("%d", &tmp);
                if (arr[tmp] == 1)
                {
                    taken ++;
                }
            }
            if (taken < need)
            {
                flag = 0;
            }
        }
        if (flag)
        {
            printf("yes\n");
        }
        else
        {
            printf("no\n");
        }
    }
    return 0;
}
```
# 更新日志
- 2014年08月22日 已AC。