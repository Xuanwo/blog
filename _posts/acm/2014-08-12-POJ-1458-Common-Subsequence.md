---
layout: post
title: POJ 1458 Common Subsequence
date: 2014-08-12 04:23:00
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1458

# 理解
DP的基础题，求最长子序列（LCS）。
状态转移方程伪代码如下：

```
if (i == 0 || j == 0)
	dp[i,j] = 0
else if (X[i] == Y[j])
	dp[i,j] = dp[i-1,j-1] + 1
else
	dp[i,j] = max(dp[i-1,j], dp[i,j-1])

```

<!-- more -->

# 代码

```
#include <iostream>
#include <string>

using namespace std;

const int SIZE = 999;
int dp[SIZE][SIZE] = {0};

int max(int x, int y)
{
    return x > y ? x : y;
}

int main(int argc, char const *argv[])
{
    int len1, len2;
    string str1, str2;
    while (cin >> str1 >> str2)
    {
        len1 = str1.length();
        len2 = str2.length();
        for (int i = 1; i <= len1; i++)
        {
            for (int j = 1; j <= len2; j++)
            {
                if (str1[i - 1] == str2[j - 1])
                {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                else
                {
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        cout << dp[len1][len2] << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年08月12日 已AC。