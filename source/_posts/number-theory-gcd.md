title: 数论——欧几里得算法
date: 2015-3-11 10:32:31
tags: [ACM, C, 数论]
categories: Summary
toc: true
---
# 欧几里得算法
## 介绍
欧几里得算法，又名辗转相除法，是求最大公约数的算法。两个整数的最大公约数是能够同时整除它们的最大的正整数。辗转相除法基于如下原理：两个整数的最大公约数等于其中较小的数和两数的差的最大公约数。例如，252和105的最大公约数是21（252 = 21 × 12；105 = 21 × 5）；因为252 − 105 = 147，所以147和105的最大公约数也是21。在这个过程中，较大的数缩小了，所以继续进行同样的计算可以不断缩小这两个数直至其中一个变成零。这时，所剩下的还没有变成零的数就是两数的最大公约数。
![辗转相除法的演示动画](http://xuanwo.qiniudn.com/summary/Euclidean_algorithm_252_105_animation_flipped.gif)
参考辗转相除法的演示动画：两条线段分别表示252和105，其中每一段表示21。动画演示了循环从大数中减去小数，直到其中一段的长度为0，此时剩下的一条线段的长度就是252和105的最大公约数。

<!-- more -->

## 关于最大公约数
- **基础定义**
欧几里得的辗转相除法计算的是两个自然数a和b的最大公约数g，意思是能够同时整除a和b的自然数中最大的一个。两个数的最大公约数通常写成gcd(a, b)，如果有gcd(a, b)==1，则有a，b互质。
![最大公约数](http://xuanwo.qiniudn.com/summary/150px-Square_tiling_24x60.svg.png)
参考最大公约数的演示动画：一个24×60的长方形正好被十个12×12的方格填满，其中12是24和60的最大公约数。一般地，当且仅当c是a和b的公约数时，a×b尺寸的长方形可被边长c的正方形正好填满。
- **环论定义**
在数学中，尤其是高等数学的环论中，最大公约数有一个更加巧妙的定义：a和b的最大公约数g是a和b的线性和中（绝对值）最小的一个，即所有形如ua + vb（其中u和v是整数）的数中（绝对值）最小的数。所有ua + vb都是g的整数倍（ua + vb = mg，其中m是整数）。
## 举例
例如，计算a = 1071和b = 462的最大公约数的过程如下：从1071中不断减去462直到小于462（可以减2次，即商q0 = 2），余数是147：
1071 = 2 × 462 + 147.
然后从462中不断减去147直到小于147（可以减3次，即q1 = 3），余数是21：
462 = 3 × 147 + 21.
再从147中不断减去21直到小于21（可以减7次，即q2 = 7），没有余数：
147 = 7 × 21 + 0.
此时，余数是0，所以1071和462的最大公约数是21，用表格表示如下：
```
步骤数	算式	商和余数
0	1071 = 462 q0 + r0	q0 = 2、r0 = 147
1	462 = 147 q1 + r1	q1 = 3、r1 = 21
2	147 = 21 q2 + r2	q2 = 7、r2 = 0
```
## 算法
### 递归
```
int Gcd(int a, int b)
{
    if(b == 0)
        return a;
    return Gcd(b, a % b);
}
```
### 迭代
```
int Gcd(int a, int b)
{
    while(b != 0)
    {
        int r = b;
        b = a % b;
        a = r;
    }
    return a;
}
```

# 扩展欧几里得算法
## 贝祖等式
贝祖等式说明，两个数a和b的最大公约数g可以表示为a和b的线性和。也就是说，存在整数s和t使g = sa + tb。
整数s和t可以从辗转相除法算出的商q0、q1……计算出。 从辗转相除法的最后一步开始，g可以表示成前一步的商qN−1和前两步的余数rN−2和rN−3：
<dl>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><span class="texhtml"><i>g</i> = <i>r</i><sub><i>N</i>−1</sub> = <i>r</i><sub><i>N</i>−3</sub> − <i>q</i><sub><i>N</i>−1</sub> <i>r</i><sub><i>N</i>−2</sub></span></span></dd>
</dl>
而前两步的余数又分别可以表示成它们前两步的余数和商： 
<dl>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><i>r</i><sub><i>N</i>−2</sub> = <i>r</i><sub><i>N</i>−4</sub> − <i>q</i><sub><i>N</i>−2</sub> <i>r</i><sub><i>N</i>−3</sub></span></dd>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><i>r</i><sub><i>N</i>−3</sub> = <i>r</i><sub><i>N</i>−5</sub> − <i>q</i><sub><i>N</i>−3</sub> <i>r</i><sub><i>N</i>−4</sub></span></dd>
</dl>
将这两行式子代入第一个式子，可以将g表示成rN−4和rN−5的线性和。重复进行迭代直到出现a和b: 
<dl>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><i>r</i><sub>2</sub> = <i>r</i><sub>0</sub> − <i>q</i><sub>2</sub> <i>r</i><sub>1</sub></span></dd>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><i>r</i><sub>1</sub> = <i>b</i> − <i>q</i><sub>1</sub> <i>r</i><sub>0</sub></span></dd>
<dd><span lang="en" style="font-family: serif;" xml:lang="en"><i>r</i><sub>0</sub> = <i>a</i> − <i>q</i><sub>0</sub> <i>b</i></span></dd>
</dl>
最终，g可以表示成a和b的线性和：g = sa + tb。贝祖等式以及以上证明都可以扩展至欧几里得整环。