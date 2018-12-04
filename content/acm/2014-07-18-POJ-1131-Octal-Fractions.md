---
categories: Code
date: 2014-07-18T15:29:12Z
title: POJ 1131 Octal Fractions
toc: true
url: /2014/07/18/POJ-1131-Octal-Fractions/
---

## 题目
源地址：

http://poj.org/problem?id=1131

# 理解
题意挺简单，就是把八进制浮点数转化为十进制，同样是用高精度类，叠乘即可～

<!--more-->

# 代码

```
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner cin = new Scanner(System.in);
        String str, ors;
        BigDecimal x, y, z;
        while (cin.hasNext()) {
            ors = cin.next();
            str = ors.substring(ors.indexOf(".") + 1, ors.length());
            z = new BigDecimal(0);
            y = new BigDecimal(1);
            for (int i = 0; i < str.length(); i++) {
                x = new BigDecimal(str.charAt(i) - '0');
                y = y.multiply(new BigDecimal(8));
                x = x.divide(y, str.length() * 3, RoundingMode.HALF_UP);
                z = z.add(x);
            }
            System.out.println(ors + " [8] = " + z + " [10]");
        }
        cin.close();
    }
}

```

# 更新日志
- 2014年07月18日 已AC。