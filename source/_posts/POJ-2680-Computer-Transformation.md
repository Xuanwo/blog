title: POJ 2680 Computer Transformation
date: 2014-07-15 19:28:08
tags: [ACM, POJ, C/C++, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3048

# 理解
数学规律并不难，很容易推出f[n]=f[n-1]+f[n-2]*2。但是2^1000次方，必须使用一定的手段来处理这个超大的数据。这里使用了一种比较简单的技巧，数组模拟。

<!-- more -->

# 代码
```
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>

using namespace std;

int dig[1010][1010];

int main(int argc, char const *argv[])
{
    dig[1][0] = 0;
    dig[2][0] = 1;

    for (int i = 3; i <= 1000; i++)
    {
        for (int j = 0; j < 1000; j++)
        {
            dig[i][j] += dig[i - 2][j] * 2 + dig[i - 1][j];
            if (dig[i][j] > 9)
            {
                dig[i][j + 1] = dig[i][j] / 10;
                dig[i][j] %= 10;
            }
        }
    }

    int n;
    while ( cin >> n)
    {
        if ( n == 1) cout << "0" << endl;
        else
        {
            bool flag = true;
            for (int i = 999; i >= 0; i--)
            {
                if ( dig[n][i] && flag)
                {
                    flag = false;
                }
                if (!flag)
                    cout << dig[n][i] ;
            }
            cout << endl;
        }
    }
    return 0;
}
```

# 更新日志
- 2014年07月15日 已AC。