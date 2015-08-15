title: POJ 1657 Distance on Chessboard
date: 2014-07-13 16:42:02
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1657

# 理解
再一次脑洞大开了= =，居然还写了一个`normalize`函数用来区分是不是可行的走法，其实只要通过`abs(x-y)%2!=0`即可实现判断斜的方向上是否可以行走了。恩，这是程序设计实践导引上的例题，加上中文，没有什么好讲的。不过需要注意位置没有发生改变时的特殊情况。

<!-- more -->

# 代码
```
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
using namespace std;

int t;
char x1, x2;
int y1, y2;
int x, y;

int main(int argc, char const *argv[])
{
    int t;
    cin >> t;
    while (t--)
    {
        cin >> x1 >> y1;
        getchar();
        cin >> x2 >> y2;
        x = abs(x1 - x2);
        y = abs(y1 - y2);
        if (x == 0 && y == 0)  cout << "0 0 0 0" << endl;
        else
        {
            if (x < y) cout << y;
            else cout << x;
            if (x == y || x == 0 || y == 0)    cout << " 1";
            else cout << " 2";
            if (x == 0 || y == 0)  cout << " 1";
            else cout << " 2";
            if (abs(x - y) % 2 != 0) cout << " Inf" << endl;
            else if (x == y)   cout << " 1" << endl;
            else cout << " 2" << endl;
        }
    }
    return 0;
}
```

# 更新日志
- 2014年07月13日 已AC。