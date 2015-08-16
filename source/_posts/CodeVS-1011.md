title: CodeVS 1011 数的计算
date: 2014-11-1 10:39:19
tags: [ACM, CodeVS, C, 数论]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codevs.cn/problem/1011/

# 理解
题目的分类是递推，自然就往递推那个方向去想。
通过简单的推理可以发现，f[n]的值恰好等于f[1]~f[n/2]的和，之后的代码就比较简单了。

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

#define MAXN 1001

long long n,i,j,f[MAXN];

int main(int argc, char const *argv[])
{
    cin>>n;
    f[1]=1;
    for(i=2; i<=n; i++)
    {
        f[i]=1;
        for(j=1; j<=i/2; j++)
            f[i]+=f[j];
    }
    cout<<f[n]<<endl;
    return 0;
}
```
# 更新日志
- 2014年11月1日 已AC。