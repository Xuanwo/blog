---
title: POJ 1318 Word Amalgamation
date: 2014-07-23 13:38:41
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1318

# 理解
一开始的思路有点偏，想要单纯的使用string类的compare函数来解决问题。但是稍微考虑一下之后发现，复杂度有点高。事实上，我根本就不需要知道它们是不是匹配，只要排序之后匹配即可。

<!-- more -->

# 代码

```
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;
#define MAX 105

string dic[MAX], out[MAX], tmp;
int n, i;
int flag;

int main(int argc, char const *argv[])
{
    while (cin >> dic[i] && dic[i][0] != 'X')  i++;
    sort(dic, dic + i);
    n = i;
    for (i = 0; i < n; i++)
    {
        out[i] = dic[i];
        sort(dic[i].begin(), dic[i].end());
    }
    while (cin >> tmp)
    {
        if (tmp[0] == 'X')   break;
        flag = 0;
        sort(tmp.begin(), tmp.end());
        for (i = 0; i < n; i++)
        {
            if (tmp == dic[i])
            {
                flag = 1;
                cout << out[i] << endl;
            }
        }
        if (flag == 0)
            cout << "NOT A VALID WORD" << endl;
        cout << "******" << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年07月23日 已AC。