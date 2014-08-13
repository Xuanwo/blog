title: POJ 1488 TEX Quotes
date: 2014-08-12 04:51:00
tags: [ACM, POJ, C/C++, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1488

# 理解
字符串处理- -，慢慢坑就是了。。注意输入方式，有空格的时候要用getline。

<!-- more -->

# 代码
```
{% raw %}
#include<iostream>
#include<string>
using namespace std;

int main(int argc, char const *argv[])
{
    string a ;
    int count = 0;
    while (getline(cin, a))
    {
        for (int i = 0; i < a.length(); i++)
        {
            if (a[i] == '\"')
            {
                if (count == 0)
                {
                    cout << "``";
                    count = 1;
                }
                else
                {
                    count = 0;
                    cout << "''";
                }
            }
            else cout << a[i];
        }
        cout << endl;
    }
}
{% endraw %}
```
	
# 更新日志
- 2014年08月12日 已AC。