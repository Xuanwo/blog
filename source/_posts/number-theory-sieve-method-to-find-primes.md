title: 数论——筛法求素数
date: 2015-3-18 17:16:01
tags: [ACM, C, 数论]
categories: Summary
toc: true
---
# 暴力瞎搞求素数
首先，我们需要个判断是否为素数的算法：
```
bool IsPrime(unsigned n)  //此处n是一个大于2的整数
{
	for (unsigned i = 2; i < n / 2 + 1; ++i)
	{
		if (n % i == 0)
		{
			return false;
		}
	}
	return true;
} 
```
然后，在for循环中逐个判断。。。。。。
*你写写看啊，- -，看看队友会不会打扁你。。。*
显然，这个方法太傻逼了= =，我们需要一个效率更高，更为机智算法。

# 一般的线性筛法
下面进入正题，我们来介绍一下求素数的线性筛法。
## 代码
```
void make_prime()  
{
	memset(prime, 1, sizeof(prime));
	prime[0] = false;
	prime[1] = false;
	int N = 31700;
	for (int i = 2;  i < N;  i++)
		if (prime[i]) 
		{
			primes[++cnt ] = i;
			for (int k = i * i; k < N; k += i)
				prime[k] = false;
		}
	return;
}
```
这种方法比较好理解:
初始时，假设全部都是素数，当找到一个素数时，显然这个素数乘上另外一个数之后都是合数(注意上面的 i*i ,  比 i*2 要快点 )，把这些合数都筛掉，即算法名字的由来。
但仔细分析能发现，这种方法会造成重复筛除合数，影响效率。比如10，在i=2的时候，k=2*15筛了一次；在i=5，k=5*6 的时候又筛了一次。所以，也就有了快速线性筛法。

# 快速线性筛法
快速线性筛法没有冗余，不会重复筛除一个数，所以“几乎”是线性的，虽然从代码上分析，时间复杂度并不是O(n)。
## 代码
```
const long N = 200000;
long prime[N] = {0}, num_prime = 0;
int isNotPrime[N] = {1, 1};
int main()
{
	for (long i = 2 ; i < N ; i ++)
	{
		if (! isNotPrime[i])
			prime[num_prime ++] = i;
		//关键处1
		for (long j = 0 ; j < num_prime && i * prime[j] <  N ; j ++)
		{
			isNotPrime[i * prime[j]] = 1;
			if ( !(i % prime[j] ) ) //关键处2
				break;
		}
	}
	return 0;
}
```
## 理解
首先，先明确一个条件，任何合数都能表示成一系列素数的积。
不管 i 是否是素数，都会执行到“关键处1”。

1. 如果 i 都是是素数的话，那简单，一个大的素数 i 乘以不大于 i 的素数，这样筛除的数跟之前的是不会重复的。筛出的数都是 N=p1*p2的形式, p1，p2之间不相等
 
2. 如果 i 是合数，此时 i 可以表示成递增素数相乘 i=p1*p2*...*pn, pi都是素数（2<=i<=n），  pi<=pj  ( i<=j )
p1是最小的系数。

根据“关键处2”的定义，当p1==prime[j] 的时候，筛除就终止了，也就是说，只能筛出不大于p1的质数*i。
 
我们可以直观地举个例子：`i=2*3*5`
此时能筛除 2*i ,不能筛除 3*i，
如果能筛除3*i 的话，当 i' 等于 i'=3*3*5 时，筛除2*i' 就和前面重复了。

# 更新日子
- 2015年03月18日 首次完成。