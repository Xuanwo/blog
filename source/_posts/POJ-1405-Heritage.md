title: POJ 1405 Heritage
date: 2014-08-03 11:25:44
tags: [ACM, POJ, Java, 贪心, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1405

# 理解
可以得出递推关系X(n+1) = Xn * X(n-1) + 1，考虑到数据较大，使用Java大数类A掉

<!-- more -->

# 代码
```
import java.io.*;
import java.math.*;
import java.util.*;
import java.text.*;
 
public class Main {
    public static void main(String[] args) {
        Scanner cin = new Scanner(System.in);
        int i, id;
        BigInteger one, ans;
        one = BigInteger.valueOf(1);
        ans = BigInteger.valueOf(2);
        id = cin.nextInt();
        for(i = 1; i <= id; i ++){
            System.out.println(ans);
            ans = ans.multiply(ans.subtract(one)).add(one);
        }
        System.exit(0);
    }
}
```

# 更新日志
- 2014年08月02日 已AC。