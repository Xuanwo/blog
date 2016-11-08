---
layout: post
title: POJ 1008 Maya Calendar
date: 2014-07-07 23:04:08
categories: Exercise
toc: true
---
## 题目
源地址：

http://poj.org/problem?id=1008

# 理解
两种纪年法的转换，另外设一个`days`的变量保存总天数，然后以它为基准进行变换，没有什么难度。但是在具体的方法上，还是有些优化的余地。比如我不用写那么多长长的if判断语句，使用一个`string`数组就可以轻松搞定了，这是我不机智的地方。此外，应当注意到，两种纪年法的第一天分别是0和1，要小心。

<!-- more -->
# 新技能get
[string类](http://www.cplusplus.com/reference/string/string/?kw=string)
C++就是比C高大上，再也不需要`char`数组了～
介绍一下`string类`常用的一些方法和变量：
- [`length`](http://www.cplusplus.com/reference/string/string/length/)
- [`find`](http://www.cplusplus.com/reference/string/string/find/)
- [`copy`](http://www.cplusplus.com/reference/string/string/copy/)
- [`swap`](http://www.cplusplus.com/reference/string/string/swap-free/)
- [`compare`](http://www.cplusplus.com/reference/string/string/compare/)

# 代码

```
#include <stdio.h>
#include <string.h>
#include <iostream>
using namespace std;

int transHabb(string month)
{
    if (!month.compare("pop"))    return 1;
    else if (!month.compare("no"))   return 2;
    else if (!month.compare("zip"))   return 3;
    else if (!month.compare("zotz"))   return 4;
    else if (!month.compare("tzec"))   return 5;
    else if (!month.compare("xul"))   return 6;
    else if (!month.compare("yoxkin"))   return 7;
    else if (!month.compare("mol"))   return 8;
    else if (!month.compare("chen"))   return 9;
    else if (!month.compare("yax"))   return 10;
    else if (!month.compare("zac"))   return 11;
    else if (!month.compare("ceh"))   return 12;
    else if (!month.compare("mac"))   return 13;
    else if (!month.compare("kankin"))   return 14;
    else if (!month.compare("muan"))   return 15;
    else if (!month.compare("pax"))   return 16;
    else if (!month.compare("koyab"))   return 17;
    else if (!month.compare("cumhu"))   return 18;
    else return 19;

}

string transTzolkin(int day)
{
    if (day == 1)    return "imix";
    else if (day == 2)   return "ik";
    else if (day == 3)   return "akbal";
    else if (day == 4)   return "kan";
    else if (day == 5)   return "chicchan";
    else if (day == 6)   return "cimi";
    else if (day == 7)   return "manik";
    else if (day == 8)   return "lamat";
    else if (day == 9)   return "muluk";
    else if (day == 10)   return "ok";
    else if (day == 11)   return "chuen";
    else if (day == 12)   return "eb";
    else if (day == 13)   return "ben";
    else if (day == 14)   return "ix";
    else if (day == 15)   return "mem";
    else if (day == 16)   return "cib";
    else if (day == 17)   return "caban";
    else if (day == 18)   return "eznab";
    else if (day == 19)   return "canac";
    else   return "ahau";
}

int Habb(int day, string month, int year)
{
    return day + (transHabb(month) - 1) * 20 + year * 365;
}

int main()
{
    int n;
    cin >> n;
    cout << n << endl;
    while (n--)
    {
        int Tzolkinmonth = 0, Tzolkinyear = 0, Habbday = 0, Habbyear = 0, days = 0;
        string Tzolkinday = "\0", Habbmonth = "\0";
        scanf("%d. ", &Habbday);
        cin >> Habbmonth;
        scanf(" %d", &Habbyear);
        days = Habb(Habbday, Habbmonth, Habbyear);
        Tzolkinyear = days / 260;
        Tzolkinmonth = days % 260 % 13+1;
        Tzolkinday = transTzolkin(days % 260 % 20+1);
        cout << Tzolkinmonth << " " << Tzolkinday << " " << Tzolkinyear << endl;
    }
}

```

# 更新日志
- 2014年07月07日  已AC，文章BUG修正。