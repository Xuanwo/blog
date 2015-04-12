title: C++语言程序设计基础——第四章
date: 2015-4-12 15:29:05
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章开始进入面对对象编程的学习。
面对过程的代码撸多了- -，果然不是非常能适应这个节奏，痛苦的卡了很久= =。

<!-- more -->

# 作业
**C4-1 最大公约数**
> 求两个正整数a 和 b的最大公约数。
非常简单的gcd- -，然而发现并不能实现一个好的递归，于是改成了迭代。
```
#include <iostream>
using namespace std;
class Integer {
private:
     int _num;
public:
//构造函数
     Integer(int num) {
          _num = num;
     }
//计算当前Integer 和 b之间的最大公约数
     int gcd(Integer b)
     {
          int x = _num;
          int y = b._num;
          while (y != 0)
          {
               int r = y;
               y = x % y;
               x = r;
          }
          return x;
     }
};

int main() {
     int a, b;
     cin >> a >> b;
     Integer A(a);
     Integer B(b);
     cout << A.gcd(B) << endl;
     return 0;
}
```

**C4-2 反转整数**
> 对于输入的一个正整数，输出其反转形式
一开始的想法是用字符串来搞，后来发现原来还有更优雅的做法。
```
#include <iostream>
using namespace std;

class Integer{
private:
    int _num;
//getLength()函数获取_num长度
    int getLength(){
         int x=_num;
         int len=0;
         while(x!=0||x%10!=0)
         {
              len++;
              x/=10;
         }
         return len;
    }
public:
//Integer类构造函数
    Integer(int num){
         _num=num;
    }
//反转_num
    int inversed(){
         int len = getLength();
         int tmp=_num;
         int ans=0;
         for(int i=0;i<len;i++)
         {
              ans=ans*10+tmp%10;
              tmp/=10;
         }
         return ans;
    }
};

int main() {
    int n;
    cin >> n;
    Integer integer(n);
    cout << integer.inversed() << endl;
}
```

**C4-3 一元二次方程求解**
> 对于一元二次方程ax^2 + bx + c = 0,解可以分为很多情况。
> 若该方程有两个不相等实根，首先输出1，换行，然后从小到大输出两个实根，换行；
> 若该方程有两个相等实根，首先输出2，换行，然后输出这个这个实根，换行；
> 若该方程有一对共轭复根，输出3，换行；
> 若该方程有无解，输出4，换行；
> 若该方程有无穷个解，输出5，换行；
> 若该方程只有一个根，首先输出6，换行，然后输出这个跟，换行；
这道题- -，样例错了，所以被坑了一段时间。
```
#include <iostream>
#include <cmath>
#include <cstdio>
using namespace std;
class Equation {
private:
     int _a, _b, _c, _x;
public:
     Equation(int a, int b, int c) {
          _a = a, _b = b, _c = c;
          _x = _b * _b - 4 * _a * _c;
     }
     void solve() {
          if (_x > 0 && _a != 0)
          {
               cout << 1 << endl;
               double x = -_b / 2.0 / (double)_a;
               double y = sqrt(_x) / 2.0 / (double)_a;
               printf("%.2f %.2f\n", x - y, x + y);
          }
          else if(_x==0&&_a!=0)
          {
               cout << 2 << endl;
               double x = -_b / 2.0 / (double)_a;
               printf("%.2f\n", x);
          }
          else if(_x<0&&_a!=0)
          {
               cout<<3<<endl;
          }
          else if(_a==0&&_b==0&&_c!=0)
          {
               cout<<4<<endl;
          }
          else if(_a==0&&_b==0&&_c==0)
          {
               cout<<5<<endl;
          }
          else if(_a==0&&_b!=0)
          {
               cout<<6<<endl;
               double x = -_c /(double)_b;
               printf("%.2f\n", x);
          }
     }
};

int main() {
     int a, b, c;
     cin >> a >> b >> c;
     Equation tmp(a, b, c);
     tmp.solve();
}
```

# 更新日志
- 2015年04月12日 首次发布