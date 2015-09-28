title: C++语言程序设计进阶——第十一章
date: 2015-7-13 17:07:19
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章并不难，但是题目有点坑。因为涉及到浮点误差的问题，然后教师方也不提供SPJ= =，所以还是用了string的方式来输出。

<!-- more -->

# 作业
## 浮点数输出
> 编写一个程序，输入一个浮点数和输出格式要求，按照格式要求将该浮点数输出。给定非负整数m和n，表示输出的浮点数小数点前的宽度为m，若宽度不够则在前面补0，小数点后的宽度为n，若宽度不够则在后面补0(补充说明：当n=0时，只需输出整数部分，当m,n都为0时，则输出0)。

这道题做了很久，甚至还拿去问了队友，都没有满意的答案。一怒之下，还是用了各种string来完成。


```
cpp
#include <iostream>
#include <sstream>
#include <iomanip>
#include <string>
using namespace std;

int main(void)
{
    int m, n;
    double num;

    while (cin >> m >> n >> num)
    {
        if (m == 0 && n == 0)
            cout << 0 << endl;
        else
        {
            cout << setw(m) << setfill('0') << int(num);
            if (n != 0)
            {
                ostringstream os;
                os << setiosflags(ios_base::fixed);
                os << fixed << setprecision(n+1) << num - int(num);
                os << setiosflags(ios_base::fixed);
                string str = os.str();
                for (int i = 1; i <= n+1; i++)
                    cout << str[i];
            }
            cout << endl;
        }
    }
    return 0;
}

```

## 重载流运算符
> 实现一个学生类，包含学号（id），姓名（name），年级（grade）数据成员。为了输入输出的方便，需要对这个学生类重载“>>”和“<<”运算符，同时为了对多个学生按照学号从小到大排序，还需要重载“<”运算符，以使用STL里的sort函数。类的声明与主函数的测试代码已给出，请将类的实现与相关重载补充完整，使得程序正确运行并输出正确结果。

这道题并不是很难，只需要重载输入输出和小于即可。


```
cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Student
{
public:
    int id;
    string name, grade;
    Student() {};
    Student(int id, string name, string grade);
    bool operator < (const Student & s) const
    {
        return id < s.id;
    }
};

istream & operator >> (istream & in, Student & s)
{
    return in >> s.id >> s.name >> s.grade;
}

ostream & operator << (ostream & out, Student & s)
{
    return out << s.id << " " << s.name << " " << s.grade << endl;
}


int main()
{
    vector<Student> sv;
    Student temp;
    while (cin >> temp)
    {
        sv.push_back(temp);
    }
    sort(sv.begin(), sv.end());
    for (int i = 0; i < sv.size(); ++i)
        cout << sv[i];
    return 0;
}

```

# 更新日志
- 2015年07月13日 赶deadline ing