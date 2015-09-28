title: C++语言程序设计基础——第二章
date: 2015-4-12 15:07:48
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
**第二章：C++简单程序设计**
还是一些比较基础的语法，重新温习了一遍。

<!-- more -->

# 作业
**C2-1 简单题目**
> 任意给定n个整数，求这n个整数序列的和、最小值、最大值

还是比较简单的- -，一边读取一边处理，没有什么坑点。

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
#define ll long long int
const double pi = acos(-1.0);
const double eps = (1e-8);
const int inf = 1<<20;
using namespace std;

const int MAXN = 100+10;

int n,a;
int sum=0,Max=-1*inf,Min=inf;

void init()
{
     scanf("%d", &n);
}

int main(int argc, char const *argv[])
{
     init();
     for(int i=0;i<n;i++)
     {
          scanf("%d",&a);
          Max=max(a,Max);
          Min=min(a,Min);
          sum+=a;
     }
     cout<<sum<<" "<<Min<<" "<<Max;
     return 0;
}

```

**C2-2 进制转换**
> 已知一个只包含0和1的二进制数，长度不大于10，将其转换为十进制并输出。

一开始想偷懒- -，研究了一下sprintf和itoa之类的玩意儿，发现并不能满足我的需求。所以还是自己手写了一发，后来发现，其实手写也没有特别复杂。

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
#define ll long long int
const double pi = acos(-1.0);
const double eps = (1e-8);
const int inf = 1 << 31;
using namespace std;

const int MAXN = 10 + 10;

char a[MAXN];
int ans=0;

void init()
{
     scanf("%s", a);
}

int main(int argc, char const *argv[])
{
     init();
     int len=strlen(a);
     for(int i=0;i<len;i++)
     {
          ans=ans*2+a[i]-'0';
     }
     cout<<ans;
     return 0;
}

```

**C2-3  实心菱形**
> 打印n阶实心菱形

当然啦- -，比较常见的模拟题，只要注意下整个图形变化的规律就可以轻松搞定。

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
#define ll long long int
const double pi = acos(-1.0);
const double eps = (1e-8);
const int inf = 1 << 31;
using namespace std;

int n;

void init()
{
     scanf("%d", &n);
}

int main(int argc, char const *argv[])
{
     init();
     for (int i = 1; i < n; i++)
     {
          for (int j = 0; j < n - i; j++)     cout << " ";
          for (int j = 0; j < 2 * i - 1; j++)     cout << "*";
          cout << endl;
     }
     for (int i = 0; i < 2 * n - 1; i++)     cout << "*";
     cout << endl;
     for (int i = 1; i < n; i++)
     {
          for (int j = 0; j < i; j++)     cout << " ";
          for (int j = 0; j < 2 * (n - i) - 1; j++)     cout << "*";
          cout << endl;
     }
     return 0;
}

```

# 更新日志
- 2015年04月12日 不按照周次来了，直接整章整理~