title: Codeforces Beta Round 14 B Young Photographer (Div. 2)
date: 2014-11-21 21:56:23
tags: [ACM, Codeforces, C, 贪心]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/14/B

# 理解
一个摄影师要拍摄运动员比赛的照片，然后给定摄影师的坐标，以及每一位运动员的活动范围。要求计算出摄影是需要活动的最小步数。
首先我们需要对输入的数据进行一次处理，也就是必须保证左端比右段小。处理完毕之后，两端分别进行sort，这样就得到了运动员活动范围的起点和终点的有序列。显然，只有当最大的起点比最小的终点还小的时候，摄影师才有可能同时看到。然后，如果当前摄影师的坐标比最大的起点小，他只要移动到最大起点即可；如果当前摄影师的坐标比最小的终点大，他就需要移动到最小终点。
这样，我们就得到了摄影师需要移动的距离。

<!-- more -->

# 代码

```

#define MAXN 1000+10

int a[MAXN],b[MAXN];
int n,i,j,x;

void init()
{
    scanf("%d%d",&n,&x);
    for(i=0; i<n; i++)
    {
        scanf("%d%d",&a[i],&b[i]);
        if(a[i]>b[i])
        {
            j=a[i];
            a[i]=b[i];
            b[i]=j;
        }
    }
    sort(a,a+n);
    sort(b,b+n);
}

int main(int argc, char const *argv[])
{
    init();
    if(a[n-1]<=b[0])
    {
        if(x<a[n-1])
            printf("%d\n",a[n-1]-x);
        else if(x>b[0])
            printf("%d\n",x-b[0]);
        else puts("0");
    }
    else
        puts("-1");
    return 0;
}

```

# 更新日志
- 2014年11月21日 已AC。