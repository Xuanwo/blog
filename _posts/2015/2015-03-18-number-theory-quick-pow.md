---
layout: post
title: 数论——快速幂
date: 2015-3-18 17:43:59
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

# 矩阵快速幂
矩阵和整数的快速幂运算算法在代数上应该是等价的，矩阵也具备快速幂运算所必需的条件：结合律。因此，我们在前面得出的结论也能应用到矩阵当中。
首先，我们需要实现一个矩阵类，重载一些运算符：

```
class Matrix
{
public:
    int N; // 矩阵维数
    int** m; // 存储矩阵的二维数组

    Matrix(int n = 2)
    {
        m = new int*[n];
        for (int i=0; i < n; ++i)
        {
            m[i] = new int[n];
        }
        N = n;
        clear();
    }

// 将矩阵清空为零矩阵
    void clear()
    {
        for (int i=0; i < N; ++i)
        {
            memset(m[i], 0, sizeof(int) * N);
        }
    }

// 将矩阵设定为单位矩阵
    void unit()
    {
        clear();
        for (int i=0; i < N; ++i)
        {
            m[i][i] = 1;
        }
    }

// 矩阵的赋值
    Matrix operator= (Matrix &othr)
    {
        Matrix(othr.N);
        for (int i=0; i < othr.N; ++i)
        {
            for (int j=0; j < othr.N; ++j)
            {
                m[i][j] = othr.m[i][j];
            }
        }
        return *this;
    }

// 矩阵的乘法
//!假设所有因子均为同阶方阵
    Matrix operator* (Matrix &othr)
    {
        Matrix rslt(othr.N);
        for (int i=0; i < othr.N; ++i)
        {
            for (int j=0; j < othr.N; ++j)
            {
                for (int k=0; k < othr.N; ++k)
                {
                    rslt.m[i][j] += m[i][k] * othr.m[k][j];
                }
            }
        }
        return rslt;
    }
};

```
有了矩阵类，我们下面再依样画瓢地实现一遍快速幂运算：

```
Matrix qMPow(Matrix &A, int n)
{
    Matrix rslt(A.N);
    rslt.unit();
    if (n == 0) return rslt;
    while (n)
    {
        if (n & 1) // 若幂为奇数
        {
            rslt = rslt * A;
        }
        A = A * A;
        n >>= 1; // 右位移等价于除以2
    }
    return rslt;
}

```

# 引用
- [快速幂运算](http://blueve.me/archives/660)

# 更新日志
- 2015年3月19日 首次发布。
- 2015年3月19日 补充了矩阵快速幂的内容。