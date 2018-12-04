---
categories: Code
date: 2014-11-25T10:40:48Z
title: UVa 272 TEX Quotes
toc: true
url: /2014/11/25/UVa-272-TEX-Quotes/
---

## 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=829&page=show_problem&problem=208

# 理解
同样的，题目很简单。只需要考虑当前处理的是前面的还是后面的那个引号。

<!--more-->

# 代码

```

char a;
int flag=0;

int main(int argc, char const *argv[])
{
	while(~scanf("%c", &a))
    {
        if(a=='"')
        {
            flag++;
            if(flag%2==1)
            {
                printf("%s", "``");
            }
            else
            {
                printf("%s", "''");
            }
        }
        else
        {
            printf("%c", a);
        }
    }
	return 0;
}

```

# 更新日志
- 2014年11月25日 已AC。

