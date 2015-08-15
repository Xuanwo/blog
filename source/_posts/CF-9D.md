title: Codeforces Beta Round 9 D How many trees? (Div.2 Only)
date: 2014-11-16 11:41:12
tags: [ACM, Codeforces, C, DP]
categories: Exercise
toc: true
---
# 题目	
源地址：

http://codeforces.com/problemset/problem/9/D

# 理解
神DP，给战斗民族的数学功底跪了。
一个二叉搜索树，要求左子树的和小于右子树，问存在多少个这样的数。由题意可以推出这样一个结论：左子树的和小于右子树，只要左子树的最大值小于右子树的最大值即可，因为2^0+2^1+2^p-1<2^p。
所以在求dp[i][j]~（dp[i][j]表示i个点组成高度小于等于j的树的总数）~的时候，有两种情况：
1. 子树的中n-1个点权在左子树，要么全在右子树，这样的话就没有条件限制了。
2. 如果左右子树都有，那么最大的肯定要放在右子树上，所以除了当前根和最大的点，其他点（总共i-2个）随便取 ,枚举左子树最多放几个,右子树最多放几个就可以推出来。
转移转移方程为：`dp[i][j]+=dp[k][j-1]*dp[i-k-1][j-1]`

<!-- more -->

# 代码
```
int n,h;
ll dp[36][36];

void init()
{
    for(int i=0; i<=35; i++) dp[0][i]=1;
    for(int i=1; i<=35; i++)
    {
        for(int j=1; j<=35; j++)
        {
            for(int k=0; k<i; k++)
            {
                dp[i][j]+=dp[k][j-1]*dp[i-k-1][j-1];
            }
        }
    }
}

int main(int argc, char const *argv[])
{
    init();
    scanf("%d%d",&n,&h);
    printf("%I64d\n",dp[n][35]-dp[n][h-1]);
    return 0;
}
```
# 更新日志
- 2014年11月16日 已AC。