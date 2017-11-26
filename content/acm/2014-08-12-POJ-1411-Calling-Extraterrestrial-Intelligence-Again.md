---
categories: Exercise
date: 2014-08-12T04:54:00Z
title: POJ 1411 Calling Extraterrestrial Intelligence Again
toc: true
url: /2014/08/12/POJ-1411-Calling-Extraterrestrial-Intelligence-Again/
---

## 题目
源地址：

http://poj.org/problem?id=1411

# 理解
打表暴力水过，估计是因为数据弱= =。

<!--more-->

# 代码

```
#include<cstdio>
int m, a, b;
bool ok[100010];
int prime[100000], cnt, ansx, ansy, ans;

void init()
{
    for (int i = 2; i <= 100000; i++)
        if (!ok[i])
        {
            for (int j = i; j <= 100000 / i; j++)
                ok[i * j] = 1;
            prime[++cnt] = i;
        }
}

int main(int argc, char const *argv[])
{
    init();
    while (scanf("%d%d%d", &m, &a, &b), m || a || b)
    {
        ans = 0;
        for (int i = 1; i <= cnt; i++)
            for (int j = 1; j <= i; j++)
                if (prime[i]*prime[j] > m) break;
                else if (prime[j]*b >= prime[i]*a && ans < prime[i]*prime[j])
                {
                    ans = prime[i] * prime[j];
                    ansx = prime[j];
                    ansy = prime[i];
                }
        printf("%d %d\n", ansx, ansy);
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。