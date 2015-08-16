title: POJ 2503 Babelfish
date: 2014-08-16 23:41:45
tags: [ACM, POJ, C, STL, Map]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2503

# 理解
STL里面Map的运用，分别建立映射就好，不难。

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
#define inf (1<<30)
using namespace std;

int main(int argc, char const *argv[])
{
    char str[20], s1[20], s2[20];
    map<string, string>mymap;
    while (gets(str))
    {
        if (strlen(str) == 0) break;
        sscanf(str, "%s %s", s1, s2);
        mymap[s2] = s1;
    }
    while (gets(str))
    {
        if (mymap[str].length() == 0)
            puts("eh");
        else
            cout << mymap[str] << endl;
    }
    return 0;
}
```
# 更新日志
- 2014年08月16日 已AC。