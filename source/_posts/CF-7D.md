title: Codeforces Beta Round 7 D Palindrome Degree
date: 2014-11-16 11:29:22
tags: [ACM, Codeforces, C, DP, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/7/D

# 理解
被引入的新概念吓到了= =，其实这道题就是一个求最大回文串的问题。
不过按照这个数据量，每一次都进行strcmp肯定不现实，所以我们需要一个好的字符串hash（的板子）。预处理之后，分别计算前缀和后缀的hash值。如果hash值相等，说明前缀和后缀相同，它们的度数就是长度/2再加上一。然后结果就是度数的和。

>
字符串hash的时候那个素数开大一点比较好，不用去处理hash冲突，23333。

<!-- more -->

# 代码

```

#define MAXN 5000000+10
#define MOD  1000000007
#define BIG  10000009

char a[MAXN];
ll n,l[MAXN],r[MAXN],dp[MAXN];
ll i,j,len;
ll ans = 0;

void init()
{
    scanf("%s", a);
    dp[0]=0;
    for(i=0; a[i]; i++)
    {
        if('0'<=a[i]&&a[i]<='9')
            a[i] = a[i]-'0';
        else if('a'<=a[i]&&a[i]<='z')
            a[i] = a[i]-'a'+10;
        else
            a[i] = a[i]-'A'+36;
    }
}

int main(int argc, char const *argv[])
{
    init();
    len = i;
    l[0] = 0;
    ll tmp = 1;
    for(i=1; i<=len; i++)
    {
        l[i] = (l[i-1]+a[i-1]*tmp)%MOD;
        tmp = (tmp*BIG)%MOD;
    }

    r[len+1] = 0;
    for(i=1; i<=len; i++)
    {
        r[i] = (r[i-1]*BIG+a[i-1])%MOD;
    }

    ans=0;
    for(i=1; i<=len; i++)
    {
        if(l[i]==r[i])
        {
            dp[i] = dp[i>>1]+1;
            ans += dp[i];
        }
    }
    cout<<ans<<endl;
    return 0;
}

```

# 更新日志
- 2014年11月16日 已AC。