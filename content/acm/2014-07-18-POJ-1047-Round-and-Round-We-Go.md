---
categories: Code
date: 2014-07-18T17:38:41Z
title: POJ 1047 Round and Round We Go
toc: true
url: /2014/07/18/POJ-1047-Round-and-Round-We-Go/
---

## 题目
源地址：

http://poj.org/problem?id=1047

# 理解
一开始觉得很麻烦，打算用字符串+排序来处理是否符合题意。但是无意中发现，事实上当一个数是循环数的时候，这个数本身乘以它的长度+1恰好使得每一位上的数都是9，比如`142857*(6+1)=999999`。发现了这一点，题目就变成一道水题了。用java的高精度类水掉即可～

<!--more-->

# 新技能get
循环数的性质
>
1. 乘以产生一个循环数的质数时，结果会是一系列的9.如 142857 × 7 = 999999。
2. 如果将其按位划分成若干等长份并加在一起，结果会是一系列的9.这是Midy定理的特殊情况。如14 + 28 + 57 = 99 142 + 857 = 999 1428 + 5714+ 2857 = 9999
3. 所有的循环数都是9的倍数。

# 代码

```
import java.util.*;
import java.math.*;

public class Main {
    public static void main(String[] args) {
        Scanner cin  = new Scanner(System.in);
        BigInteger b, c, d;
        String str, str1, str2, str3;
        int i, len;
        while (cin.hasNext()) {
            str = cin.next();
            b = new BigInteger(str);
            len = str.length() + 1;
            char []kids = new char[len - 1];
            for (i = 0; i < len - 1; i++)
                kids[i] = '9';
            str3 = new String(kids);
            str1 = String.valueOf(len);
            c = new BigInteger(str1);
            d = b.multiply(c);
            str2 = d.toString();
            if (str2.compareTo(str3) == 0)
                System.out.println(str + " " + "is cyclic");
            else
                System.out.println(str + " " + "is not cyclic");
        }
    }
}

```

# 更新日志
- 2014年07月18日 已AC。