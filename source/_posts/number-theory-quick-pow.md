title: 数论——快速幂
date: 2015-3-18 17:43:59
tags: [ACM, C, 数论]
categories: Summary
toc: true
---
# 原始代码
```
int Pow(int A, int n)
{
    if (n == 0) return 1;
    int rslt = 1;
    for (int i = 0; i < n; ++i)
    {
        rslt *= A;
    }
    return rslt;
}
```
<!-- more -->
很简单的算法，复杂度为O(n)，但是当n特别大的时候，可能会出现以下两个问题：
- 爆int，我们无法使用int来存储我们最后的结果。
- 计算量上升极快，即使是O(n)的复杂度也无法满足我们的需要。

# 二分优化
快速幂的思想非常简单，就是二分法：
```
对于一般的解法：
A^8 = A * A * A * A * A * A * A * A
总共需要7次乘法运算；

将其平均分解：
A^8 = (A * A * A * A) * (A * A * A * A) = (A * A * A * A) ^ 2
这样我们就只需要4次乘法运算了；

我们还可以将其再分解：
A^6 = [(A * A) * (A * A)] ^ 2 = [(A * A) ^ 2] ^ 2
这样就将乘法运算的次数减少为了3次。
```
当然，进行这样的分解需要满足一个前提：进行快速幂运算的数据类型必须是满足结合律的。然后，我们可以看出，这种二分解法将原本n次的运算降低为`logn / log2`次。在这样的思想指导下，我们可以得出一个O(logn)的优化算法：
```
int qPow(int A, int n)
{
    if (n == 0) return 1;
    int rslt = 1;

    while (n)
    {
        if (n & 1) //如果n为奇数
        {
            rslt *= A;
        }
        A *= A;
        n >>= 1;
    }
    return rslt;
}
```

# 引用
- [快速幂运算](http://blueve.me/archives/660)

# 更新日志
- 2015年3月19日 首次发布。