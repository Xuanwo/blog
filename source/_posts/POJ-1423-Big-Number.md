title: POJ 1423 Big Number
date: 2014-07-23 23:26:52
tags: [ACM, POJ, Java, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1423

# 理解
又是大数据的题目，果断用Java来做，不过还是用到了取对数得操作。

<!-- more -->

# 代码
```
import java.util.*;

public class Main {

    public static void main(String[] args) {
        Scanner cin = new Scanner(System.in);
        int n = cin.nextInt();
        while (n > 0) {
            int test = cin.nextInt();
            if (test <= 3)
                System.out.println(1);
            else {
                double result = 0.5 * Math.log10(2 * test * Math.PI) +
                                test * Math.log10(test / Math.E) + 1;;
                System.out.println((int)(result));
            }
            n--;
        }
    }
}
```

# 更新日志
- 2014年07月23日 已AC。