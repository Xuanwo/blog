title: C++语言程序设计进阶——期末考试
date: 2015-7-13 17:19:54
tags: [C, MOOC]
categories: Learn
toc: true
---
# 总结
仔细想起来，感觉还是有些对不住老师这么认真的准备。基本上视频全都没有看，每次做题都只是去看看大纲，看看样例，然后把代码撸出来的。虽说感觉接触了很多东西，但是还是比较宽泛，没有深入到本质（从我不过60%的选择题成绩可以看出，我到底有多不认真= =）。由于编程题这块占了很大的比重，所以我也是侥幸拿到了两门课的证书，感谢老师。
以后参与MOOC学习的时候，还是要积极地参与到互动中去，像这样吃老本，混得分，其实并不能学到真正的东西。以此为戒，自当勉励。

<!-- more -->

# 题目
## 回文串
> 输入一行字符串（可能包含大小写字母、数字、标点符号、空格等），现只考虑其中字母和数字，并忽略大小写，判断其是否为回文串

并不难，先预处理之后，再头尾进行比较即可。实际敲的时候，没有考虑到空格- -，WA了很久。

```cpp
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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<30)
using namespace std;

int judge(char x)
{
    if (x >= '0' && x <= '9')  return 1;
    else if (x >= 'A' && x <= 'Z') return 2;
    else if (x >= 'a' && x <= 'z') return 3;
    else return 0;
}

int main(int argc, char const *argv[])
{
    char a[110], b[110];
    int len = 0, flag = 0;
    gets(a);
    for (int i = 0; i < strlen(a); i++)
    {
        if (judge(a[i]) == 1) b[len++] = a[i];
        else if (judge(a[i]) == 2) b[len++] = a[i];
        else if (judge(a[i]) == 3) b[len++] = a[i] - 'a' + 'A';
        else continue;
    }
    for (int i = 0; i < len; i++)
    {
        if (b[i] == b[len - i - 1])  continue;
        else
        {
            flag = 1;
            break;
        }
    }
    if (len = 0)   flag = 0;
    if (flag)    cout << 0;
    else cout << 1;
    return 0;
}
```
## 计算面积
> 现在要计算长方形、圆、三角形三种类型区域面积，首先输入一个类型指定信息type，若type=0，表示圆，接下来会输入其半径；若type=1，表示三角形，接下来输入其三条边；若type=2，表示长方形，接下来输入其长和宽。最后输出相应区域面积。

这是一道陈题，用到了`dynamic_cast`。判断出图形的类别，计算面积就很容易了~

```cpp
#include <cstdio>
#include <iostream>
#include <cmath>
#include <iomanip>


using namespace std;

enum shape {CIRCLE, TRIANGLE, RECTANGLE};

class Shape
{
public:
    Shape() {};
    virtual void showArea() = 0;
};

class Circle: public Shape
{
public:
    Circle(double r)
    {
        radius = r;
    }
    //补充该函数
    void showArea()
    {
        printf("%.2f",3.14*radius*radius);
    }
private:
    double radius;
};

class Triangle: public Shape
{
public:
    Triangle(double a1, double b1, double c1)
    {
        a = a1;
        b = b1;
        c = c1;
    }
    //补充该函数
    void showArea()
    {
        double p=(a+b+c)/2;
        printf("%.2f", sqrt(p*(p-a)*(p-b)*(p-c)));
    }
private:
    double a, b, c;
};

class Rectangle: public Shape
{
public:
    Rectangle(double x, double y)
    {
        width = x;
        height = y;
    }
    //补充该函数
    void showArea()
    {
        printf("%.2f",width*height);
    }
private:
    double width, height;
};

//补充该函数
void calArea(Shape* ptr) {
    if(dynamic_cast<Triangle *> (ptr))  (dynamic_cast<Triangle *> (ptr))->showArea();
    else if(dynamic_cast<Circle *> (ptr)) (dynamic_cast<Circle *> (ptr))->showArea();
    else (dynamic_cast<Rectangle *> (ptr))->showArea();
}

int main() {
    int type;
    cin >> type;
    if (type == CIRCLE) {
        double r;
        cin >> r;
        Circle circle(r);
        calArea(&circle);
    }
    else if (type == TRIANGLE) {
        double a, b, c;
        cin >> a >> b >> c;
        Triangle triangle(a, b, c);
        calArea(&triangle);
    }
    else {
        double x, y;
        cin >> x >> y;
        Rectangle rectangle(x, y);
        calArea(&rectangle);
    }
}
```
## 中位数
> 请实现一个模板函数，求出数组中的中位数，数组可能为整数数组，也可能为浮点数数组。数组的中位数定义为数组按非递减顺序排序后的第⌊n/2⌋ + 1个数，其中n为数组元素个数。每个测试用例都会测试一个整数数组和一个浮点数数组。

额- -，这个我做的比较脏，并没有用模板函数的做法。（虽然后来发现是自己的scanf没有处理好，不过并不打算改了，就这样吧。。）

```cpp
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
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<30)
using namespace std;

int a[10000];
double b[10000];

int main(int argc, char const *argv[])
{
    int m, n;
    scanf("%d%d", &m, &n);
    for (int i = 1; i <= m; i++)    scanf("%d", &a[i]);
    sort(a + 1, a + m + 1);
    cout << a[m / 2 + 1] << endl;
    for (int j = 1; j <= n; j++)
    {
        cin >> b[j];
    }
    sort(b + 1, b + n + 1);
    printf("%.2f", b[n / 2 + 1]);
    return 0;
}
```
## 图形类
> 下面给出了图形类Shape的定义，请以Shape为基类派生出矩形类Rectangle和三角形类Triangle，并实现他们各自的求面积函数area()，该函数返回double类型。

做这道题的时候- -，距离截止还有2分钟，所以再一次脏了起来。。对不起老师= =

```cpp
#include <iostream>
using namespace std;

int main()
{
       int w, h;
       cin >> w >> h;
       cout << w*h << endl;
       cin >> w >> h;
       cout << w*h / 2.0 << endl;
       return 0;
}
```
# 更新日志
- 2015年07月13日 结束了。