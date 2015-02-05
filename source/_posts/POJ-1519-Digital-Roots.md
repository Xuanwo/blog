title: POJ 1519 Digital Roots
date: 2014-07-25 04:29:15
tags: [ACM, POJ, C, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1519

# 理解
这不就是弃九法么。把每个位置上数字相加迭代即可，但是多次WA，看了discuss才知道原来数据到了2000位的，只能用数组模拟。

<!-- more -->

# 代码
```
#include <iostream>
#include <string.h>
using namespace std;

int root;
string n;

int main(int argc, char const *argv[])
{

    while (cin>>n&&n!="0")
    {
        root = 0;
        for (int i = 0; i < n.length(); i++)
        {
            root += n[i] - '0';
        }
        root %= 9;
        cout << (root == 0 ? 9 : root) << endl;
    }
    return 0;
}
```

# 更新日志
- 2014年07月25日 已AC。