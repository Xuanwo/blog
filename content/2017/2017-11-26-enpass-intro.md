---
categories: Code
date: 2017-11-26T10:07:00Z
tags:
  - Share
  - Software
  - Security
title: Enpass —— 超赞的密码管理工具
url: /2017/11/26/enpass-intro/
---

不想把自己的密码保存在 LastPass 的服务器上？羡慕 Mac 上好用的 1Password 但是自己的平台上却没有？不喜欢 Linux 密码管理工具过时的界面？ 如果你也曾经为这些问题苦恼过的话，那 [Enpass](https://www.enpass.io/) 就有可能是你的最佳之选。

<!--more-->

## 介绍

Enpass 是由一家在印度古尔冈的私人控股公司 [Sinew](https://www.sinew.io/) 推出的密码管理工具。之前在公司的内部使用，在 2011 年的时候正式面向市场推出，目前有超过 100 万用户，曾用名： Walletx 。

## 特点

### 全平台支持

- 支持 macOS，Linux，windows 三大 PC 平台
- 支持 iOS，Android，Windows Phone 等常用移动平台
- 支持 Chromebook
- 支持打包成 Portable 应用
- 浏览器插件支持 Chrome 与 Firefox

他们的浏览器插件非常好用，通过快捷键 `Ctrl+/` 自动补全用户名帐号和密码。如果有多个相符的帐号会弹出窗口供选择，如果没有找到的话同样会提供一个搜索框。比 LastPass 那个臃肿又难用的浏览器插件要好上不少，1Password 在 mac 上的体验很赞，但是无奈没有 Linux 上的版本。

### 服务器不保存用户数据

- 跨终端同步基于已有的网盘服务实现
- 如果不想把数据上传到网盘，还可以通过局域网进行同步

可以通过自己的网盘服务来同步加密后的数据库，已经支持了主流的网盘服务，比如 Google Drive，Dropbox，OneDrive，基于 WebDAV 的 ownCloud 和 Nextcloud 等等。从我实际的体验上来看，Linux 上客户端的同步交互有些问题，有时候如果代理挂了，然后它重试数次失败之后就没有办法再手动触发同步，只好重新启动应用来解决。

不在服务器端存储用户数据就避免了整天担心 LastPass 数据库被盗之类的问题，据我所知 LastPass 之前就出现过一些问题。即使从来没有出现过问题，LastPass 这么大的目标本身就会吸引黑客们的兴趣，出现数据泄漏从长期来看是必然会发生的事情。因此密码这种东西还是要自己保管来的更加安全一些。

### 其它

- AES-256 强加密
- 简单好用的密码生成工具
- 支持备份与恢复
- 支持导入导出
- iOS 客户端支持指纹解锁，支持 iOS 12 Password AutoFill
- 粘贴后自动清除剪贴板
- 失去焦点一定时间后自动锁定程序

## 缺点

- 在 Linux 平台上不支持输入法，无法输入中文，只能复制粘贴
  - Enpass 的 Linux 客户端会捆绑一个特定版本的 Qt，而且缺少了 fcitx 的支持
- 同步功能不是很稳定，同步失败之后需要重启程序来手动触发
  - 目前我的方案是直接同步到本地的文件夹，然后使用 Insync 来同步这个目录

## 收费政策

- Desktop 端不收费
- 移动端可以免费同步一定条目，可以通过支付十刀解锁（只需要支付一次，终身可用）

## 技巧

- 可以用来同步 TOTP 的验证码，完美取代 Google Authenticator
- 支持加密文件，可以用来跨平台同步自己的私钥和证书
- iOS 客户端支持 iOS 12 内置的 Password Autofill，可以在 `Settings -> Passwords & Accounts -> AutoFill Passwords` 中打开

## 总结

Enpass 适合以下人群：

- 想要尝试进行密码管理的新同学
- Linux 平台上想获得 1Password 类似体验的用户
- 想要自己保管密码库，不信任集中托管服务的用户
- 致力于统一管理自己所有数据的用户 (Like me)
