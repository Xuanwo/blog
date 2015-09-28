title: Codeforces Beta Round 12 A Super Agent (Div.2 Only)
date: 2014-11-21 21:44:24
tags: [ACM, Codeforces, C, 暴力]
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/12/A

# 理解
问题很简单，要求判断是不是一个中心对称的图形。
直接暴力搞，判断了六次。

<!-- more -->

# 代码

```

char a[3][3];

void init()
{
    scanf("%s", a[0]);
    scanf("%s", a[1]);
    scanf("%s", a[2]);
}

int main(int argc, char const *argv[])
{
	init();
	if(a[0][0]==a[2][2]&&a[0][1]==a[2][1]&&a[0][2]==a[2][0]&&a[1][0]==a[1][2])  printf("YES\n");
	else printf("NO\n");
	return 0;
}

```

# 更新日志
- 2014年11月21日 已AC。