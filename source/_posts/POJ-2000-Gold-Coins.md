title: POJ 2000 Gold Coins
date: 2014-08-05 21:02:00
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2000

# 理解
求N天得到多少个金币，第一天得到1个，第二、三天得到2个，第四、五、六天得到3个。

<!-- more -->

# 代码
```
#include <iostream>
using namespace std;

int i;
int day, day1 = 0, coin = 0;

int main(int argc, char const *argv[])
{
    cin >> day;
    while (day)
    {
        coin = 0; day1 = 0;
        i = 0;
        do
        {
            i++;
            day1 += i;
            coin += i * i;
        }
        while (day1 < day);
        if (day1 > day) coin -= (day1 - day) * i;
        cout << day << ' ' << coin << endl;
        cin >> day;
    }
}
```
	
# 更新日志
- 2014年08月05日 已AC。