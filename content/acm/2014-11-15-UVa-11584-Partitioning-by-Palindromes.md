---
categories: Exercise
date: 2014-11-15T11:33:53Z
title: UVa 11584 Partitioning by Palindromes
toc: true
url: /2014/11/15/UVa-11584-Partitioning-by-Palindromes/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=465&page=show_problem&problem=2631

# 理解
原谅我是一个乐盲，看到乐谱就吓出翔，不敢看了= =。
实际上，题意很简单，就是将一个字符串分割为尽量少的串，使得每一个串都是回文串。
一个简单的DP递推。


<!--more-->

# 代码

```

#define MAXN 1000+10

char str[MAXN];
int dp[MAXN];
int t;

bool isPalind(int l, int r)
{
    while(l<r)
    {
        if(str[l] != str[r]) return false;
        ++l;
        --r;
    }
    return true;
}

int main(int argc, char const *argv[])
{
    scanf("%d", &t);
    while(t--)
    {
        scanf("%s", str+1);
        int len = strlen(str+1);
        memset(dp, 0, sizeof(int)*len);
        for(int i=1; i<=len; ++i)
        {
            dp[i] = i+1;
            for(int j=1; j<=i; ++j)
            {
                if(isPalind(j, i))
                {
                    dp[i] = min(dp[i], dp[j-1]+1);
                }
            }
        }
        printf("%d\n", dp[len]);
    }
    return 0;
}

```

# 更新日志
- 2014年11月15日 已AC。