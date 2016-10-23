---
title: Codeforces Beta Round 6 B President's Office (Div.2 Only)
date: 2014-11-22 17:59:29
categories: Exercise
toc: true
---
# 题目
源地址：

http://codeforces.com/problemset/problem/6/B

# 理解
总统的办公室里面坐着他的副手，然后每个人都会有一张办公桌（长短不一，但每个人都有自己的颜色）。然后告诉你每个人的办公桌都是长方形，给定一个描述办公室布局的图，要你求出这个办公室里面总统的副手有几个。
一开始我想得太多，觉得应该用DFS来暴力搜索，只要判断总统办公桌的四周即可。后来发现这种方法是不可行，决定采用STL里面的pair+set来做。思路很简单，既然已经告诉我办公桌都是长方形的，那么，我只要找到总统办公桌所占的区域，然后直接遍历这块区域外围的一圈即可。

<!-- more -->

# 代码

```

#define MAXN 100+10

char c,road[MAXN][MAXN];
int n,m;
pair<int,int> lt(-1,-1);
	pair<int,int> rb(-1,-1);
	set<char> ans;

 void init()
 {
     scanf("%d %d %c", &n,&m,&c);
     for(int i=0;i<n;i++)
     {
         scanf("%s", road[i]);
     }
 }

int main(int argc, char const *argv[])
{
	init();

	for(int i=0;i<n;i++)
    {
        for(int j=0;j<m;j++)
        {
            if(road[i][j]==c)
            {
                rb=pair<int,int>(i,j);
                if(lt.first<0)  lt=pair<int,int>(i,j);
            }
        }
    }
    for(int i=lt.first;i<=rb.first;i++)
    {
        for(int j=lt.second;j<=rb.second;j++)
        {
            if(i>0&&road[i-1][j]!=c&&road[i-1][j]!='.') ans.insert(road[i-1][j]);
            if(i<n-1&&road[i+1][j]!=c&&road[i+1][j]!='.')   ans.insert(road[i+1][j]);
            if(j>0&&road[i][j-1]!=c&&road[i][j-1]!='.') ans.insert(road[i][j-1]);
            if(j<m-1&&road[i][j+1]!=c&&road[i][j+1]!='.')   ans.insert(road[i][j+1]);
        }
    }
    printf("%d", ans.size());
    return 0;
}


```

# 更新日志
- 2014年11月22日 已AC。