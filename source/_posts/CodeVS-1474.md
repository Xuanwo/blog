title: CodeVS 1474 十进制转m进制
date: 2014-10-20 20:18:02
tags: [ACM, CodeVS, C, 数论]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codevs.cn/problem/1474/

# 理解
一开始就看到了下面的提示——可以使用反向取余法，然后就去百度了一下，结果没有发现什么有用的东西- -，然后坑爹的麦当劳的网络又一直连不上GoAgent，直接导致谷歌也上不去，然后就只能靠自己YY反向取余法到底是个什么玩意儿了。
题目自然是十分简单，给的数也不大，n<=100，暴力一点也是OK的。然后就联想到了计算机导论课上老师讲的进制转换的知识点。只要不停地使用n去除以m，余数作为当前位置上的数，商作为下一次运算的n参与循环。直到`n<m`的时候停止。
不过有一个地方需要注意的是，通过这种方法求出来的char数组和答案正好是逆序的，需要将它转换过来。我记得学长有个奇特的技巧可以将字符串逆序输出= =，不过现在条件受限，自己写一个for循环吧。

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

#define MAXN 16

int n,m;

char num[MAXN]={'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
char str[MAXN],ans[MAXN];

void init()
{
    memset(str,0,sizeof(str));
    memset(ans,0,sizeof(ans));
    scanf("%d%d", &n,&m);
}

void solve(int n,int m)
{
    int i=0,tmp=n;
    while(tmp/m!=0)
    {
        str[i++]=num[tmp%m];
        tmp=tmp/m;
    }
    str[i]=tmp%m+'0';
    int len = strlen(str);
    for(int j=0;j<len;j++)
    {
        ans[j]=str[len-j-1];
    }
    ans[len]='\0';
}

int main(int argc, char const *argv[])
{
	init();
	solve(n,m);
	printf("%s\n", ans);
	return 0;
}
```
# 更新日志
- 2014年10月20日 已AC。