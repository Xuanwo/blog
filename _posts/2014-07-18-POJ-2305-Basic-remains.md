---
layout: post
title: POJ 2305 Basic remains
date: 2014-07-18 14:46:10
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2305

# 理解
高精度计算题啊，用Java的高精度类水过。

<!-- more -->

# 代码

```
import java.math.BigInteger;
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNext()) {
            int n = scanner.nextInt();
            if (n == 0)
                break;
            BigInteger aBigInteger = scanner.nextBigInteger();
            BigInteger bBigInteger = scanner.nextBigInteger();
            BigInteger a = new BigInteger(aBigInteger.toString(), n);
            BigInteger b = new BigInteger(bBigInteger.toString(), n);
            BigInteger cBigInteger = a.divide(b);
            BigInteger mBigInteger = a.subtract(cBigInteger.multiply(b));
            System.out.println(mBigInteger.toString(n));
        }
    }
}

```

# 更新日志
- 2014年07月18日 已AC。