---
layout: post
title: UVa 120 Stacks of Flapjacks
date: 2014-11-4 15:19:29
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=56

# 理解
特别涨姿势的一道题。
题目不难，只要理解题目中所谓的翻转的意思，很好做。但是我在看题解的过程中，被STL的各种酷炫吓呆，感觉string类真的好好用= =。要是自己用char数组模拟的话，可能会写得各种坑。

默默记录一下：
- `istringstream iss(str);`，专门用于操作string类的一个类，可以这样用`for(int tmp; iss>>tmp; que.push_front(tmp));`。超酷炫有木有！。！
- `deque<int>::iterator it` 迭代器，方便好用不多说= =
- `reverse(Max, que.end());` 用于容器中两个元素的交换，超级好用。
- `distance(que.begin(), Max)` 返回两个迭代器之间的距离，也是相当的赞。

恩- -，好好学STL，大有前途。

<!-- more -->

# 代码

```

string str;

int main(int argc, char const *argv[])
{
    while(getline(cin,str))
    {
        cout<<str<<endl;
        istringstream iss(str);
        deque<int> que;
        for(int tmp; iss>>tmp; que.push_front(tmp));
        for(deque<int>::iterator it=que.begin(); it!=que.end(); ++it)
        {
            deque<int>::iterator Max = max_element(it, que.end());
            if(Max!=it)
            {
                if(Max != que.end()-1)
                {
                    reverse(Max, que.end());
                    cout<<distance(que.begin(), Max)+1<<' ';
                }
                reverse(it,que.end());
                cout<<distance(que.begin(),it)+1<<' ';
            }
        }
        cout<<"0\n";
    }
    return 0;
}

```

# 更新日志
- 2014年11月4日 已AC。