title: POJ 3299 Humidex
date: 2014-07-10 23:14:26
tags: [ACM, POJ, C, 模拟]
categories: Exercise
toc: true
---
# 题目
源地址：http://poj.org/problem?id=3299

# 理解
我的理解有误。主要是看input里面都是给定T，D求H的情况，便以为这道题就是用一下公式。没想到这道题还有其他的两种情况。说明不管在怎样的条件下，看题都是至关重要的一步。还有就是在输入输出上，`%s`和`%c`的区别，值得注意。

<!-- more -->

# 代码
```
#include<stdio.h>
#include<math.h>

float getHumidex(float temperature, float dewpoint)
{
    float humidex, h, e;
    e = 6.11 * exp(5417.7530 * ((1 / 273.16) - (1 / (dewpoint + 273.16))));
    h = 0.5555 * (e - 10.0);
    humidex = temperature + h;
    return humidex;
}

float getTemperature(float dewpoint, float humidex)
{
    float temperature, h, e;
    e = 6.11 * exp(5417.7530 * ((1 / 273.16) - (1 / (dewpoint + 273.16))));
    h = 0.5555 * (e - 10.0);
    temperature = humidex - h;
    return temperature;
}

float getDewpoint(float temperature, float humidex)
{
    float dewpoint, e, h;
    h = humidex - temperature;
    e = h / 0.5555 + 10.0;
    dewpoint = 1 / ((1 / 273.16) - log(e / 6.11) / 5417.7530) - 273.16;
    return dewpoint;
}


void calculate(float *temperature, float *dewpoint, float *humidex, int digit)
{
    switch (digit)
    {
    case 3:
        *temperature = getTemperature(*dewpoint, *humidex);
        break;
    case 5:
        *dewpoint = getDewpoint(*temperature, *humidex);
        break;
    case 6:
        *humidex = getHumidex(*temperature, *dewpoint);
        break;
    }
}

int main()
{
    float temperature, dewpoint, humidex, temp;
    char ch[2];
    int count = 0, digit = 0;
    scanf("%s", ch);
    while (ch[0] != 'E')
    {
        scanf("%f", &temp);
        count = (count + 1) % 2;
        if (ch[0] == 'T')
        {
            temperature = temp;
            digit += 4;
        }
        else if (ch[0] == 'D')
        {
            dewpoint = temp;
            digit += 2;
        }
        else if (ch[0] == 'H')
        {
            humidex = temp;
            digit += 1;
        }
        if (count == 0)
        {
            calculate(&temperature, &dewpoint, &humidex, digit);
            digit = 0;
            printf("T %.1f D %.1f H %.1f\n", temperature, dewpoint, humidex);
        }

        scanf("%s", ch);
    }
    return 0;
}
```

# 更新日志
- 2014年07月10日 已AC。