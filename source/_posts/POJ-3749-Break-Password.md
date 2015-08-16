title: POJ 3749 破译密码
date: 2014-08-21 22:08:38
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3749

# 理解
将一个字符串按照一定的规则转化，中文题，不多说了。。

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
    char str[201];
    char str2[7];
    while (gets(str2), strcmp(str2, "ENDOFINPUT") != 0)
    {
        memset(str, '\0', sizeof(str));
        gets(str);
        for (int i = 0; str[i] != '\0'; i++)
        {
            if (str[i] >= 'F' && str[i] <= 'Z')
                str[i] -= 5;
            else if (str[i] >= 'A' && str[i] < 'F')
                str[i] += 21;
        }
        gets(str2);
        cout << str << endl;
    }
    return 0;
}
```
# 更新日志
- 2014年08月21日 已AC。