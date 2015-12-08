---
title: Codeforces Beta Round 4 A Watermelon
date: 2014-11-3 11:23:56
tags: [ACM, Codeforces, C, 水题]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/contest/4/problem/A

# 理解
真不愧是过了1W+的题= =，水的真可怕。
唯一的trick是当w等于2的时候，不能分成两个偶数。

<!-- more -->

# 代码

```

int w;

int main(int argc, char const *argv[])
{
    scanf("%d", &w);
	if(w==2)
        printf("NO\n");
    else
    {
        if(w%2==0)
            printf("YES\n");
        else
            printf("NO\n");
    }
	return 0;
}

```

# 更新日志
- 2014年11月3日 已AC。