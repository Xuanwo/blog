title: C++语言程序设计进阶——第七章
date: 2015-7-4 16:50:24
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
开始讲继承了。
其实概念上的理解很容易就明白（大概是因为初中的时候就看过一点点java？），不过一直困扰着我的是怎么写= =。捣鼓了很久，总算才明白一点。

<!-- more -->

# 作业
## 账户类
> 定义一个基类Account，数据成员包含string类变量userName用于保存账户主人姓名，函数成员包括默认构造函数、带参构造函数用于初始化数据成员和输出姓名的成员函PrintName()。从Account类派生出CreditAccount类，增加整型数据成员credit用于记录该用户信用额度，函数成员包括带参构造函数用于初始化数据成员和输出账户信息的成员函数PrintInfo()。要求：在函数PrintInfo()中需要调用基类的成员函数PrintName()。

在如何对基类中的私有成员变量进行初始化这一块上花费了很久的时间，摸索了很久，用了很多种奇异的姿势。不能说更多，不过最坑爹的地方还是在于，我直接输出结果也过了= =。


```cpp
#include <iostream>
#include <string>
using namespace std;

class Account
{
    string userName;
public:
    Account() {};
    Account( string name );
    void  PrintUserName();
};

class CreditAccount : public Account
{
public:
    CreditAccount( string name, int credit);
    void PrintInfo();
private:
    int credit;
};

//请实现Account构造函数Account(char *name)
Account::Account(string name)
{
    userName = name;
}
//请实现Account的PrintUserName()函数
void Account::PrintUserName()
{
    cout<<userName;
}
//请实现CreditAccount类的构造函数CreditAccount(char* name, long number)
CreditAccount::CreditAccount(string name, int credit) : Account(name)
{
    CreditAccount::credit = credit;
}
//请实现CreditAccount类的PrintInfo()函数
void CreditAccount::PrintInfo()
{
    Account::PrintUserName();
    cout<<endl<<credit;
}

int main()
{
    CreditAccount a("I Love CPP", 10000);
    a.PrintInfo();
    return 0;
}

```

## 多继承
> 下面的代码声明了三个基类Base1、Base2和Base3，然后从这三个基类按照公有方式派生出类Derived。在每个类中分别定义带一个整型参数的构造函数和析构函数输出提示信息，构造函数的提示信息中需要包含整型参数的数值。请将下面的代码补充完整，使得输出结果与样例输出相同，注意：测试数据有多组。
> 输入：1 2 3 4
> 输出：
Base2 constructor called 3
Base1 constructor called 2
Base3 constructor called 4
Derived constructor called 1
Derived destructor called
Base3 destructor called
Base1 destructor called
Base2 destructor called

此处除了考察多继承之外，还要了解每一个对象的产生与销毁的顺序。我一开始以为跟构造函数中参数表的顺序有关系，后来发现，其实这个顺序是在继承的时候决定的。也就是说，在构造对象的时候，先按照继承顺序从左到右构造基类对象，最后构造本体对象；而在销毁时，则先销毁本体对象，再按照与继承顺序相反从右到左销毁基类对象。


```cpp
#include <iostream>
using namespace std;

class Base1
{
public:
    Base1(int x);
    ~Base1();
};

class Base2
{
public:
    Base2(int x);
    ~Base2();
};
class Base3
{
public:
    Base3(int x);
    ~Base3();
};

class Derived: public Base2, public Base1,  public Base3//继承上面3个类
{
public:
    Derived(int x1, int x2, int x3, int x4);
    ~Derived();
};

Base1::Base1(int x)
{
    cout << "Base1 constructor called " << x << endl;
}

Base1::~Base1()
{
    cout << "Base1 destructor called" << endl;
}
//依照Base1类中的代码实现其它类的构造函数和析构函数

Base2::Base2(int x)
{
    cout << "Base2 constructor called " << x << endl;
}

Base2::~Base2()
{
    cout << "Base2 destructor called" << endl;
}

Base3::Base3(int x)
{
    cout << "Base3 constructor called " << x << endl;
}

Base3::~Base3()
{
    cout << "Base3 destructor called" << endl;
}

Derived::Derived(int x1, int x2, int x3, int x4): Base1(x2), Base2(x3), Base3(x4)
{
    cout << "Derived constructor called " << x1 << endl;
}

Derived::~Derived()
{
    cout << "Derived destructor called" << endl;
}

int main()
{
    int x[4];
    while (cin >> x[0])
    {
        for (int i = 1; i < 4; ++i)
            cin >> x[i];
        Derived d(x[0], x[1], x[2], x[3]);
    }
    return 0;
}

```

# 更新日志
- 2015年07月04日 要结课啦= =