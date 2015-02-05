title: POJ 2562 Primary Arithmetic
date: 2014-08-22 21:41:23
tags: [ACM, POJ, C, 高精度计算]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=2562

# 理解
高精度的模拟加法进位，数组模拟之。

<!-- more -->

# 代码
```
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
#define inf (1<<28)
using namespace std;

char num1[20];
char num2[20];

int main(int argc, char const *argv[])
{
    int add, tmp;
    int carry;
    int i, j;
    int len1, len2;

    while (scanf("%s %s", num1, num2), strcmp(num1, "0") != 0 || strcmp(num2, "0") != 0){
        getchar();
        len1 = strlen(num1);
        len2 = strlen(num2);
        for (carry = add = 0, i = len1 - 1, j = len2 - 1 ; i >= 0 && j >= 0; i--, j--){
            if ((num1[i] - '0') + (num2[j] - '0') + add >= 10){
                add = 1;
                carry ++;
            }
            else{
                add = 0;
            }
        }
        for (; i >= 0; i--){
            if (num1[i] - '0' + add >= 10){
                carry++;
                add = 1;
            }
            else {
                add = 0;
            }
        }
        for (; j >= 0; j--){
            if (num2[j] - '0' + add >= 10){
                carry++;
                add = 1;
            }
            else {
                add = 0;
            }
        }
        if (carry == 0){
            printf("No carry operation.\n");
        }
        else if (carry == 1){
            printf("1 carry operation.\n");
        }
        else{
            printf("%d carry operations.\n", carry);
        }
    }
    return 0;
}
```

# 更新日志
- 2014年08月22日 已AC。