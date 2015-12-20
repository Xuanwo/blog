---
title: UVa 1606 Amphiphilic Carbon Molecules
date: 2014-11-4 16:47:35
categories: Exercise
toc: true
---
# 题目
源地址：

http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=4481

# 理解
比赛的时候太紧张，题目都没敢读全= =。
实际上题意还是比较清楚的，给定一个平面，上面有两类点，分别用黑白来表示。现在要求要用一根直线将这个平面分成两半，在直线上面的点全都取走，问，最多能取走多少个点。
具体的方法曾经讲到过，就是扫描线算法：任取一个点为原点，建立极坐标系，其他的点使用极角排序，然后扫描来寻找最大值。
在实现的时候有两个注意点：
- atan2的计算误差不可忽略，极角排序的时候要用叉积的方法进行排序，规避精度问题。
- 叉积方法排序之前，需要做一个投射，将这个平面上的点处理到两个象限中去。

<!-- more -->

# 代码

```

#define MAXN 1000+10

int n,pn,ans,cnt,l,r,sum,num,p;

struct node
{
    int x,y,sta;
}Point[MAXN], temp[MAXN];

int detmul(const node a, const node b)
{
    return a.x*b.y-b.x*a.y;
}

bool cmp(const node a, const node b)
{
    return detmul(a,b)>0;
}

int main(int argc, char const *argv[])
{
	while(scanf("%d", &n),n)
    {
        for(int i=0;i<n;i++)
        {
            scanf("%d%d%d", &Point[i].x, &Point[i].y,&Point[i].sta);
        }
        ans=0;
        for(pn=0;pn<n;pn++)
        {
            cnt=0;
            for(int i=0;i<n;i++)
            {
                if(i==pn)   continue;
                temp[cnt].x=Point[i].x-Point[pn].x;
                temp[cnt].y=Point[i].y-Point[pn].y;
                temp[cnt].sta=Point[i].sta;
                if(temp[cnt].y<0||(temp[cnt].y==0&&temp[cnt].x<0))
                {
                    temp[cnt].x*=-1;
                    temp[cnt].y*=-1;
                    temp[cnt].sta=!temp[cnt].sta;
                }
                cnt++;
            }
            sort(temp,temp+cnt,cmp);
            l=r=sum=0;
            for(int i=0;i<cnt;i++)
            {
                if(temp[i].sta==0)  l++;
            }
            for(int i=0;i<cnt;i=p)
            {
                num=0;
                for(p=i;p<cnt;p++)
                {
                    if(detmul(temp[i],temp[p])) break;
                    if(temp[p].sta) r++;
                    else num++;
                }
                sum=max(sum,l+r+1);
                sum=max(sum,cnt-l-r+p-i+1);
                l-=num;
            }
            ans=max(ans,sum);
        }
        printf("%d\n", ans);
    }
	return 0;
}

```

# 更新日志
- 2014年11月4日 已AC。