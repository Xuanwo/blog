title: POJ 1018 Communication System
date: 2014-07-12 13:06:29
tags: [ACM, POJ, C/C++, 剪枝, 枚举, Sublime-Text]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1018

# 理解
题意比较清晰，就是找出最大的B/sum(P)，要求网络设备的性价比最高。采用枚举的方法，把所有情况都列出来，然后有些明显不需要考虑的情况，可以直接舍去。

<!-- more -->

# 新技能get
`Sublime-Text`在C++模式下输入main+回车可以直接完成符合C++11的代码，点个赞

# 代码
```
#include <iostream>  
#include <algorithm>  
#include <iomanip>  
#include <cstring>
using namespace std;  
  
class info  
{  
public:  
    int B;  
    double P;    
    int id; 
};  
  
int cmp(const void* a,const void* b)  
{  
    info* x=(info*)a;  
    info* y=(info*)b;  
  
    if((x->B)==(y->B))   
    {  
        if((x->P)==(y->P))   
            return (x->id)-(y->id);     
  
        return (x->P)-(y->P);  
    }  
  
    return (x->B)-(y->B);   
}  
  
double max(double a,double b)  
{  
    return a>b?a:b;  
}  
  
int main(int argc, char const *argv[], int i, int j)
{  
    int test;  
    cin>>test;  
    for(int t=1;t<=test;t++)  
    {  
        int n;   
        int m=0;  
        cin>>n;  
  
        int* MaxB=new int[n+1];  
        info* dev=new info[100*100+1];      
  
        int pd=0;  
  
       
  
          
        for(i=1;i<=n;i++)  
        {  
            int mi;  
            cin>>mi;  
            m+=mi;  
  
            MaxB[i]=-1;  
            for(j=1;j<=mi;j++)  
            {  
                pd++;  
                cin>>dev[pd].B>>dev[pd].P;  
                dev[pd].id=i;  
  
                MaxB[i]=max(MaxB[i],dev[pd].B);  
            }  
        }  
  
       
  
        qsort(dev,m+1,sizeof(info),cmp);  
  
       
  
        bool flag=false;  
        double ans=0;  
        for(i=1;i<=m-(n-1);i++)   
        {                          
            bool* vist=new bool[n+1];  
            memset(vist,false,sizeof(bool)*(n+1));  
  
            vist[ dev[i].id ]=true;  
            double price=dev[i].P;  
            int count=1;     
  
            for(j=i+1;j<=m;j++)  
            {  
                if(vist[ dev[j].id ])  
                    continue;  
  
                if(dev[i].B > MaxB[ dev[j].id ])   
                {  
                    flag=true;   
                    break;       
                }  
  
                vist[ dev[j].id ]=true;  
                price+=dev[j].P;  
                count++;  
            }  
            if(flag || count<n)  
                break;  
  
            ans=max(ans,(dev[i].B/price));  
        }  
  
        cout<<fixed<<setprecision(3)<<ans<<endl;  
  
        delete MaxB;  
        delete dev;  
    }  
    return 0;  
}  
```

# 更新日志
- 2014年07月12日 已AC。