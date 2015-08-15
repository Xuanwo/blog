title: CodeVS 1083 Cantor表
date: 2014-10-29 21:05:44
tags: [ACM, CodeVS, C, 数论]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codevs.cn/problem/1083/

# 理解
一道基础题，但是我在如何建立模型上面想了很久。
事实上，我们可以按照斜线分类，第1条斜线有1个数，第2条有2个数，以此类推，第i条有i个数。这样，我们可以很轻松的知道，前i条共有S(i)=1/2*i*(i+1)个数。由方程n<=S(k)，我们可以求出n所在的斜线的位置，也就是floor(sqrt(8.0*n+1)-1)/2。
本来在小白书上面，这个问题已经被解决了，但是CodeVS上面的这道题采用了不同的排列规则。通过观察可以发现，这个规则和斜线数k的奇偶性有关。只要进行一次简单的判断就可以让结果按照需要的规则进行排列了。

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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<28)
#define ll long long int
using namespace std;

int main(int argc, char const *argv[])
{
    int n;
    while(~scanf("%d", &n))
    {
        int k=(int)floor((sqrt(8.0*n+1)-1)/2-(1e-9))+1;
        int s=k*(k+1)/2;
        if(k%2==0)
            printf("%d/%d\n", k-s+n,s-n+1);
        else
            printf("%d/%d\n", s-n+1,k-s+n);
    }
    return 0;
}
```

# 更新日志
- 2014年10月29日 已AC。