title: POJ 1007 DNA Sorting
date: 2014-07-07 14:09:22
tags: [ACM, POJ, 排序, C]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1007

# 理解
我再一次把问题想的太复杂了，其实就是一个计算逆序数并且排序的一个过程。

<!-- more -->

# 新技能get
[快速排序](http://www.cplusplus.com/reference/cstdlib/qsort/?kw=qsort)
`void qsort (void* base, size_t num, size_t size, int (*compar)(const void*,const void*));`

# 代码
```
#include <iostream>
#include <string>
#include <cstdlib>
using namespace std;

class DNA
{
public:
    string seqDNA;
    int num;
};

int compare(const void *p1, const void *p2)
{
    return (((DNA *)p1)->num - ((DNA *)p2)->num);
}
int main()
{
    DNA *dna;
    int n, m, num, count(0);
    string listDNA;
    cin >> m >> n;
    dna = new DNA[n];
    while (count < n)
    {
        cin >> listDNA;
        num = 0;
        for (int i = 0; i < m - 1; ++i)
        {
            for (int j = i + 1; j < m; ++j)
            {
                if (listDNA.at(i) > listDNA.at(j))
                    ++num;
            }
        }
        dna[count].num = num;
        dna[count++].seqDNA = listDNA;
    }
    qsort(dna, n, sizeof(DNA), compare);
    for (int i = 0; i < n; ++i)
        cout << dna[i].seqDNA << endl;

    return 0;
}
```

# 更新日志
- 2014年07月07日 已AC。