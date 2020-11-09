---
categories: Daily
date: 2020-11-09T01:00:00Z
title: "记一次二进制乱起名字引发的翻车"
tags:
- golang
- archlinux
---

在某次日常 `Syu` 之后，我的 archlinux 难得的翻车了——重启之后进入了 BIOS 的锁屏介面：

![](bios_lock.jpg)

第一直觉是自己的 EFI 被搞没了，于是一边在群里悲报，一边在家里找能用的 U 盘当 Archiso。硬盘挂载好，`arch-chroot` 进入，然后 `bootctl` 一看状态：

![](bootctl.jpg)

噫，我的 `vmlinuxz` 和 `initramfs` 都没了，恐怕是内核更新之后 hook 没有更新成功。虽然还是想不太清楚原因，但是当时重新安装一遍内核之后就好了

```
yay -U /var/cache/pacman/pkg/linux-zen-x.x.x.zen1-1-x86_64.pkg.tar.zst
```

此事过去之后数天，又是一次内核更新，这次我留神注意了一下，果然 hook 执行失败了：

```bash
:) sudo pacman -S linux-zen
[sudo] password for xuanwo:
warning: linux-zen-5.9.4.zen1-1 is up to date -- reinstalling
resolving dependencies...
looking for conflicting packages...

Package (1)      Old Version   New Version   Net Change

extra/linux-zen  5.9.4.zen1-1  5.9.4.zen1-1    0.00 MiB

Total Installed Size:  82.48 MiB
Net Upgrade Size:       0.00 MiB

:: Proceed with installation? [Y/n]
(1/1) checking keys in keyring                                                                                      [#####################################################################] 100%
(1/1) checking package integrity                                                                                    [#####################################################################] 100%
(1/1) loading package files                                                                                         [#####################################################################] 100%
(1/1) checking for file conflicts                                                                                   [#####################################################################] 100%
(1/1) checking available disk space                                                                                 [#####################################################################] 100%
:: Processing package changes...
(1/1) reinstalling linux-zen                                                                                        [#####################################################################] 100%
:: Running post-transaction hooks...
(1/4) Arming ConditionNeedsUpdate...
(2/4) Updating module dependencies...
(3/4) Updating linux initcpios...
2020/11/07 13:41:58 open go.mod: open go.mod: no such file or directory
error: command failed to execute correctly
(4/4) Cleaning pacman cache...
==> no candidate packages found for pruning
sudo pacman -S linux-zen  6.04s user 0.75s system 66% cpu 10.217 total
```

为什么在内核更新的时候冒出来一个 `open go.mod`？掏出 `strace` 看看到底发生了什么：

```bash
[pid 347882] readlinkat(AT_FDCWD, "/proc/self/exe", "/home/xuanwo/Code/go/bin/install", 128) = 32
[pid 347882] fcntl(0, F_GETFL)          = 0x2 (flags O_RDWR)
[pid 347883] <... nanosleep resumed>NULL) = 0
[pid 347882] futex(0xc000080148, FUTEX_WAKE_PRIVATE, 1 <unfinished ...>
[pid 347883] nanosleep({tv_sec=0, tv_nsec=20000},  <unfinished ...>
[pid 347886] <... futex resumed>)       = 0
[pid 347882] <... futex resumed>)       = 1
[pid 347886] nanosleep({tv_sec=0, tv_nsec=3000},  <unfinished ...>
[pid 347882] mmap(NULL, 262144, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7fc077f0d000
[pid 347882] fcntl(1, F_GETFL <unfinished ...>
[pid 347883] <... nanosleep resumed>NULL) = 0
[pid 347882] <... fcntl resumed>)       = 0x2 (flags O_RDWR)
[pid 347886] <... nanosleep resumed>NULL) = 0
[pid 347883] nanosleep({tv_sec=0, tv_nsec=20000},  <unfinished ...>
[pid 347886] futex(0xc00003c948, FUTEX_WAKE_PRIVATE, 1 <unfinished ...>
[pid 347882] fcntl(2, F_GETFL <unfinished ...>
[pid 347886] <... futex resumed>)       = 1
[pid 347885] <... futex resumed>)       = 0
[pid 347882] <... fcntl resumed>)       = 0x2 (flags O_RDWR)
[pid 347886] futex(0xc000080148, FUTEX_WAIT_PRIVATE, 0, NULL <unfinished ...>
[pid 347885] futex(0xc00003c948, FUTEX_WAIT_PRIVATE, 0, NULL <unfinished ...>
[pid 347882] openat(AT_FDCWD, "go.mod", O_RDONLY|O_CLOEXEC <unfinished ...>
```

我勒个去。。

---

所以完整的故事是这样的：

我之前做某个项目的时候将生成的二进制命名为 `install`，然而这个命令跟 `coreutils` 包中携带的二进制 `install` 冲突了，于是更新系统的时候出现各种诡异状况：

- 内核更新无法执行 hook 以构建 initramfs
- 更新 aur 包的时候无法 install
- ...


二进制的名字真的不能随便起（

## 动态

- 我知道我毒奶了，LPL 再次在主场输给了韩国战队（
- 美国大选终于结束了，拜登当选，川普败选
- 天津来暖气了（