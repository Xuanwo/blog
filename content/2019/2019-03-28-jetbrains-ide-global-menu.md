---
categories: Code
date: 2019-03-28T12:00:00Z
tags:
- IDE
- Linux
- Archlinux
title: 开启 Jetbrains IDE 的全局菜单
url: /2019/03/28/jetbrains-ide-global-menu/
---

最近在想办法提升自己的开发体验，其中有一步就是去掉了不常用和已经使用快捷键代替的按钮和菜单。但是菜单栏没有办法隐藏，导致观感上不是很好。适逢 Jetbrains IDEA 推出了 2019.1 版本，趁着体验新版本功能的时候研究并解决了这个问题。

<!--more-->

## 解决方案

> 本方案应该适用于所有 Jetbrains IDE，包括 Goland 和 Android Studio

1. `Help -> Find Action... -> Experimental Features...`，确认 `linux.native.menu` 已打开
2. 安装 `libdbusmenu-glib`，比如 Arch 上只需要 `pacman -S libdbusmenu-glib`
3. 重启 IDE

---

好，在这个分割线下分享一下自己解决这个问题的全过程。

## 确认

首先问题的现象是很明显的，预期 IDEA 的菜单栏出现在 KDE 顶端的全局菜单中，但实际上并没有。

![](bug.png)

然后开始用 `IDEA`，`global menu` 等关键词去搜索，可以得到下列这些有用的信息：

- 在别人那是好的（有人 Po 出了正常的截图）
- 可以通过 `Experiment Features` 开启 `linux.native.menu` 的支持
- 在 Issue 的评论中，有人提出需要安装 `libdbusmenu-glib`

OK，现在知道问题应该出在本地可能漏了什么依赖，导致全局菜单没有生效，下面需要想办法定位到具体的问题。~~（实在定位不出来的时候再一把梭试一下）~~

## 定位

首先通过 `Help -> Find Action... -> Experiment Features` 中可以打开实验特性的开关，其中可以确认 `linux.native.menu` 已经默认开启了。（真香！）

然后查看 IDEA 的 Log，寻找全局菜单没有启用的原因。

> IDEA 的 Log 一般在 `~/.IntelliJIdea2019.1/system/log/`，也可以通过 `Help -> Show Log In Dolphin` 直接打开所在位置

```
2019-03-28 11:03:00,342 [   5755]   INFO - penapi.wm.impl.GlobalMenuLinux - disable global-menu integration because some of shared libraries isn't installed: java.lang.UnsatisfiedLinkError: /opt/intellij-idea-ultimate-edition/bin/libdbm64.so: libdbusmenu-glib.so.4: cannot open shared object file: No such file or directory
```

Ooops，原来是因为缺少一个库导致 `global-menu` 被禁用了，只需要把这个库装上就可以了。

![](happy.png)

## 修复

搜索一下哪个包提供了 `libdbusmenu-glib.so.4`：

```bash
:) yay -Fs libdbusmenu-glib.so.4
community/libdbusmenu-glib 16.04.0-3
    usr/lib/libdbusmenu-glib.so.4
```

很明显，是 `libdbusmenu-glib` （正是上面 Issue 中有人说要装的那个包），甚至还是社区源里面的包，不用犹豫了：

```bash
:) yay -S libdbusmenu-glib
```

重启 IDE 之后就能看到全局菜单正常工作啦：

![](fixed.png)

在水一篇文章之后，我还能做啥呢？给 AUR 留个言，让维护者把 `libdbusmenu-glib` 作为一个可选依赖，这样大家在安装或者更新 IDEA 的时候就知道啦：

![](comment.png)

## 参考资料

- [Support KDE Global Menu](https://youtrack.jetbrains.com/issue/IDEA-169904)
- [Global Menu in Plasma 5.9 with Java (Intellij) and Firefox](https://www.reddit.com/r/kde/comments/67mnfq/global_menu_in_plasma_59_with_java_intellij_and/)
