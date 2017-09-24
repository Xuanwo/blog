---
layout: post
title: 超星学术视频下载处理一条龙
date: 2015-1-7 01:12:07
tags: [Software, C]
categories: Opinion
toc: true
---


我妹纸最近开始通过看超星学术视频来~~复习~~预习课程了，所以我必须搞到对应课程的所有视频（不管是收费还是免费），而且我妹纸还是一个有强迫症的萌妹纸，所有的视频都必须按照顺序拍的好好的，要不然她就会不舒服。
根据以上描述，我需要解决以下需求：

1. 破解超星学术视频的加密链接，找到真实的下载链接。
2. 重命名下载下来的视频文件。

还是跟以往一样，直接把最终的解决方案放出来，要是对具体的实现感兴趣的可以接着往下面看。

<!-- more -->

# 解决方案
[超星学术视频下载处理一条龙](http://disk.xuanwo.org/public.php?service=files&t=e0a53590668ea7605f87a056ea3db288)

---

# 破解加密链接
用到了在某宝上面购买的超星学术视频解析下载工具。
双击打开，粘贴上视频页的地址，然后点一下解析，就会这样：
![解析示意](/imgs/work/chaoxing-intro.png)
然后右击选择保存视频列表，就会自动在当前目录下生成一个用课程名字命名的txt文件，一般内容如下：

```
视频名称：透过性别看爱情
作者：沈奕斐
出处：复旦大学

透过性别看爱情（一） http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a888dc9b2f5485762f7
透过性别看爱情（二） http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a88c47ff350721a07be
透过性别看爱情（三） http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a8845f30d4554db33f3
透过性别看爱情（四） http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a88a53d9d0554a78ace

```

# 下载地址处理
软件自身的下载速度太慢，而且不支持断点续传，所以自然就想到使用旋风这样的下载工具来下载。那么问题来了，我怎么样才能把我前面得到的列表处理成可以直接创建任务的格式呢？想到了C++的freopen命令，加上字符串处理，妥妥的有木有。
思路比较简单，就不详细说明具体的实现了，直接上代码：

```

#define MAXN 10000+10

char a[MAXN][MAXN];
int i = 0;

int main(int argc, char const *argv[])
{
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    while (~scanf("%s", a[i++]))
    {
        ;
    }
    for (int j = 1; j < i; j += 2) //一定要考虑视频列表的空格分隔
    {
        cout << a[j] << endl;
    }
    return 0;
}

```
使用这个处理之后的结果就是这样

```
http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a888dc9b2f5485762f7
http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a88c47ff350721a07be
http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a8845f30d4554db33f3
http://video.superlib.com/a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a88a53d9d0554a78ace

```
根据代码很容易就能看出来，你得自己把视频名称神马的玩意儿删掉，要不然是不能得到正确结果的= =。有空的时候再来优化一下，现在先将就着用。

# 视频重命名
新的问题来了，下载到的视频全都是`a8076e683f89741b4f3b266630697ce98d21d700d106a701d45b535e52f87a88a53d9d0554a78ace`这样的格式，根本就不能区别到底是什么内容。我一开始的办法是自己手动定位，手动重命名。重复了几次之后，感觉不能忍，效率太低了，我得想想办法。
在windows的cmd中，`ren a b`命令可以把当前目录下a文件重命名为b。然后我又知道，在cpp文件中，可以通过system()函数调用cmd中的命令。于是解决方案出来了，我只要构造出一个命令的字符串就能解决这样的问题。

```

#define MAXN 500

char before[MAXN], after[MAXN];

int main(int argc, char const *argv[])
{
    freopen("in.txt", "r", stdin);
    while (~scanf("%s%s", after, before))
    {
        char order[MAXN] = "ren ";
        int lensub = strlen(before + 26); //用来清除http://video.superlib.com/这个前缀
        for (int i = 0; i < lensub; i++)
        {
            before[i] = before[i + 26]; //得到正确的文件名
        }
        before[lensub] = '\0';
        strcat(order, before); //strcat(a,b)，将字符串b接在a的后面
        int len = strlen(order);
        order[len] = ' ';
        order[len + 1] = '\0';
        strcat(order, after);
        system(order);//system("abc")，在cmd中执行abc命令
        memset(after, 0, sizeof(after));
        memset(before, 0, sizeof(before));
    }
    return 0;
}

```
就这样，轻松搞定了~。
有一个缺陷是，这样重命名出来的文件是没有后缀名的，还需要自己再处理一下。嗯哼，还是一样的，先将就着用吧，回头再来优化一下。

---

# 尾言
除了下载工具，所有代码（虽然垃圾，但还是劳动成果啊= =）都是我个人的作品，转载请注明来源。

# 更新日志
- 2015年01月07日 首次更新，首个版本发布啦。