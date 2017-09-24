---
layout: post
title: 低成本搭建谷歌镜像
date: 2015-10-12 16:53:25
tags: [Google, CloudFlare, FuckWall, PHP]
categories: Opinion
toc: true
---

尽管自己已经搭建好了Shadowsocks等翻墙工具，但是总有一些时刻需要临时地使用Google查看一些网页，这个时候一个可用的谷歌镜像就显得很重要。本文旨在使用低成本方案来搭建一个可用的谷歌镜像服务，用以部分解决这个问题。

<!-- more -->

# 条件
你需要具备以下条件：
- 一台支持PHP的境外服务器（主机）
- 一个可用（未被墙）的域名

如果没有的话，推荐使用[Hostinger](http://api.hostinger.com.hk/redir/6395538)的免费主机并注册免费一年的`.xyz`域名。

# 搭建
> 以Hostinger为例

- 下载7ghost程序[(墙外，推荐)](https://drive.google.com/file/d/0B9QMnnRkfvWjMnhVdDVsb21qazA/view?usp=sharing)&[(墙内，密码b5te)](http://pan.baidu.com/s/1mgGkEYc)
- FTP上传至指定目录
- 使用域名进行访问

# 配置

- 访问`http://yourname.xxx/_admin`以进行管理
- 默认密码为123456，可在`\_admin\data\config.php`中自行修改
- 在需要代理的网址中填写`https://www.google.com/`
- 点击提交即可
- 现在可以访问自己的域名测试反代效果了

# 进阶

## 使用CloudFlare加速

- 登陆CloudFlare
- 点击`add site`
- 然后修改CloudFlare指定的NS服务器
- 显示为`Actived`之后即为配置完成

## 使用CloudFlare的免费SSL

- 登陆CloudFlare
- 点击`Crypto`选项卡，SSL设置中选择`Flexible`，等待几个小时后即可
- 可以选择HSTS（必须保证SSL可用，否则将无法正常访问）

## 开启全站强制HTTPS

> 由于反代加上CDN的特殊性，所以无法通过修改.htaccess或者php文件来强制使用HTTPS。不过还是有办法的，可以使用CloudFlare的Page Rules功能。

- 登陆CloudFlare
- 切换到Page Rules选项卡
- 在`Add new rule`下方的`URL pattern`中填写`http://yourname.xxx/*`
- 选中下方的`Always use https`
- 点击`Add rule`即可

## 子目录配置

> 这个是源程序中的一些BUG，好像也跟Google本身页面中的资源引用有关

*假定子目录名为`sub`*

- 登录到管理后台
- 添加内容替换，查找内容`sub/`，替换为`/`
- 点击`提交`即可

# 注意事项

- 不建议大规模进行使用，可能会被Google屏蔽或者被GFW干扰
- 建议使用垃圾域名，万一被BAN也不心疼的那种= =
- 强烈建议花点时间配置HTTPS

# 更新日志
- 2015年10月13日 初步完成
- 2015年11月05日 增加了修改密码的详细指示
- 2015年11月29日 增加了子目录的配置