---
title: POJ 1306 Combinations
date: 2014-07-18 15:43:53
tags: [ACM, POJ, Java, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1306

# 理解
高精度阶乘的题目，再次用java水掉= =。

<!-- more -->

# 代码

```
import java.math.BigInteger;
import java.util.Scanner;


public class Main {
    public static void main(String[] args) {
        Scanner cin=new Scanner(System.in);
        while(true){
            int a=cin.nextInt();
            int b=cin.nextInt();
            if(a==0 && b==0)
                return;
            BigInteger fir=factor(a);
            BigInteger sec=factor(a-b);
            BigInteger third=factor(b);
            BigInteger result=fir.divide(sec).divide(third);
            System.out.println(a+" things taken "+b+" at a time is "+result.toString()+" exactly.");
        }
    }

    public static BigInteger factor(int n){
        BigInteger goal=BigInteger.ONE;
        for(int i=n;i>=2;i--){
            goal=goal.multiply(new BigInteger(String.valueOf(i)) );
        }
        return goal;
    }

}


```

# 更新日志
- 2014年07月18日 已AC。