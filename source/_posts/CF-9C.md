title: Codeforces Beta Round 9 C Hexadecimal's Numbers (Div.2 Only)
date: 2014-11-16 11:05:48
tags: [ACM, Codeforces, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/9/C

# 理解
题意不难理解。给定一个n，要你求出从0到n有多少个仅用0和1能表示出来的数。
想法很简单，我们先来处理最为简化的情况，如果给定一个二进制数，我们要求出比这个小的二进制数的个数有多少。小脑一动，我们就能知道，这个个数就是这个二进制数转化为十进制数的大小。
那么问题来了，给定一个十进制数，我们怎样才能求出这个最大的二进制数呢？其实我们可以这样来处理：每一位都有三种情况，0或者1或者大于1。0和1不需要进行任何操作，如果大于1，我们则把从这一位起的每一位都变成1。这样处理之后，我们就得到了最大的二进制数。然后就是一个简单的进制转换问题。

>
其实当天晚上的BestCoder 18的1003题跟这个有点像，不过做BC的时候，我没有捋清楚思路，最后还是没有敲出来。不过多亏被虐了一发，这道题才顺利地推出了结论。


<!-- more -->

# 代码

```

char n[10];
ll a[10],len;
ll ans=0;

int main(int argc, char const *argv[])
{
	scanf("%s", n);
	len=strlen(n);
	for(int i=0;i<len;i++)
    {
        a[i]=n[i]-'0';
    }
    for(int i=0;i<len;i++)
    {
        if(a[i]>1)
        {
            for(int j=i;j<len;j++)
            {
                a[j]=1;
            }
        }
    }
    for(int i=0;i<len;i++)
    {
        ans+=a[len-i-1]*(ll)pow(2,i);
    }
    printf("%I64d\n", ans);
	return 0;
}

```

# 更新日志
- 2014年11月16日 已AC。