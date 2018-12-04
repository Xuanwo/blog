---
categories: Code
date: 2015-08-17T02:09:37Z
title: Bestcoder Round 16 C Revenge of Nim II
toc: true
url: /2015/08/17/Bestcoder-16-Revenge-of-Nim-II/
---

## 题目
源地址：

http://acm.hdu.edu.cn/showproblem.php?pid=5088

# 理解
给你N堆石子，你可以除去其中的某些堆（也可以不除），问你能否使得后手必胜。
这是一道看起来像博弈的数学题，因为我们都知道如果想使得后手必胜，就只需要使得每一堆石子数的异或和为0即可。也就是说，我们只需要找出其中的某一些，他们的异或和为0，然后剩下的全都除去。如果能找到，输出`Yes`；找不到，说明不存在，输出`No`。

<!--more-->
又由于异或的性质，我们可以知道在[1,pow(2,n)]中的任意多个数的异或和的情况至多有n种。显然的，如果情况数小于n，根据容斥定理我们可以知道，必定会存在至少两个数的值相等。根据异或的公式`a^a=0`，我们可以让两个相等的数进行异或，就得到了0，说明存在这样的选择方案。那么这个问题就转变了求n个数的异或和的情况数量。
我们可以把每一个数用二进制进行表示，可以发现，两个数异或的过程实际上就是对应二进制位进行消去的过程。我们可以看到，对于每一列，只要有1存在，那么就一定可以对这两个数进行异或，从而使得其中一个对应位置上变为0。也就是说，异或和的情况数量与这个二进制矩阵的秩的大小是等价的。那么问题就转换成了如何求解一个二进制矩阵的秩。分析到了这里，我们不难想到可以运用高斯消元对这个二进制矩阵进行处理。

*本题的想法来自我的学长——[Sio_Five](http://siofive.github.io/2014/11/04/BC16_3/)*
在具体的实现上，学长很多处理让我觉得非常惊艳。
- 10^10大概是2^40左右，保险起见开到了65。根据前面我们推出的性质，异或和的情况最多只有65种（其实不可能会有这么多），所以，只要n大于65，一定输出`Yes`。
- 在高斯消元的过程中，使用xor来代替先判断再消去，姿势更加优美。
- 运用右移再`&1`的方法获取这一位的二进制值，比循环中`/=2`优雅多了。


# 代码

```cpp
const int maxn = 1010;
const int maxm = 65;
int t, n;
ll a[maxn];
int mat[maxm][maxm];

int rnk(int mat[][maxm], int n, int m)
{
    int ret = 0;
    for (int i = 0, it = 0; i < n && it < m; ++it)
    {
        int pos = -1;
        for (int j = i; j < n; ++j)
        {
            if (mat[j][it])
            {
                pos = j;
                break;
            }
        }
        if (pos == -1)   continue;
        ++ret;
        if (pos != i)
        {
            for (int j = it; j < m; ++j)
            {
                swap(mat[i][j], mat[pos][j]);
            }
        }
        for (int j = 0; j < n; ++j)
        {
            if (i != j && mat[j][it])
            {
                for (int k = it; k < m; ++k)
                {
                    mat[j][k] ^= mat[i][k];
                }
            }
        }
        ++i;
    }
    return ret;
}

int main()
{
    scanf("%d", &t);
    while (t--)
    {
        ll sum = 0;
        memset(mat, 0, sizeof(mat));
        scanf("%d", &n);
        for (int i = 0; i < n; ++i)
        {
            scanf("%I64d", &a[i]);
            sum ^= a[i];
        }
        if (sum == 0 || n > maxm)
        {
            printf("Yes\n");
            continue;
        }
        for (int i = 0; i < n; ++i)
        {
            for (int j = 0; j < maxm; ++j)
            {
                mat[i][j] = (a[i] >> j) & 1;
            }
        }
        int ret = rnk(mat, n, maxm);
        if (ret < n)  printf("Yes\n");
        else printf("No\n");
    }
    return 0;
}

```


# 更新日志
- 2015年8月17日 已AC