---
categories: Daily
date: 2020-09-28T01:00:00Z
title: "在 Archlinux 上使用 Magic Keyboard"
tags:
- Archlinux
---

女朋友献祭了她的 Magic Keyboard 给我以代替噪音过大的青轴机械键盘，经过一番配置和摸索之后，我真香了（

---

## 规划

我拿到的 Magic Keyboard 是 en-US 布局的，只不过 Caps Lock 被本地化为了 `中/英`：

![](keyboard.jpg)

相比我之前的使用习惯，这个键盘有如下几个需要调教的地方：

- FnLock 默认是关闭的，这导致上面第一排的 FX 功能键映射的是对应的功能而不是 FX
- Alt(option) 和 Meta(command) 键位置是反的
- 我习惯把 CapsLock 当作另外一个 Ctrl 使用

## 调教

朴素的搜索修改 Fn 映射的话会有不少错误的答案，比如：

- `Fn + Esc`，这是大部分笔记本电脑键盘支持的配置方式，一般对应的键都会标注出来，显然的 Magic Keyboard 不支持这种方式
- Apple 官方给出的方式修改系统设置，还说如果没有的话可能键盘不是苹果产的（这键盘是苹果的，系统不是呀）
- 还有比较邪道的方式是改 `xmodmap`，这个比较容易翻车也不好调试，所以不考虑了

我摸索出来的正确方式是配置 `hid-apple` 内核模块，首先 `ls /sys/module/hid_apple/parameters` 能看到这个内核模块支持的配置：

```shell
> ls /sys/module/hid_apple/parameters
fnmode  iso_layout  swap_fn_leftctrl  swap_opt_cmd
```

这四个配置项的作用分别如下：

- fnmode: 配置 Fn 键的行为
- iso_layout: 修改键盘布局
- swap_fn_leftctrl: 将 Fn 和左侧的 Ctrl(control) 键交换位置
- swap_opt_cmd: 将 Alt(option) 和 Meta(command) 交换位置

这次会用到的主要就是 `fnmode` 和 `swap_opt_cmd` 两个配置。

### `fnmode` 配置

`fnmode` 有三个可选值，含义分别是：

- 0 = disable: `fn` + `F8` = `F8`
- 1 = fkeyslast: `F8` = 特殊功能键，`fn` + `F8` = `F8`。
- 2 = fkeysfirst: `F8` = `F8`，`fn` + `F8` = 特殊功能键

需要注意的是，如果设成了 0，那 `fn` + `Left` = `Home` 的映射也会失效，所以推荐设置成 2。

配置时首先修改运行时参数来检查（重启后失效）：

```shell
echo 2 | sudo tee /sys/module/hid_apple/parameters/fnmode
```

如果测试没有问题的话可以写入持久化的配置：

```shell
echo options hid_apple fnmode=2 | sudo tee -a /etc/modprobe.d/hid_apple.conf
```

### `swap_opt_cmd` 配置

`swap_opt_cmd` 设置为 1 后将会对调 `Alt(option)` 和 `Meta(command)` 这两个键的位置，这样就会比较符合传统键盘的习惯。

同样先修改运行时参数进行测试：

```shell
echo 1 | sudo tee /sys/module/hid_apple/parameters/swap_opt_cmd
```

测试正常的化写入持久化的配置：

```shell
echo options hid_apple swap_opt_cmd=1 | sudo tee -a /etc/modprobe.d/hid_apple.conf
```

### CapsLock as Ctrl

这是在 Xorg 的层面配置的，我直接使用了 KDE 的配置工具，此处就不赘述了。

## 自动唤醒

经过上述的调教之后这个键盘已经可以正常使用了，但是重启之后发现了一个尴尬的事实：Linux 默认配置下并不会自动连接已经配对过的蓝牙设备。这导致我在 SDDM 登录界面无法输入密码解锁，进一步的不能点击蓝牙面板的 comment 或者调用 `bluetoothctl`。

Archwiki 有相关的介绍，但是里面使用的 `hciconfig` 等工具已经弃用了，比较合理的方式是修改 `/etc/bluetooth/main.conf` 配置文件，启用 `AutoEnable`：

```conf
[Policy]
# AutoEnable defines option to enable all controllers when they are found.
# This includes adapters present on start as well as adapters that are plugged
# in later on. Defaults to 'false'.
AutoEnable=true
```

启用这个配置后 Linux 将会自动连接已经配对的设备，就不会再出现开机后无法输入密码这种尴尬的情况啦。

## 参考资料

- [Apple Keyboard](https://wiki.archlinux.org/index.php/Apple_Keyboard) 总结并整理了很多关于苹果键盘的配置
- Ubuntu 的 [AppleKeyboard](https://help.ubuntu.com/community/AppleKeyboard#Change_Function_Key_behavior) 有不少 9.04 时代的内容，但是总体上还是适用的

## 动态

- 又是一年一度的 S10 了，今年 LGD 再次进入世界赛，然而实在拉跨，被外卡吊打，很绝望
- 成功变成了 TiKV 的 Contributor，这是我参与的第一个大 Rust 项目