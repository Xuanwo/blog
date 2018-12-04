---
categories: Code
date: 2014-08-12T04:32:00Z
title: POJ 1477 Box of Bricks
toc: true
url: /2014/08/12/POJ-1477-Box-of-Bricks/
---

## 题目
源地址：

http://poj.org/problem?id=1477

# 理解
只有比平均数还要大的柱子需要移动，而移动的具体方式不需要考虑，明白了这一点就是水题了。

<!--more-->
# 代码

```

#include <cstdio>
#include <iostream>
#include <cstdlib>
using namespace std;

int main(int argc, char const *argv[])
{
    int n, i, sum, ave, j, ans, t = 1;
    int e[51];
    while (scanf("%d", &n) == 1 && n)
    {
        ave = sum = 0;
        for (i = 1; i <= n; i++)
        {
            scanf("%d", &e[i]);
            sum += e[i];
        }
        ave = sum / n;
        ans = 0;
        for (i = 1; i <= n; i++)
        {
            if (e[i] > ave)
            {
                ans += e[i] - ave;
            }
        }
        cout << "Set #" << t++ << "\nThe minimum number of moves is " << ans << "." << endl << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。