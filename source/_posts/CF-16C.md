title: Codeforces Beta Round 16 C Monitor (Div. 2 Only)
date: 2014-11-26 14:04:11
tags: [ACM, Codeforces, C, 数论]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/16/C

# 理解
一道关于分辨率转化的问题。要求将一个大分辨率按照指定的宽高比进行转化，如果宽高比不符，则进行切割。首先，我们来求一个x和y的最大公约数d，然后分别令x=x/d，y=y/d，这样就得到了x和y之间最简的比例形式。然后a和b分别去除以x和y，得到的两个背书中去掉小数部分较小的那个，就是切割之后的倍数比。最后得到的结果就是符合要求的结果。

<!-- more -->

# 代码

```

ll a,b,x,y;
ll d,t1,t2;

void init()
{
    scanf("%I64d%I64d%I64d%I64d", &a, &b, &x, &y);
}

ll gcd(ll a, ll b)
{
    return b ? gcd(b, a%b) : a;
}

int main(int argc, char const *argv[])
{
    init();
    d = gcd(x, y);
    x = x / d, y = y / d;
    t1 = a / x;
    t2 = b / y;
    t1 = min(t1, t2);
    cout<<x*t1<<" "<<y*t1<<endl;
    return 0;
}

```

# 更新日志
- 2014年11月26日 已AC。