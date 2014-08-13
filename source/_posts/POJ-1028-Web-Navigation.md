title: POJ 1028 Web Navigation
date: 2014-07-20 15:40:31
tags: [ACM, POJ, C/C++, stack, STL]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1028

# 理解
这是一道STL里面的栈的运用的一个模板题。构建两个栈，一个存放forward，一个存放backward，然后后再建立一个string类用于存放浏览器当前的页面。题目不难，但是要理解你现在的操作对栈影响是什么，先后顺序一点都不能错。

<!-- more -->

# 新技能get
std::stack中几个常用的操作
|stack<int> example; |建立一个int型的栈                                 |
|example.push(a);    |将a的值放在example栈的最顶端                      |
|example.top();      |获取example栈当前最顶端的值，此处它的返回值为a的值|
|example.pop();      |将example栈最顶端的值丢弃                         |
|example.empty();    |判断example栈是否为空，是的话返回1，不是的话返回0 |

# 代码
```
#include <iostream>
#include <stack>
#include <string>
using namespace std;

stack<string> forward;
stack<string> backward;
string order, tmp, now;

int main(int argc, char const *argv[])
{
    now = "http://www.acm.org/";
    while (cin >> order && order.compare("QUIT"))
    {
        if (!order.compare("VISIT"))
        {
            backward.push(now);
            cin >> now;
            cout << now << endl;
            while (!forward.empty()) forward.pop();
        }
        else if (!order.compare("BACK"))
        {
            if (!backward.empty())
            {
                forward.push(now);
                now = backward.top();
                backward.pop();
                cout << now << endl;
            }
            else
            {
                cout << "Ignored\n";
                continue;
            }
        }
        else if (!order.compare("FORWARD"))
        {
            if (!forward.empty())
            {
                backward.push(now);
                now = forward.top();
                forward.pop();
                cout << now << endl;
            }
            else
            {
                cout << "Ignored\n";
                continue;
            }
        }
    }
    return 0;
}
```

# 更新日志
- 2014年07月20日 已AC。