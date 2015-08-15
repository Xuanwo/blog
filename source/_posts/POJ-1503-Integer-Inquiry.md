title: POJ 1503 Integer Inquiry
date: 2014-07-18 15:04:04
tags: [ACM, POJ, Java, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1503

# 理解
还是高精度计算，大数相加～

<!-- more -->

# 代码
```
import java.util.Scanner;
import java.io.*;
import java.math.*;

public class Main {
    public static void main(String args[]) {
        Scanner cin = new Scanner(new BufferedInputStream(System.in));
        
        BigInteger a;
        BigInteger b = new BigInteger("0");
        BigInteger c = new BigInteger("0");
        while(cin.hasNextBigInteger()) {
            a = cin.nextBigInteger();
            if(a.compareTo(c) == 0) break;
            
            b = b.add(a); 
        }
        System.out.println(b);
    }
}

```

# 更新日志
- 2014年07月18日 已AC。