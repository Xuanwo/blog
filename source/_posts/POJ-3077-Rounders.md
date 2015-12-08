---
title: POJ 3077 Rounders
date: 2014-08-22 17:52:36
tags: [ACM, POJ, Java, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=3077

# 理解
咦，居然又碰到一道高精度的题目，Java水过。

<!-- more -->

# 代码

```
import java.math.BigInteger;
import java.util.*;

public class Main {

    public static void main(String args[]) {
        int n, s, i;
        Scanner cin = new Scanner( System.in );
        n = cin.nextInt();
        while ( n-- != 0 ) {
            s = cin.nextInt();
            for ( i = 10; i <= 100000000; i *= 10 )
                if ( s >= i ) {
                    s = (s + i / 2) / i * i;
                }
            System.out.println( s );
        }
        return;
    }
}

```

# 更新日志
- 2014年08月22日 已AC。