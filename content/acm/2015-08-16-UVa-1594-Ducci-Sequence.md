---
categories: Exercise
date: 2015-08-16T04:04:26Z
title: UVa 1594 Ducci Sequence
toc: true
url: /2015/08/16/UVa-1594-Ducci-Sequence/
---

## 题目
源地址：

https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4469

# 理解
## 题意分析
题意十分简单，给定一个序列的变换，每一次都把当前位置上的数变为当前位置与下一个位置差的绝对值。然后问你这个序列最后是变成一个循环还是全都变为0。
## 暴力做法
一开始看题目的时候感觉很难下手，不知道应该怎样去判断这个序列能否构成一个循环。但是注意到另外一个条件——题目中给出了最大的循环次数，1000次。再加上n的值比较小，也就是说，我完全可以暴力模拟一千次，如果还是没有全为0的串的话，这个串一定是一个循环的串。基于这种想法，我可以得到一个非常简单的暴力算法。
## Floyd判圈算法
### 概述
这道题已经AC了，但是问题并没有结束。回到我最一开始的想法——我该如何判断一个序列是否构成了循环呢？这样，我们就引出了一个算法：[Floyd判圈算法](https://zh.wikipedia.org/zh/Floyd%E5%88%A4%E5%9C%88%E7%AE%97%E6%B3%95)。是的，这个Floyd就是那个最短路算法的发明者。
这个算法可以在有限状态机，迭代函数或者链表上判断是否存在环，并求出该环的起点和长度的算法。

<!--more-->

### 介绍
下面请允许我引用维基百科上对于该算法的介绍：
>
如果有限状态机、迭代函数或者链表上存在环，那么在某个环上以不同速度前进的2个指针必定会在某个时刻相遇。同时显然地，如果从同一个起点(即使这个起点不在某个环上)同时开始以不同速度前进的2个指针最终相遇，那么可以判定存在一个环，且可以求出2者相遇处所在的环的起点与长度。

### 实现
如果有限状态机、迭代函数或者链表存在环，那么一定存在一个起点可以到达某个环的某处(这个起点也可以在某个环上)。

初始状态下，假设已知某个起点节点为节点S。现设两个指针t和h，将它们均指向S。

接着，同时让t和h往前推进，但是二者的速度不同：t每前进1步，h前进2步。只要二者都可以前进而且没有相遇，就如此保持二者的推进。当h无法前进，即到达某个没有后继的节点时，就可以确定从S出发不会遇到环。反之当t与h再次相遇时，就可以确定从S出发一定会进入某个环，设其为环C。

如果确定了存在某个环，就可以求此环的起点与长度。

上述算法刚判断出存在环C时，显然t和h位于同一节点，设其为节点M。显然，仅需令h不动，而t不断推进，最终又会返回节点M，统计这一次t推进的步数，显然这就是环C的长度。

为了求出环C的起点，只要令h仍均位于节点M，而令t返回起点节点S。随后，同时让t和h往前推进，且保持二者的速度相同：t每前进1步，h前进1步。持续该过程直至t与h再一次相遇，设此次相遇时位于同一节点P，则节点P即为从节点S出发所到达的环C的第一个节点，即环C的一个起点。

### 伪代码

```
t := &S
h := &S                 //令指针t和h均指向起点节点S。
repeat
  t := t->next
  h := h->next
  if h is not NULL      //要注意这一判断一般不能省略
       h := h->next
until t = h or h = NULL
if h != NULL            //如果存在环的话
   n := 0
   repeat               //求环的长度
       t := t->next
       n := n+1
   until t = h
   t := &S              //求环的一个起点
   while t != h
         t := t->next
         h := h->next
   P := *t

```

### 本题应用
具体到本题中，我只需要将输入的数据分别存入两个数组a和b，然后让a每次操作一次，让b每次操作两次。这样就使得a和b有了不一样的速度，然后每次都进行判断，根据前面讲解的算法，只要a和b相等，那就意味着这个数组一定是循环的。然后再处理一下均为0的情况，这道题的Floyd判圈算法的版本就出来了。

### 速度更快的Brent判圈算法
在维基百科的条目中还提到了一个比Floyd判断算法快36%的Brent判圈算法，不过目前貌似资料不足，所以这个部分就暂时按下不表了。

# 代码
## 暴力算法

```
const int maxn = 100;

int t,n,a[maxn],b[maxn];

bool judge()
{
    for(int i=1; i<=n; ++i)
    {
        if(a[i]!=0) return false;
    }
    return true;
}

void next()
{
    for(int i=1; i<=n; ++i)
    {
        b[i]=abs(a[i]-a[i+1]);
    }
    for(int i=1; i<=n; ++i)
    {
        a[i]=b[i];
    }
    a[n+1]=a[1];
}

bool ans;

int main()
{
    scanf("%d",&t);
    while(t--)
    {
        ans = false;
        scanf("%d", &n);
        for(int i=1; i<=n; ++i)   scanf("%d", &a[i]);
        a[0]=a[n];
        a[n+1]=a[1];
        for(int k=1; k<=1000; ++k)
        {
            if(judge())
            {
                ans=true;
                break;
            }
            else
            {
                next();
            }
        }
        if(!ans) printf("LOOP\n");
        else printf("ZERO\n");
    }
}

```

## Floyd判圈算法

```
const int maxn = 100;
int t,n,a[maxn];
int b[maxn],c[maxn]= {0};

void next(int a[])
{
    for(int i=1; i<=n; ++i)
    {
        a[i]=abs(a[i]-a[i+1]);
    }
    a[n+1]=a[1];
}

bool equal(int a[], int b[])
{
    for(int i=1; i<=n; ++i)
    {
        if(a[i]!=b[i])  return false;
    }
    return true;
}

int main()
{
    scanf("%d", &t);
    while(t--)
    {
        scanf("%d", &n);
        for(int i=1; i<=n; ++i)
        {
            scanf("%d", &a[i]);
            b[i]=a[i];
        }
        a[n+1]=b[n+1]=a[1];
        bool loop =true;
        for(int i=0; i<1010; ++i)
        {
            next(a);
            next(b);
            next(b);
            if(equal(a,c))
            {
                loop = false;
                break;
            }
            if(equal(a,b))
            {
                loop = true;
                break;
            }
            if(equal(b,c))
            {
                loop = false;
                break;
            }
        }
        if(loop)    printf("LOOP\n");
        else printf("ZERO\n");
    }
}

```

# 更新日志
- 2015年08月16日 本题已经用两种方法AC