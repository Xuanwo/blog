title: C++语言程序设计进阶——第九章
date: 2015-7-8 16:06:14
tags: [C, MOOC]
categories: Learn
toc: true
---
# 笔记
这一章节，主要讲了模板与群体数据。通过这一章的学习，我对C++有了更为抽象的认识。我从前认为，int这样的数据类型和我们自己写出来的类是不同的，数据类型和类是两种截然不同的东西。现在，我觉得，他们并没有什么不同，就好比STL库中的函数也并不比我们自己写的函数有更高的地位。也就是说，不管是什么样的数据类型或者是类，我都可以从一个高度抽象的角度来处理它们。这样，我们在思考问题的时候，可以摆脱对细节的纠缠，直接深入到问题的本质中，没错，也就是建模。
虽说得到这样的结论貌似并不能让自己变得更强，不过也算是在C++学习中的一次进步吧，我把这次的进步理解为人类从单纯地数1，2，3发展到了可以数无穷大数这样的跳跃。至于有何用这样的问题，现在回答太早，或许十年后可以回来看看？

<!-- more -->

# 作业
## 数组求和
> 编写一个模板函数getSum，接收一个数组，返回该数组所有元素的和。

很简单的一个题，只要对模板有最基本的了解就可以完成。

```cpp
#include <iostream>
using namespace std;

template <class T>
T getSum(const T *array, int n)
{
    T sum = 0;
    for (int i = 0; i < n; i++)
    {
        sum += array[i];
    }
    return sum;
}

int main()
{
    int n, m;
    cin >> n >> m;
    int* arr_int = new int[n];
    double* arr_double = new double[m];
    for (int i = 0; i < n; ++i)
        cin >> arr_int[i];
    for (int i = 0; i < m; ++i)
        cin >> arr_double[i];
    cout << getSum(arr_int, n) << endl;
    cout << getSum(arr_double, m) << endl;
    return 0;
}
```
## 折半查找
> 编写一个折半查找的模板函数binSearch()，接收一个数组，数组长度和要查找的元素key，按查找顺序输出查找过程中访问的所有元素下标。

用模板实现一下折半查找= =，坑点是要求输出查找序号。

```cpp
#include <iostream>
using namespace std;

template <class T>
int binSearch(T arr[], int n, T key)
{
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        cout << mid << endl;
        if (key == arr[mid])
            return mid;
        else if (key < arr[mid])
            high = mid - 1;
        else
            low = mid + 1;
    }
    return -1;
}

int main()
{
    int n, m;
    int key1;
    double key2;
    cin >> n >> m >> key1 >> key2;
    int* arr_int = new int[n];
    double* arr_double = new double[m];
    for (int i = 0; i < n; ++i)
        cin >> arr_int[i];
    for (int i = 0; i < m; ++i)
        cin >> arr_double[i];
    binSearch(arr_int, n, key1);
    binSearch(arr_double, m, key2);
    return 0;
}
```
## 括号匹配
> 栈的应用非常广泛。请先实现一个栈模板类（定义已在下面给出），然后利用这个栈类解决下面的问题：
> 给定一个字符串，长度小于1000，其中只包含左右括号和大小写英文字母。请编写程序判断输入的字符串里的左右括号是否全部是匹配的，匹配规则即从内到外左括号都与其右边距离最近的右括号匹配。如匹配，输出“Yes”,否则，输出“No”。

题意就这么简单= =。首先实现一个栈的模板类，然后解决一下括号匹配的问题。

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

template<class T, int MAX = 1000>
class Stack
{
private:
    T list[MAX + 1];
    int top;
public:
    Stack() {top = 0;}
    void push(const T &item)//将item压栈
    {
        list[top++] = item;
    }
    T pop()//将栈顶元素弹出栈
    {
        return list[--top];
    }
    const T & peek() const//访问栈顶元素
    {
        return list[top];
    }
    bool isEmpty() const//判断是否栈空
    {
        if (top == 0)  return true;
        else return false;
    }
};

bool judge(char a[])
{
    Stack<char> s;
    int len = strlen(a);
    for (int i = 0; i < len; i++)
    {
        if (a[i] == '(')   s.push('(');
        else if (a[i] == ')')
        {
            if (s.isEmpty()) return false;
            else s.pop();
        }
        else continue;
    }
    if (s.isEmpty()) return true;
    else return false;
}

int main(int argc, char const *argv[])
{
    char a[1010];
    while (~scanf("%s", a))
    {
        if (judge(a))    cout << "Yes" << endl;
        else cout << "No" << endl;
    }
    return 0;
}
```
# 更新日志
- 2015年07月08日 要结课啦- -，狂赶Deadline。