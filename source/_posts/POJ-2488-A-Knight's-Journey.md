title: POJ 2488 A Knight's Journey
date: 2014-07-12 19:59:14
tags: [ACM, POJ, C, DFS]
categories: Exercise
toc: true
---
# 题目
源地址：

http://poj.org/problem?id=2488

# 理解
一开始没看懂，看了几遍之后才明白。是给定一个p*q的棋盘，要求计算出是否存在可能性使得骑士走遍整个棋盘，并要求按照字典序排列。这个字典序真的是要我的命，直接导致挂了很多次，还傻傻地去群里面问这道题是不是Special Judge= =。

<!-- more -->

# 新技能get
字典序 `lexicographically`

# 代码
```
#include <iostream>
#include <cstring>
using namespace std;  
  
typedef class  
{  
    public:  
        int row;  
        char col;  
}location;  
  
int p,q;   
          
bool chess['Z'+1][27];  
  
int x,y;  
void path(int i,int j,int num)  
{                              
    switch(num)  
    {  
        case 1: {x=i-1; y=j-2; break;}       
        case 2: {x=i+1; y=j-2; break;}    
        case 3: {x=i-2; y=j-1; break;}    
        case 4: {x=i+2; y=j-1; break;}  
        case 5: {x=i-2; y=j+1; break;}  
        case 6: {x=i+2; y=j+1; break;}  
        case 7: {x=i-1; y=j+2; break;}  
        case 8: {x=i+1; y=j+2; break;}  
    }  
    return;  
}  
  
bool DFS(location* way,int i,int j,int step)  
{  
    chess[i][j]=true;  
    way[step].row=i;  
    way[step].col=j;  
    if(step==way[0].row)  
        return true;  
  
    for(int k=1;k<=8;k++)  
    {  
        path(i,j,k);  
        int ii=x,jj=y;  
        if(!chess[ii][jj] && ii>=1 && ii<=p && jj>='A' && jj<='A'+q-1)  
            if(DFS(way,ii,jj,step+1))  
                return true;  
    }  
      
    chess[i][j]=false;  
    return false;       
}  
  
int main(int argc, char const *argv[])
{  
    int test;  
    cin>>test;  
    int t=1;  
    while(t<=test)  
    {  

  
        memset(chess,false,sizeof(chess));  
  
        cin>>p>>q;  
        if(p==1 && q==1)     
        {  
            cout<<"Scenario #"<<t++<<':'<<endl;  
            cout<<"A1"<<endl<<endl;  
            continue;  
        }  
        if(p*q>26 || p>=9 || q>=9 || p<=2 || q<=2)       
        {  
            cout<<"Scenario #"<<t++<<':'<<endl;  
            cout<<"impossible"<<endl<<endl;  
            continue;  
        }  
          
        location* way=new location[p*q+1];  
        way[0].row=p*q; 
        bool flag=false;  
        for(int j='A';j<='A'+q-1;j++)  
        {  
            for(int i=1;i<=p;i++)  
                if(DFS(way,i,j,1))  
                {  
                    cout<<"Scenario #"<<t++<<':'<<endl;  
                      
                    for(int k=1;k<=way[0].row;k++)  
                        cout<<way[k].col<<way[k].row;  
                    cout<<endl<<endl;  
                    flag=true;  
                    break;  
                }  
                if(flag)  
                    break;  
        }  
  
        if(!flag)  
        {  
            cout<<"Scenario #"<<t++<<':'<<endl;  
            cout<<"impossible"<<endl<<endl;  
        }  
    }  
    return 0;  
}  
```

# 更新日志
- 2014年07月12日 已AC。