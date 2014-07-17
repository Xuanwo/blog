title: POJ 2800 Joseph's Problem
date: 2014-07-15 20:41:42
tags: [ACM, POJ, C/C++, 简单计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2800

# 理解
抱着侥幸心理使用了一般的方法来求，果然TLE了。然后开始计算∑1<=i<=n(k mod i)。由分析之，总共有三种情况，k<n，k=n，k>n。分别寻找规律并转化为等差数列简化运算。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <math.h>
using namespace  std;

long long jos( long long n , long long k )
{
    long long sum = 0 , a = ( long long  )  sqrt ( k ), b = k / a , i ;
    if ( n > k ) sum += ( n - k ) * k ;
    for ( i = a ; i > 1 ; i -- )
    {
        long long s = k / i , e = k / ( i - 1 ) ;
        if ( s > n ) break ;
        if ( e > n ) e = n ;
        sum += ( k % e + k % ( s + 1 ) ) * ( e - s ) / 2 ;
    }
    for ( i = 1 ; i <= n && i <= b ; i ++ ) sum += k % i ;
    return sum ;
}

int main(int argc, char const *argv[])
{
    long long n , k ;
    while ( scanf ( "%I64d%I64d", &n, &k ) != EOF )
        printf ( "%I64d\n" , jos(n, k) ) ;
    return 0 ;
}
```

# 更新日志
- 2014年07月15日 已AC。