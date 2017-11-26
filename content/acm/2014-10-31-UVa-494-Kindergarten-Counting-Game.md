---
categories: Exercise
date: 2014-10-31T16:20:15Z
title: UVa 494 Kindergarten Counting Game
toc: true
url: /2014/10/31/UVa-494-Kindergarten-Counting-Game/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=435

# 理解
同样是一道很简单的题目。
只要求出给定的一句话中出现的单词的个数，有两个地方需要注意。
- 输入应当注意不能使用`scanf("%s", str)`这样的写法，会直接停在有空格的地方。采用getline是一个好主意，不过输入的效率会比较低，要是比较虚的话，可以用速度快一点的gets。
- 具体的单词判断上，我一开始犯了一个错误，认为只要判断空格的个数就OK了，实际上，`a_a`是两个单词。

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
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
#define ll long long int
using namespace std;

#define MAXN 1<<10

string a;
int ans=0,is=0;

int main(int argc, char const *argv[])
{
	while(getline(cin, a))
    {
        ans=0;is=0;
        for(int i=0;i<=a.length();i++)
        {
            if((a[i]>='A'&&a[i]<='Z')||(a[i]>='a'&&a[i]<='z'))
            {
                is=1;
            }
            else
            {
                ans+=is;
                is=0;
            }
        }
        printf("%d\n", ans+is);
    }
	return 0;
}

```

# 更新日志
- 2014年10月31日 已AC。