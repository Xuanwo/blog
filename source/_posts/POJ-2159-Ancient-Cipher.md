title: POJ 2159 Ancient Cipher
date: 2014-07-11 13:30:04
tags: [ACM, POJ, C/C++, 模拟, 排序]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2159

# 理解
一开始的理解是按照题目的意思，先进行一次置换加密再进行一次排列加密。置换只要按照规律一个一个替换就OK，排列加密则用到了`next_permutation`函数。两重for循环，模拟出去全部的加密方法。Coding出来之后提交，WA。然后才开始审视另外的可能性：谁说置换就一定要按照规律来？事实上，的确如此，按照题意，只需要明文和密文字符形成唯一映射就OK。如果还是按照原来的思路，这道水题还真的不水。其实，在加密过程中，有一样东西是不变的，就是各个字符（对应）出现的频率。这样想的话，就简单了，只要统计出每个字符出现的概率，sort排序后，判断两个数组是否完全一致就好～

<!-- more -->

# 代码
```
#include <iostream>
#include <cstring>
#include <algorithm>
using namespace std;

int main()
{
    int i;
    int cipher[26], clear[26];
    memset(cipher, 0, sizeof(cipher));
    memset(clear, 0, sizeof(clear));
    string in, out;
    cin >> in;
    for (i = 0; i < in.length(); i++)
    {
        cipher[in[i] - 'A']++;
    }
    cin >> out;
    for (i = 0; i < out.length(); i++)
    {
        clear[out[i] - 'A']++;
    }
    sort(cipher, cipher + 26);
    sort(clear, clear + 26);
    for (i = 0; i < 26; i++)
        if (cipher[i] != clear[i])
        {
            cout << "NO" << endl;
            return 0;
        }
    cout << "YES" << endl;
    return 0;
}
```

# 更新日志
- 2014年07月11日 已AC。