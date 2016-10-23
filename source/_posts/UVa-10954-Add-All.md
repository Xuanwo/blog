---
title: UVa 10954 Add All
date: 2014-11-5 20:06:21
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1895

# 理解
很明显的一道水题，不过我WA了一发。
我一开始觉得，我可以把每个数重复计算的次数加进去，然后很快写完了一个程序，但是报了WA。稍微查了一会儿之后，感觉没有什么问题，又因为很多人过了，于是推倒用优先队列重新写了一发。

<!-- more -->

# 代码

## WA代码（求测试数据）

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

#define MAXN 5000+10

int n,a[MAXN];
ll ans;

int main(int argc, char const *argv[])
{
	while(~scanf("%d", &n),n)
    {
        ans=0;
        for(int i=0;i<n;i++)
        {
            scanf("%d", &a[i]);
        }
        sort(a,a+n);
        for(int i=0;i<n;i++)
        {
            ans+=(n-i)*a[i];
        }
        printf("%lld\n", ans-a[0]);
    }
	return 0;
}

```

## AC代码

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

int n;
int total, cost ;

int main(int argc, char const *argv[])
{
    while (scanf("%d", &n), n)
    {
        total = 0, cost = 0;
        priority_queue<int, vector<int>, greater<int> > q;
        while (n--)
        {
            int x;
            scanf("%d", &x);
            q.push(x);
        }
        while (q.size() > 1)
        {
            total = q.top();
            q.pop();
            total += q.top();
            q.pop();
            cost += total;
            q.push(total);
        }
        printf("%d\n", cost);
    }

    return 0;
}

```

# 更新日志
- 2014年11月5日 已AC。