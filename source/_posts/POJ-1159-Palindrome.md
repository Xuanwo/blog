title: POJ 1159 Palindrome
date: 2014-08-12 00:38:00
tags: [ACM, POJ, C/C++, DP]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1159

# 理解
最关键的公式是：
```
{% raw %}
if (str[i] == str[j])
    DP[k][j] = DP[1 - k][j - 1];
else
    DP[k][j] = min(DP[1 - k][j], DP[k][j - 1]) + 1;
{% endraw %}
```
注意到k空间的循环利用，节省了空间，感谢大牛提供的思路。

<!-- more -->
# 代码
```
{% raw %}
#include <iostream>
#include <string.h>
#include <cstdio>
#include <string>

using namespace std;

int DP[2][5003];

int main(int argc, char const *argv[])
{
    int n;
    string str;

    while (scanf("%d", &n) != EOF)
    {
        cin >> str;
        memset(DP, 0, sizeof(DP));

        int k = 0;
        for (int i = n - 2; i >= 0; i--)
        {
            for (int j = i; j < n; j++)
            {
                if (str[i] == str[j])
                    DP[k][j] = DP[1 - k][j - 1];
                else
                    DP[k][j] = min(DP[1 - k][j], DP[k][j - 1]) + 1;
            }
            for (int j = 0; j < n; j++) DP[1 - k][j] = 0;
            k = 1 - k;
        }
        printf("%d\n", DP[1 - k][n - 1]);
    }
    return 0;
}
{% endraw %}
```
	
# 更新日志
- 2014年08月12日 已AC。