---
categories: Daily
date: 2019-06-13T01:00:00Z
tags:
- systemd
- archlinux
title: "从 netctl 切换 systemd-networkd"
url: /2019/06/13/switch-to-systemd-networkd/
---

晚上的时候临时起意决定把网络管理器从 `netctl` 切换到 `systemd-networkd`，切换的过程意外的顺畅。本文记录了一下切换的过程并简单介绍一下 `systemd-networkd` + `iwd` 的组合如何使用。


<!--more-->

---

## 出场人物介绍

### netctl

netctl 是 archlinux 的亲儿子，上游就在 <https://git.archlinux.org/netctl.git/>，也是除了 `systemd-networkd` 之外（这是 systemd 钦定的），唯一一个进入 base 组的网络管理工具，说是官方钦定也不为过。netcl 依赖 dhcpcd 或者 dhclient 来获取动态 IP 地址，通过 `wpa_supplicant` 来访问加密的 WiFi，提供了 `wifi-menu` 供用户在命令行下交互式地选择热点并输入密码。同时还提供了一系列的 systemd service 文件（`netctl@.service`，`netctl-ifplugd@.service`，`netctl-auto@.service`）来帮助用户进行配置，比如在开启了 `netctl-auto@<interface>.service` 之后，你的网卡就能在可选的 profile 中自动切换。

### systemd-networkd

正如它的名字所暗示的，这是 systemd 全家桶的一员。它主要负责的是检测并配置网络设备，特别的是它还能够用来配置 `systemd-nspawn` 启动的容器的网络。

### iwd

iwd (iNet wireless daemon) 是 Intel 开发，用于取代 `wpa_supplicant` 的 WiFi 后端。它的主要目标是通过不依赖任何外部库而是最大限度的利用 Linux 内核提供的功能来优化资源利用率。iwd 可以很好的跟 systemd-network 配合使用。

## 使用场景介绍

平时只需要连接 3 个 Wi-Fi：家里的，公司的，手机的，没有频繁切换/增加/修改/删除 Wi-Fi 配置的需求，所以我不需要一个常驻通知区域的服务来进行切换。此外，我的 VPN 已经全部通过 systemd 来进行管理了，所以也不需要网络管理工具替我做这些操作。我需要的是这样的一个工具组合：一个负责管理网络设备，一个负责连接 WiFi 并进行认证。之前的组合是 `netctl` + `wpa_supplicant`，现在我有了新欢：`systemd-networkd` + `iwd`。

## 如何使用

### 停用 netctl

首先需要停用 netctl 的相关服务，避免多个网络管理工具在一起打架。

```bash
:) systemctl stop netctl-auto@<interface>.service
:) systemctl disable netctl-auto@<interface>.service
```

### 配置网卡

然后按照 Wiki 的指示写无线网卡的配置，放在 `/etc/systemd/network` 下。

对无线网卡来说，最小化的配置是这样的：

```ini
[Match]
Name=wlp2s0

[Network]
DHCP=ipv4
```

- `Match` 主要是用于匹配管理的设备，可以通过设备名，MAC 地址等来选择
- `Network` 用来做网络相关的具体配置，比如 DHCP，DNS 等

我的本地开启了 coredns 作为 DNS 服务，所以我需要额外加一些配置来通过 DHCP 来获取 IPv4 地址，但是不使用 DHCP 下发的 DNS。

```ini
[Match]
Name=wlan0

[Network]
DHCP=ipv4
DNS=127.0.0.1

[DHCP]
UseDNS=false
```

> iwd 启动的时候似乎会修改网络设备的名字，我的网卡被修改成了 wlan0

在配置写好之后就可以启动 `systemd-networkd` 的服务啦：

```bash
:) systemctl start systemd-netword
```

如果修改了网络配置，只需要 restrart 即可。

更具体的配置可以参阅 ArchWiki 或者 `man systemd-networkd`。

### 配置 iwd

iwd 不是自带的软件包，所以首先需要自行安装：

```bash
:) pacman -S iwd
```

在开始使用之前，我们需要 start 并且 enable iwd 服务：

```bash
:) systemctl start iwd
:) systemctl enable iwd
```

然后就可以用 `iwctl` 进行管理啦，iwctl 默认会进入一个交互式的命令行界面，使用体验还是很赞的：

```bash
:) iwctl
[iwd]#
```

此时输入 help 会返回支持的所有命令，各个命令都比较直观，只要对 WiFi 的相关技术名词稍有了解就能很快上手，此外这个界面所有命令都支持自动补全，好评。

首先先看看我们有哪些设备：

```bash
[iwd]# device list
Devices                                   *
--------------------------------------------------------------------------------
Name                Address             Powered   Adapter   Mode
--------------------------------------------------------------------------------
wlan0               xx:xx:xx:xx:xx:xx   on        phy0      station
```

这个界面是动态的，右上角的 `*` 会不断闪烁表明这个界面是实时的。

然后我们可以手动触发一次 STA 扫描：

```bash
[iwd]# station wlan0 scan
```

之后就可以查看有哪些能连接 WiFi 热点了：

```bash
[iwd]# station wlan0 get-networks
                               Available networks                             *
--------------------------------------------------------------------------------
    Network name                    Security  Signal
--------------------------------------------------------------------------------
    CU_SNZQ                         psk       ****
    xjzy                            psk       ****
    Tenda_30BDD0                    psk       ****
    TP-LINK_D82B80                  psk       ****
    TP-LINK_lee                     psk       ****
    ziroom201                       psk       ****
    mhshome                         psk       ****
    TP-LINK_he                      psk       ****
    TP-LINK_450C                    psk       ****
    yuzhe                           psk       ****
    z212-202                        psk       ****
    Bill's Router                   psk       ****
    tcs                             psk       ****
  > XXXXXXXXXXX                     psk       ****
```

这个界面同样是动态的，可以查看当前能连接网络机器信号强度。

最后就能够选择想要连接 SSID 连接网络了，如果需要输入密码的话，iwd 还会出现一个提示要求输入密码。

```bash
[iwd]# station wlan0 connect XXXXXXXXXXX
```

这里有个需要提出来的点：iwd 通过交互式界面成功连接上网络之后，就会自动的在 `/var/lib/iwd` 下生成对应的配置文件，之后 iwd 自动的进行连接。所以一方面是不需要自己手动的去写配置文件，另一方面是切换过程也是自动的，不需要人工干预。

iwd 生成的配置文件名是有一定规则的，用 SSID 作为文件名，然后以加密方式作为后缀，比如 `*.open` 表示这是一个开放网络，`*.psk` 表示这是一个使用 PSK 加密的网络。

### 检查状态

全部配置好之后可以分别查看一下 WiFi 和网卡的状态：

```bash
:) iwctl device wlan0 show
                                 Device: wlan0
--------------------------------------------------------------------------------
  Settable  Property            Value
--------------------------------------------------------------------------------
            Name                wlan0
         *  Mode                station
         *  Powered             on
            Address             xx:xx:xx:xx:xx:xx
         *  WDS                 off
            Adapter             phy0
:) networkctl status
●        State: routable
       Address: 192.168.0.103 on wlan0
                xxxx::xxxx:xxxx:xxxx:xxxx on wlan0
       Gateway: 192.168.0.1 (TP-LINK TECHNOLOGIES CO.,LTD.) on wlan0
           DNS: 127.0.0.1
```

## 总结

systemd 真香，上交底裤我光荣！天灭 networkmanager ！

## 参考资料

- [systemd-networkd - ArchWiki](https://wiki.archlinux.org/index.php/Systemd-networkd)
- [iwd - ArchWiki](https://wiki.archlinux.org/index.php/Iwd)
