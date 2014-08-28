title: SourceTree使用SSH连接Github
date: 2014-08-28 21:44:21
tags: [Softeware, Github]
categories: Opinion
toc: true
---
# 问题描述
使用SourceTree软件用SSH的方式来克隆Github上面的某一个库，但是始终出现Permission Denied。

# 解决方案
修改SourceTree默认的SSH客户端，使用OpenSSH来链接（仅适用于Git）。
工具->选项->一般，SSH客户端选择OpenSSH。
![SourceTree设置](http://xuanwo.qiniudn.com/opinion/sourcetree-setting.png)
SSH密钥选择之前已经生成好的SSH密钥，纯文件形式，无后缀，一般位于C:\Users\yourname\.ssh目录下。
![SourceTree密钥原则](http://xuanwo.qiniudn.com/opinion/sourcetree-ssh.png)

# 更新日志
- 2014年08月28日 完成解决方案。