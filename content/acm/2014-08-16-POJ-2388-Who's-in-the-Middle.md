---
categories: Code
date: 2014-08-16T15:12:33Z
title: POJ 2388 Who's in the Middle
toc: true
url: /2014/08/16/POJ-2388-Who's-in-the-Middle/
---

## 题目
源地址：

http://poj.org/problem?id=2388

# 理解
纯排序题，直接用sort水过。

<!--more-->

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
    int i, N;
    cin >> N;
    vector<int>arr(N);
    for (i + 0; i < N; i++)
        cin >> arr[i];
    sort(arr.begin(), arr.end());
    cout << arr[N / 2] << endl;
    return 0;
}

```

# 更新日志
- 2014年08月16日 已AC。