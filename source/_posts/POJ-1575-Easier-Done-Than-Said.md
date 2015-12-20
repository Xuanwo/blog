---
title: POJ 1575 Easier Done Than Said?
date: 2014-08-03 11:54:33
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=1575

# 理解
运用三种标记，分别标记三种情况。对每一次字符读入均进行判断，一旦遇到不符合条件的，就直接退出循环。

<!-- more -->

# 代码

```

#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>

using namespace std;

char availdou[5] = "eo";
char str[30];
int words[26];

int main(int argc, char const *argv[])
{
    int vowelflag = 0;
    int douflag;
    char douch;
    int tripleflag;
    int len, i;

    for (i = 0; i < 26; i++)
    {
        if ('a' + i == 'a' || 'a' + i == 'e' || 'a' + i == 'i' || 'a' + i == 'o' || 'a' + i == 'u')
        {
            words[i] = 1;
        }

        else
        {
            words[i] = 0;
        }
    }
    while (scanf("%s", str), strcmp(str, "end") != 0)
    {
        vowelflag = 1;
        douflag = tripleflag = 0;
        douch = '\0';
        len = strlen(str);
        for (i = 0; i < len; i++)
        {
            if (words[str[i] - 'a'] == 1)
            {
                vowelflag = 0;
                if (tripleflag <= 0)
                {
                    tripleflag = 1;
                }
                else if (tripleflag <= 2)
                {
                    tripleflag ++;
                }
                //printf("%d: triple1:%d\n", i, tripleflag);
                if (tripleflag == 3)
                {
                    break;
                }
                if (douch == str[i])
                {
                    if (!(douch == 'e' || douch == 'o'))
                    {
                        douflag = 1;
                        break;
                    }
                }
                douch = str[i];
            }
            else if (words[str[i] - 'a'] == 0)
            {
                if (tripleflag >= 0)
                {
                    tripleflag = -1;
                }
                else if (tripleflag >= -2)
                {
                    tripleflag --;
                }
                if (tripleflag == -3)
                {
                    break;
                }
                if (douch == str[i])
                {
                    douflag = 1;
                    break;
                }
                douch = str[i];
            }
        }
        if (tripleflag == 3 || tripleflag == -3 || douflag || vowelflag)
        {
            printf("<%s> is not acceptable.\n", str);
        }
        else
        {
            printf("<%s> is acceptable.\n", str);
        }
    }
    return 0;
}

```

# 更新日志
- 2014年08月03日 已AC。