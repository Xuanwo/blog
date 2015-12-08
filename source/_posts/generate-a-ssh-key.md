---
title: 使用Github SSH Key以免去Hexo部署时输入密码
date: 2015-2-7 14:40:16
tags: [Hexo, Github-Pages, Blog]
categories: Opinion
toc: true
---
# 前言
原文本来放在[Hexo常见问题解决方案](http://xuanwo.org/2014/08/14/hexo-usual-problem/)之中，但是由于步骤较多，理解起来比较困难，因此将本文独立出来单独成篇，以便于进行操作。

<!-- more -->

# 操作

## 修改_config.yml
将_config.yml的git信息修改为SSH形式。

## 列出已存在的SSH Key
打开Git Bash，并且输入：
`ls -al ~/.ssh`
这个命令会列出你`.ssh`账户中已经存在的SSH key，如果之前没有设置过，一般都是没有。

## 生成密钥
然后输入：
`ssh-keygen -t rsa -C "your_email@example.com"`
这个命令将会生成一个以`your_email@example.com`为标签的ssh key，然后bash中会显示：

```

Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/you/.ssh/id_rsa): [Press enter]

```

直接回车，然后出现：

```

Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]

```

因为追求操作方便，我们不打算在deploy的时候输入这个`passphrase`，所以直接回车两次设为空。然后你会看到：

```

Your identification has been saved in ~/.ssh/id_rsa.
Your public key has been saved in ~/.ssh/id_rsa.pub.
The key fingerprint is:
01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@example.com

```

## 加入SSH Agent
下一步输入：
`ssh-agent -s`
如果出现类似`Agent pid XXXX`这样的字样，则跳过下一步，否则输入：

```

eval `ssh-agent -s`

```

直到出现`Agent pid XXXX`这样的提示之后，输入：
`ssh-add ~/.ssh/id_rsa`
这样，你成功的在本地生成了一个可用的SSH key。

## 将SSH Key添加到Github中
下面将这个key添加到github网站。
打开[https://github.com/settings/ssh](https://github.com/settings/ssh)，点击`Add SSH Key`，复制`id_rsa.pub`中的所有内容到`Key`框中，在`Title`框中输入方便自己记忆的名字（建议输入能让自己明白是哪台电脑的名字，方便以后管理）。
当网页显示添加成功后，就已经完成了全部的操作。
下面进行一些测试，同样是打开Git Bash，输入：
`ssh -T git@github.com`
bash中会显示如下字样：

```

The authenticity of host 'github.com (207.97.227.239)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?

```

输入yes之后，计算机会自动将`github.com`列入已知的host，然后会出现如下提示：

```

Hi username! You've successfully authenticated, but GitHub does not
provide shell access.

```

如果成功看见，说明你已经配置好了，快去享受爽快的hexo一键部署吧；
如果出现任何错误提示，请仔细检查自己的操作，或者将错误信息发给我。

# 更新日志
- 2015年02月07日 独立成篇。
- 2015年02月16日 补充`_config.yml`的修改。
- 2015年03月22日 修复了一处代码显示BUG。