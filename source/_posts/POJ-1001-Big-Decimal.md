title: POJ 1001 求高精度幂
date: 2014-07-15 23:09:03
tags: [ACM, POJ, Java, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1001

# 理解
搜索高精度计算的时候发现java自带了关于高精度处理的类，毫不客气的拿来用了～

<!-- more -->

# 新技能get
[Java高精度计算](http://tool.oschina.net/apidocs/apidoc?api=jdk_7u4)
`BigDecimal r = cin.nextBigDecimal()`定义一个高精度类
`stripTrailingZeros()`除去尾部多余的0
`toPlainString()`转化为string类

# 代码
```import java.io.*;
import java.util.*;
import java.math.BigDecimal;

public class Main {
    public static void main(String args[])throws Exception {
        Scanner cin = new Scanner(System.in);
        while (cin.hasNext()) {
            BigDecimal r = cin.nextBigDecimal();
            int n = cin.nextInt();
            r = r.pow(n).stripTrailingZeros();
            String m_string = r.toPlainString();
            if (m_string.charAt(0) == '0')
                m_string = m_string.substring(1);
            System.out.println(m_string);
        }
    }
}
```
# 更新日志
- 2014年07月15日 已AC。