title: POJ 1363 Rails
date: 2014-08-12 04:07:00
tags: [ACM, POJ, C/C++, STL, stack]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1363

# 理解
一列火车，每个车厢都有编号，都可以单独行使，然后有一个火车站，进去之后，头变成尾，尾变成头，问能不能以输入的顺序出站。使用了STL栈。

<!-- more -->

# 代码
```
{% raw %}
#include <cstdio>
#include <stack>
using namespace std;
const int maxn=1000+5;
int a[maxn];

int main(int argc, char const *argv[])
{
    int n,i,k;
    while(scanf("%d",&n)&&n)
    {
        stack<int>s;
        while(scanf("%d",&a[0])&&a[0])
        {
            for(i=1;i<n;i++)
                scanf("%d",&a[i]);
            for(i=1,k=0;i<=n;i++)
            {
                s.push(i);
                while(s.top()==a[k])
                {
                    if(!s.empty()) s.pop();
                    k++;
                    if(s.empty()) break;
                }
            }
            if(k==n) printf("Yes\n");
           else printf("No\n");
        }
        printf("\n");
    }
    return 0;
}

{% endraw %}
```
	
# 更新日志
- 2014年08月12日 已AC。