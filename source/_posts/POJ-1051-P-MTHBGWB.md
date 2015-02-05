title: POJ 1051 P,MTHBGWB
date: 2014-08-12 00:31:00
tags: [ACM, POJ, C, 字符串]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=1051

# 理解
简单的字符串转换，要有耐心= =，debug出翔。

<!-- more -->

# 代码
```
#include <stdio.h>
#include <string.h>
#define MAX 102

char str[MAX];
char code[4*MAX];
int code_len[MAX];
int cnt;
int read_cnt;
int len;

const char * dic[]={".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--..","..--","---.",".-.-","----"};

int len_of_code(char ch)
{
	if(ch-'A'<26&&ch-'A'>=0) return strlen(dic[ch-'A']);
	else return 4;
}

void addcode(char ch)
{
	int _i;
	char cache[5];
	if(ch-'A'>=0&&ch-'A'<26) strcpy(cache,dic[ch-'A']);
	else if(ch=='_') strcpy(cache,dic[26]);
	else if(ch=='.') strcpy(cache,dic[27]);
	else if(ch==',') strcpy(cache,dic[28]);
	else if(ch=='?') strcpy(cache,dic[29]);
	for(_i=0;cache[_i]!='\0';_i++)
	{
		code[cnt++]=cache[_i];
	}
}

void readcode()
{
	char cache[5];
	int _cnt;
	int _i,_j;
	for(_i=len-1;_i>=0;_i--)
	{
		_cnt=0;
		for(_j=0;_j<code_len[_i];_j++)
			cache[_cnt++]=code[read_cnt++];
		cache[_cnt]='\0';
		for(_j=0;_j<30;_j++)
			if(strcmp(cache,dic[_j])==0)
			{
				if(_j<26) printf("%c",_j+'A');
				else if(_j==26) printf("_");
				else if(_j==27) printf(".");
				else if(_j==28) printf(",");
				else printf("?");
			}
	}
}

int main(int argc, char const *argv[])
{
	int n;
	int i,j;

	scanf("%d",&n);
	for(i=0;i<n;i++)
	{
		cnt=0;read_cnt=0;
		scanf("%s",str);
		len=strlen(str);
		for(j=0;j<len;j++)
		{
			code_len[j]=len_of_code(str[j]);
			addcode(str[j]);
		}
		printf("%d: ",i+1);
		readcode();
		printf("\n");
	}
	return 0;
}
```
	
# 更新日志
- 2014年08月12日 已AC。