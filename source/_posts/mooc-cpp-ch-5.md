title: C++语言程序设计基础——第五章
date: 2015-6-10 01:52:11
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章介绍了标识符作用的作用域和可见性，还有对象的生存期，共享数据的保护之类的知识。因为之前有过了解，所以理解起来并不是非常困难。然而- -，到去实现的时候，遇到了各种坑点，简直蛋疼。

*感谢[知名博主](http://fanzheng.org/)的大力支持，在玩GalGame期间提供了无私的指导*

<!-- more -->

# 作业

## C5-1 “鱼额宝”
> 请实现一个“鱼额宝”类，下面已给出代码模板，请根据main函数中对该类的操作，补充类实现部分完成代码。
> “鱼额宝”类可以记录账户余额、存钱、取钱、计算利息。该类中有一个私有静态成员变量profitRate存储“鱼额宝”的利率，可以用共有静态成员函数setProfitRate修改利率的值。程序输入为第1天至第n天连续n天的账户操作，每天只能进行一次账户操作，或存或取，每一天产生的利息是前一天的账户余额与“鱼额宝”利率的乘积，产生的利息当天也将存入账户余额，由于第1天之前账户不存在，所以第1天一定是新建账户并存钱，且当天不会有利息存入余额。程序在接受n天操作的输入后，要求计算出第n天操作完成后的账户余额并输出。

被坑了很久- -，主要是以下几个问题：
- 带有形参的构造函数的实现方式为`类名::类名(变量类型 变量名) : 类中元素名(变量名) {}`
- 类中的静态函数在实现时不需要再添加`static`关键字
- 类中的静态成员只需要声明一次

*被各种诡异的编译出错信息吓尿了= =*

```
#include <iostream>
using namespace std;

class Yuebao
{
private:
    static double profitRate;
    double remain;
public:
    Yuebao(double x);
    static void setProfitRate(double rate);
    /* Your code here! */
    void addProfit()
    {
        remain *= (1 + profitRate);
    }
    void deposit(double amount)
    {
        remain += amount;
    }
    void withdraw(double amount)
    {
        remain -= amount;
    }
    double getBalance()
    {
        return remain;
    }
};

Yuebao::Yuebao(double x) : remain(x) {}
double Yuebao::profitRate = 0;
void Yuebao::setProfitRate(double rate)
{
    Yuebao::profitRate = rate;
}

int main()
{
    int n;
    while (cin >> n)
    {
        double profitRate;
        cin >> profitRate;

        Yuebao::setProfitRate(profitRate);//设定鱼额宝的利率
        Yuebao y(0); //新建鱼额宝账户，余额初始化为0
        int operation;//接受输入判断是存还是取
        double amount;//接受输入存取金额
        for (int i = 0; i < n; ++i)
        {
            y.addProfit();//加入前一天余额产生的利息
            cin >> operation >> amount;
            if (operation == 0)
                y.deposit(amount);//存入金额
            else
                y.withdraw(amount);//取出金额
        }
        cout << y.getBalance() << endl;//输出最终账户余额
    }
    return 0;
}
```
## C5-2 数老鼠
> 请实现一个老鼠类，下面已给出代码模板，请根据main函数中对该类的操作，补充类实现部分完成代码。
> 该类有个公有静态变量num记录该类的所有对象数，主函数将会在不同语句之后输出对象数，只有正确地实现该类，保证num正确记录该类的对象数，才能输出正确的结果。

这道题卡住地方有两个：
- 复制构造函数的实现方式为`类名(类名 &变量名) {}`
- 题意中隐含的意思是指要输出当前仍然存在的对象数，所以不仅仅要实现构造函数中自增，还要再实现一个析构函数用于自减。

```
#include <iostream>
using namespace std;

class Mouse {
public:
    static int num;
    Mouse() {num++;}
    Mouse(Mouse &x) {num++;}
    ~Mouse() {num--;}
};



void fn(Mouse m);
int Mouse::num = 0;
int main()
{
    Mouse::num = 0;
    Mouse a;
    cout << Mouse::num << endl;
    Mouse b(a);
    cout << Mouse::num << endl;
    for (int i = 0; i < 10; ++i)
    {
        Mouse x;
        cout << Mouse::num << endl;
    }
    fn(a);
    cout << Mouse::num << endl;
    return 0;
}

void fn(Mouse m)
{
    cout << Mouse::num << endl;
    Mouse n(m);
    cout << Mouse::num << endl;
}
```

# 更新日志
- 2015年06月10日 首次完成。