title: C++语言程序设计进阶——第六章
date: 2015-6-13 00:52:39
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
数组，指针，字符串。都是很常用的东西，并没有仔细看。事实上，老师也没有多讲什么，除了一个智能指针。

<!-- more -->

# 作业
## 最大子数组和
> 给定一个数组a[0,...,n-1],求其最大子数组(长度>=1)和

就是一个简单的最大序列和- -，比较简单的DP就能搞定。

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
#define debug puts("-----")

typedef long long int ll;
const double pi = acos(-1.0);
const double eps = 1e-8;
const int inf = 0x3f3f3f3f;
const ll INF = 0x3f3f3f3f3f3f3f3fLL;
using namespace std;

const int MAXN = 5000 + 10;
int n;
int a[MAXN];
int ans = 0, tmp = 0;
int main()
{
    scanf("%d", &n);
    for (int i = 0; i < n; i++)    scanf("%d", &a[i]);
    tmp = a[0];
    for (int i = 1; i < n; i++)
    {
        if (tmp > 0) tmp += a[i];
        else
        {
            tmp = a[i];
        }
        ans = max(ans, tmp);
    }
    cout << ans;
    return 0;
}
```

## 字符串的回文子序列个数
> 求一个长度不超过15的字符串的回文子序列个数（子序列长度>=1）。

这道题还是比较蛋疼的- -，向来不会处理这种字符串问题的我，花了很久时间才搞定。
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
#define debug puts("-----")

typedef long long int ll;
const double pi = acos(-1.0);
const double eps = 1e-8;
const int inf = 0x3f3f3f3f;
const ll INF = 0x3f3f3f3f3f3f3f3fLL;
using namespace std;

int getCount(const vector<vector<int> > &dpCount, int a, int b, int sz)
{
    int count = 0;
    for (int i = a; i < sz; ++i)
    {
        for (int j = i; j <= b; ++j)
        {
            count += dpCount[i][j];
        }
    }
    return count;
}

int dp(const string &s)
{
    int sz = s.size();
    vector<vector<int> > dpCount(sz, vector<int>(sz, 0));
    for (int i = 0; i < sz; i++)
    {
        dpCount[i][i] = 1;
    }

    for(int i = 1; i < sz; i++)
    {
        int tmp = 0;
        for(int j = 0; j + i < sz; j++)
        {
            if(s[j] == s[j + i])
            {
                dpCount[j][j + i] = getCount(dpCount, j + 1, j + i - 1, sz) + 1;
            }
        }
    }

    return getCount(dpCount, 0, sz - 1, sz);
}

int main(int argc, char const *argv[])
{

        string s;
        cin >> s;
        cout <<dp(s);
    return 0;
}
```

## 数组第K小数
> 给定一个整数数组a[0,...,n-1]，求数组中第k小数

我怀疑是不是我没有get到老师想要考察的东西- -，sort随手做啊，为何放在第三题？

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
#define debug puts("-----")

typedef long long int ll;
const double pi = acos(-1.0);
const double eps = 1e-8;
const int inf = 0x3f3f3f3f;
const ll INF = 0x3f3f3f3f3f3f3f3fLL;
using namespace std;

const int MAXN = 5000 + 10;

int n, k;
int a[MAXN];

int main()
{
    scanf("%d%d", &n, &k);
    for (int i = 0; i < n; i++)    scanf("%d", &a[i]);
    sort(a, a + n);
    cout << a[k - 1];
    return 0;
}
```

## 最大子数组和（加强版）
> 给定一个数组a[0,...,n-1],求其最大子数组(长度>=1)和

加强也就是增加了n的大小，DP做法完全可以搞定，改了一下MAXN的大小就能过。

# 更新日志
- 2015年06月13日 强行赶Deadline。