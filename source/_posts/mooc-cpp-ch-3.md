title: C++语言程序设计基础——第三章
date: 2015-4-12 15:16:07
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章还是介绍了很多自己原先忽略的东西的。
比如包含有可变参数列表的函数，内联函数，constexpr函数这些，当然啦，这次也彻底地了解了一下到底什么是函数重载，感觉还是比较有帮助的~

<!-- more -->

# 作业
**C3-1 直角三角形**
> 输入一个三角形的3边长度，判断该三角形是否为直角三角形，若是则输出True，若不是则输出False。
直接sort一下之后用直角三角形的性质判断一下即可~，并无坑点。
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
const int inf = 1<<31;
using namespace std;

int a[3];

int main(int argc, char const *argv[])
{
     while(~scanf("%d%d%d", &a[0],&a[1],&a[2]))
     {
          sort(a,a+3);
          if(a[0]*a[0]+a[1]*a[1]==a[2]*a[2])     cout<<"True"<<endl;
          else cout<<"False"<<endl;
     }
     return 0;
}
```

**C3-2 斐波那契数列 **
> 斐波那契数列f(n)满足以下定义：
> f(0) = 1, f(1) = 1, f(n) = f(n-1) + f(n-2) (n >= 2)。
> 请用递归的方法编写函数，对于给定的n，求出斐波那契数列的第n项f(n)
学递归嘛- -，肯定少不了斐波那契的出场了。直接一个记忆化搜索，感觉效率还是很不错的。
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
const int inf = 1<<31;
using namespace std;

const int MAXN = 100;
int a[MAXN],n;

int f(int n)
{
     if(a[n]!=-1)     return a[n];
     if(n==0||n==1)     return a[n]=1;
     else return a[n]=f(n-1)+f(n-2);
}

int main(int argc, char const *argv[])
{
     memset(a,-1,sizeof(a));
     while(~scanf("%d",&n))
     {
          cout<<f(n)<<endl;
     }
     return 0;
}
```
**C3-3 丑数**
> 只包含因子2,3,5的正整数被称作丑数，比如4,10,12都是丑数，而7,23,111则不是丑数，另外1也不是丑数。请编写一个函数，输入一个整数n，能够判断该整数是否为丑数，如果是，则输出True，否则输出False。
一开始小小的纠结了一下到底怎么写，后来想到了一种迭代的方法，每次循环都分别判断是否能被2，3，5整除，如果都不能被整除，则直接返回false，如果运行到值为1是，返回true。
一开始做不出来，因为想当然的觉得最后的结果应当是0，所以错了好久= =。
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

bool check(int n)
{
     int tmp = n;
     if(n==1)     return false;
     while (tmp != 1)
     {
          if (tmp % 2 == 0)     {tmp /= 2;}
          else if (tmp % 3 == 0)     {tmp /= 3;}
          else if (tmp % 5 == 0)     {tmp /= 5;}
          else return false;
     }
     return true;
}

int main(int argc, char const *argv[])
{
     while (cin >> n)
     {
          check(n) ? cout << "True\n" : cout << "False\n";
     }
     return 0;
}
```

**C3-4 斐波那契数列选做题**
> 斐波那契数列f(n)满足以下定义：
> f(0) = 1, f(1) = 1, f(n) = f(n-1) + f(n-2) (n >= 2)。
> 本题的数据规模比原先更大
看样例就能明白- -，这次的数据已经超过了int的范围，于是换成了long long int类型，搞定。
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
const int inf = 1<<31;
using namespace std;

const int MAXN = 100;
ll a[MAXN],n;

ll f(int n)
{
     if(a[n]!=-1)     return a[n];
     if(n==0||n==1)     return a[n]=1;
     else return a[n]=f(n-1)+f(n-2);
}

int main(int argc, char const *argv[])
{
     memset(a,-1,sizeof(a));
     while(~scanf("%lld",&n))
     {
          cout<<f(n)<<endl;
     }
     return 0;
}
```

# 更新日志
- 2015年04月12日 首次发布。