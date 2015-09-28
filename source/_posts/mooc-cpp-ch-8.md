title: C++语言程序设计进阶——第八章
date: 2015-7-8 15:46:09
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章节主要讲解的是多态。在我看来- -，多态最直接的体现就是运算符的重载，当然，这也是我们最经常用到的多态性的体现。至于虚函数和抽象类= =，我的理解并不是很深刻，就不误人子弟了。

<!-- more -->

# 作业
## 复数加减乘除
> 求两个复数的加减乘除。

多态的话，平时敲代码也经常有用到，所以并没有折腾很久。倒是虚数的四则运算还推了一会儿- -，计算基础真的已经弱成渣了。。


```
cpp
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>

using namespace std;

class Complex {
public:
    Complex(double r = 0.0, double i = 0.0): real(r), imag(i) {};
    Complex operator+ (const Complex &c2) const;
    Complex operator- (const Complex &c2) const;

    /*实现下面三个函数*/
    Complex operator* (const Complex &c2) const;
    Complex operator/ (const Complex &c2) const;
    friend ostream & operator<< (ostream &out, const Complex &c);

private:
    double real;
    double imag;
};

Complex Complex::operator+ (const Complex &c2) const
{
    return Complex(real + c2.real, imag + c2.imag);
}

Complex Complex::operator- (const Complex &c2) const
{
    return Complex(real - c2.real, imag - c2.imag);
}

Complex Complex::operator* (const Complex &c2) const
{
    return Complex(real * c2.real - imag * c2.imag, real * c2.imag + imag * c2.real);
}
Complex Complex::operator/ (const Complex &c2) const
{
    double x = c2.real * c2.real + c2.imag * c2.imag;
    return Complex((real * c2.real + imag * c2.imag) / x, (imag * c2.real - real * c2.imag) / x);
}
ostream& operator<< (ostream& output, const Complex &c)
{
    cout << c.real << " " << c.imag << endl;
    return cout;
}


int main() {
    double real, imag;
    cin >> real >> imag;
    Complex c1(real, imag);
    cin >> real >> imag;
    Complex c2(real, imag);
    cout << c1 + c2;
    cout << c1 - c2;
    cout << c1 * c2;
    cout << c1 / c2;
}

```

## 圆的周长和面积
> 求圆的周长和面积，已知圆类从shape抽象类继承。

这道题也没有什么难度，补全两个函数即可。虽说用到了虚函数这种自己并不是很懂的概念，但是撸代码重在胆大心细，跟着直觉走，直接上。


```
cpp
#include <iostream>
using namespace std;

const double pi = 3.14;

class Shape {
public:
    Shape() {}
    ~Shape() {}
    virtual double getArea() = 0;
    virtual double getPerim() = 0;
};

class Circle: public Shape {
public:
    Circle(double rad): radius(rad) {}
    ~Circle() {}

    /*补充这两个函数*/
    double getArea();
    double getPerim();
private:
    double radius;
};

double Circle::getArea()
{
    return radius * radius * pi;
}

double Circle::getPerim()
{
    return 2 * pi * radius;
}

int main() {
    double radius;
    cin >> radius;
    Circle c(radius);
    cout << c.getArea() << " " << c.getPerim() << endl;
}

```

#  三角形还是长方形？
> 在多态概念中，基类的指针既可以指向基类的对象，又可以指向派生类的对象。我们可以使用dynamic_cast类型转换操作符来判断当前指针（必须是多态类型）是否能够转换成为某个目的类型的指针。
> 同学们先查找dynamic_cast的使用说明（如http://en.wikipedia.org/wiki/Run-time_type_information#dynamic_cast），然后使用该类型转换操作符完成下面程序（该题无输入）。
> 函数int getVertexCount(Shape * b)计算b的顶点数目，若b指向Shape类型，返回值为0；若b指向Triangle类型，返回值为3；若b指向Rectangle类型，返回值为4。

用到了一个黑科技：[dynamic_cast](http://en.cppreference.com/w/cpp/language/dynamic_cast)。

```
dynamic_cast < new_type > ( expression )

```
试着将`expression`转换为`new_type`，如果转换成功，则返回一个`new_type`的指针，如果转换失败，则返回`null`指针。
也就是说，通过这种方法，我们可以确定一个对象是不是可以转换为某个类的对象，如下面的演示。
*纯经验推断= =，如果理解有错，请千万指出*


```
cpp
/*students please write your program here*/
#include <cstdio>
#include <cstring>
#include <iostream>
using namespace std;

class Shape {
public:
    Shape() {}
    virtual ~Shape() {}
};

class Triangle: public Shape {
public:
    Triangle() {}
    ~Triangle() {}
};

class Rectangle: public Shape {
public:
    Rectangle() {}
    ~Rectangle() {}
};

/*用dynamic_cast类型转换操作符完成该函数*/
int getVertexCount(Shape * b) {
    if (dynamic_cast<Triangle *> (b)) return 3;
    else if (dynamic_cast<Rectangle *> (b)) return 4;
    else return 0;
}

int main() {
    Shape s;
    cout << getVertexCount(&s) << endl;
    Triangle t;
    cout << getVertexCount(&t) << endl;
    Rectangle r;
    cout << getVertexCount(&r) << endl;
}

```

# 更新日志
- 2015年07月08日 要结课啦- -，狂赶Deadline。