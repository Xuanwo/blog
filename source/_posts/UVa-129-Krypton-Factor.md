---
title: UVa 129 Krypton Factor
date: 2014-11-2 14:52:47
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=3&page=show_problem&problem=65

# 理解
题意不是很好懂= =，我搬运一下翻译。

>
Problem
“超级氪因素大赛”(译注：英国的一档电视心智竞答节目）的主办方雇你来对付那些足智多谋的参赛选手。在比赛的一个环节中，节目主持人将念出一长串的字母来考验选手的记忆能力。因为许多选手都是分析字串模式的高手，为了增加一些比赛的难度，主办方决定不再使用那些含有特定重复子串的字串。但是他们又不能将所有重复的子串都删掉，如果那样的话字串中就不存在两个相同的单字了，这反倒会让问题变的非常简单。为了解决这一问题，他们决定仅删除那些包含相邻重复子串的字串。我们将存在上述相邻重复情况的字串称为“easy”（简单），否则称为“hard”（难）。

>
Input and Output
为了能给节目主持人提供无限量的问题字串，要求你来写一个程序执行生成运算。程序从输入中读取多行数据，每行包括两个整数n和L（即按此顺序给出），其中n > 0，L的范围是1 ≤ L ≤ 26。根据这些输入，程序要按照字母表升序打印出第n个“hard”字串（由字母表中的前L个字母构成），并在接下来的一行打印这个串的长度。按照上述规则，第一个串应该是“A”。对于给定的n和L，你可以认为第n个“hard”串是一定存在的。
比方说，当L = 3时，头7个“hard”字串为：
A
AB
ABA
ABAC
ABACA
ABACAB
ABACABA
字串可能很长，因此要将它们分成4个字为一组，中间用空格隔开。如果超过16组，则换一行，再接着输出第17组。
ABAC ABA
7
输入由一行两个零表示结束。你的程序可以限定最大的字串长度为80。

回溯搜索，还用到了string的一些比较方便的函数。

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
#define ll long long int
using namespace std;

void Sequence(string &str, int &n, int L)
{
    int nLen = str.length(), nHalf = (str.length() + 1) / 2;
    for (char i = 'A', iEnd = L + 'A', m = 1; i < iEnd; ++i)
    {
        str.push_back(i);
        for (m = 1; m <= nHalf; ++m)
        {
            if (equal(str.end() - m, str.end(), str.end() - m * 2))
            {
                m = 0;
                break;
            }
        }
        if (m != 0)
        {
            if (--n == 0) return;
            Sequence(str, n, L);
            if (n == 0) return;
        }
        str.erase(nLen);
    }
}

int main(int argc, char const *argv[])
{
    for (int n, L; cin >> n >> L && n != 0; )
    {
        string str;
        Sequence(str, n, L);
        int nLen = str.length();
        for (size_t i = 4; i < str.length(); i += 5)
        {
            str.insert(str.begin() + i, i == 79 ? '\n' : ' ');
        }
        cout << str << '\n' << nLen << endl;
    }
    return 0;
}

```

# 更新日志
- 2014年11月2日 已AC。