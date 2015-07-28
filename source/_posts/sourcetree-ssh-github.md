title: SourceTree使用SSH连接Github
date: 2014-08-28 21:44:21
tags: [Software, Github]
categories: Opinion
toc: true
---
# 问题描述
使用`SourceTree`软件用SSH的方式来克隆`Github`上面的某一个库，但是始终出现`Permission Denied`。

# 解决方案
修改`SourceTree`默认的SSH客户端，使用`OpenSSH`来链接（仅适用于Git）。
工具->选项->一般，SSH客户端选择`OpenSSH`。
![SourceTree设置](http://xuanwo.qiniudn.com/opinion/sourcetree-setting.png)
SSH密钥选择之前已经生成好的SSH密钥，纯文件形式，无后缀，一般位于`C:\Users\yourname\.ssh`目录下。
![SourceTree密钥原则](http://xuanwo.qiniudn.com/opinion/sourcetree-ssh.png)

# 更新日志
- 2014年08月28日 完成解决方案。