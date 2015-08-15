title: C++语言程序设计进阶——第十二章
date: 2015-7-13 17:15:44
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
异常处理= =，工程中很有用，但是对我来说没啥用处的一个特性，并不打算深学、

<!-- more -->

# 作业
## 等腰三角形的面积
> 输入一个三角形三条边长，判断是否是等腰三角形并计算其面积。注意若输入数据非等腰三角形数据，要求使用exception处理。

具体写这个异常的时候，还是遇到了一点问题= =，回头去看了下视频。

```cpp
#include <iostream>
#include <stdexcept>
#include <cmath>
#include <algorithm>
#include <iomanip>

using namespace std;

double x[3];

bool judge(double a, double b, double c)
{
    x[0] = a, x[1] = b, x[2] = c;
    sort(x, x + 3);
    if (x[0] == x[1])  return true;
    else if (x[1] == x[2]) return true;
    else return false;
}

struct ooops : exception {
    const char* what() const noexcept {return "The input is illegal";}
};

/*完善此函数*/
double calArea(double a, double b, double c) {
    if (judge(a, b, c))
    {
        double p = (a + b + c) / 2.0;
        return sqrt(p * (p - a) * (p - b) * (p - c));
    }
    else
    {
        throw ooops();
    }
}

int main() {
    double a, b, c;
    cin >> a >> b >> c;
    try {
        double area = calArea(a, b, c);
        printf("%.2f", area);
    } catch (ooops e) {
        cout << e.what() << endl;
    }
}
```
# 更新日志
- 2015年07月13日 总算完成了= =