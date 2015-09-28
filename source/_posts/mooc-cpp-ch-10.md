title: C++语言程序设计进阶——第十章
date: 2015-7-13 17:01:39
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
涉及到STL的应用，不得不说STL确实挺强大的，我觉得我可以多研究研究STL的各种应用。

<!-- more -->

# 作业
## 单词计数
> 编写一个程序，从键盘输入一个个单词，每接收到一个单词后，输出该单词曾经出现过的次数，接收到“QUIT”单词后程序直接退出。

很简单的题，用map直接搞定。


```
cpp
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
    map<string, int> a;
    string str;
    while (cin >> str && str.compare("QUIT"))
    {
        cout << a[str]++ << endl;
    }
    return 0;
}

```

## 数组排序
> 输入n个数，对这n个数去重之后排序，并输出从小到大排序结果。

这道题涨的姿势有点多，学到了很多原来没有用到过的函数，以后再也不用手写去重啦~


```
cpp
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

bool cmp(int a, int  b)
{
    return a == b;
}

int main(int argc, char const *argv[])
{
    int n;
    int a[110];
    scanf("%d", &n);
    for (int i = 0; i < n; i++)    scanf("%d", &a[i]);
    vector<int> v(a, a + n);
    vector<int>::iterator it;
    sort(v.begin(), v.end());
    it = unique(v.begin(), v.end(), cmp);
    v.resize(distance(v.begin(), it));
    for (vector<int>::iterator it = v.begin(); it != v.end(); it++)
    {
        cout << *it << endl;
    }
    return 0;
}

```

## 字符串出现个数
> 给定一个串a和串b，求b在a中出现次数

我觉得我的实现并不是老师的意图，这样写有点蠢= =，感觉运行效率并没有提高。


```
cpp
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
    string a, b;
    cin >> a >> b;
    string str[100];
    for(int i=0;i<a.size()-b.size();i++)
    {
        str[i]+=a.substr(i,b.size());
    }
    int t = count(begin(str), end(str), b);
    cout << t << endl;
    return 0;
}

```

# 更新日志
- 2015年07月13日 赶deadline ing