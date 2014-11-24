title: Codeforces Beta Round 15 E Triangles
date: 2014-11-23 13:50:17
tags: [ACM, Codeforces, C/C++, DP, 组合数学]
categories: Exercise
toc: true
---
# 题目	
源地址：http://codeforces.com/contest/15/problem/E

# 理解
数学渣，这道题无从下手= =。为了方便能自己看出一些东西来，我打了前两项的表去CF提交，幸运地得到了n=6的解，结果是1354。这个结果印证了昨晚比赛时候我的一些想法，因为`10=(2^2+1)*2`，`74=(6^2+1)*2`，`1354=(26^2+1)*2`。也就是说，最后的结果一定是某一个数的平方加上一再乘二的结果。这样，这个问题就转化成了，如何找到那个数。我们可以看到，这个数组成的数列是`2 6 26`。考虑到最后的取模，这个数一定是指数级别的，要不然增长速度太慢了，作为一个未来的码农，想到的第一个数列就是2 4 8。乍一看感觉跟`2 6 26`扯不上关系，不过再观察一下，`2 6 26`向前递减之后可以得到另外一个衍生数列，也就是`2 4 20`。第一个反应就是`20=4*5`，但是对不上啊，4怎么处理？小脑一动，对啊，4=4*1。1和5跟原数列有什么关系呢？可以看到，`1=4-3`，`5=8-3`。
写到这里，脑子里面已经是一团浆糊了，我来列成表格梳理一下。
```
a  c  b
2  4  2
4  4  6
8  20 26
```
这样可以看出，a=pow(2,i)，c就等于c*(a-3)，明显，b=b+c。于是我就得到了最后的公式。
以上，是通过偷鸡往后再推了一项得到的题解，在实际的比赛中，一方面题目不会再给你下一项（CF倒是可以用这种方法骗答案），另一方面，真的比赛中思路也不会这么清晰。所以还是要学习正规的组合数学+DP的做法，在我学会之前，还是先挖一个坑吧= =。

<!-- more -->

# 新技能get

# 代码
```
/*
//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
//          佛曰:
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？
*/
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <ctime>
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <deque>
#include <list>
#include <set>
#include <map>
#include <stack>
#include <queue>
#include <numeric>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug "output for debug\n"
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf 0x3f3f3f3f
#define ll long long int
#define mod 1000000009
using namespace std;

ll a=2,b=2,c=4,n;


int main(int argc, char const *argv[])
{
    scanf("%I64d",&n);
    a=2,b=2,c=4;
    while(n-=2)
    {
        a=a*2%mod,c=c*(a-3)%mod,b=(b+c)%mod;
    }
    printf("%I64d\n",(b*b+1)*2%mod);
    return 0;
}
```

# 更新日志
- 2014年11月23日 已AC。