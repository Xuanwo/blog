---
categories: Opinion
date: 2018-10-30T12:20:00Z
tags:
- Archlinux
- Systemd
title: Systemd 的一些小技巧
url: /2018/10/30/tips-of-systemd/
---

> 我就是累死，写脚本写到吐，我也绝对不换 `底裤D`！
>
> `底裤D` 真香！

<!--more-->

---

现在 systemd 正在日益的变成一个 Linux 内核与发行版之间的一个兼容层，systemd 向下管理了诸多底层组件，向上提供了一致的接口和 API。而作为一个 Arch 用户，更是一边各个群中大喊 `systemd 真香`，一边乖乖的把自己的底裤交给了 systemd，由此戏称为 `底裤D`。

今天主要就是分享一些自己平时用到的一些 systemd 的小技巧，备忘（

## 管理自己的 VPN

因为现在正在做的一个项目同时支持公有云和私有云的部署，因此就有很多的 VPN，难道要到每个 VPN 的目录下面手动执行 openvpn 么，答案当然是否定的，主要的弊端有以下几点：

- 最显然的一点：麻烦，每次都切换过去，然后手动执行 openvpn，想想就觉得特别蠢
- VPN 数量多了之后不好维护
  - 不知道某个 vpn 开没开
  - 不知道某个 vpn 是不是成功的起来了
  - 后台运行的情况下 log 查起来也很麻烦，特别是在某些 VPN 的路由有冲突的时候
- 让指定的 VPN 开机启动还需要单独写一个脚本

当然可以写一个 VPN 管理工具啦，但是何必呢，systemd 已经都帮我们做好啦~

只要写一个 `service` 文件，并放在 `/etc/systemd/system` 下：

```ini
[Unit]
Description=OpenVPN tunnel for %I
After=syslog.target network-online.target
Wants=network-online.target
Documentation=man:openvpn(8)
Documentation=https://community.openvpn.net/openvpn/wiki/Openvpn24ManPage
Documentation=https://community.openvpn.net/openvpn/wiki/HOWTO

[Service]
Type=notify
PrivateTmp=true
WorkingDirectory=/etc/openvpn/xuanwo/%i
ExecStart=/usr/bin/openvpn --suppress-timestamps --nobind --config config.ovpn
CapabilityBoundingSet=CAP_IPC_LOCK CAP_NET_ADMIN CAP_NET_RAW CAP_SETGID CAP_SETUID CAP_SYS_CHROOT CAP_DAC_OVERRIDE
LimitNPROC=10
DeviceAllow=/dev/null rw
DeviceAllow=/dev/net/tun rw
ProtectSystem=true
KillMode=process

[Install]
WantedBy=multi-user.target
```

这个文件基本上是 Copy 自 `openvpn-client@.service`，根据我实际的情况做了一些改动：

```diff
--- a/usr/lib/systemd/system/openvpn-client@.service
+++ b/usr/lib/systemd/system/vpn@.service
@@ -9,14 +9,13 @@ Documentation=https://community.openvpn.net/openvpn/wiki/HOWTO
 [Service]
 Type=notify
 PrivateTmp=true
-WorkingDirectory=/etc/openvpn/client
-ExecStart=/usr/bin/openvpn --suppress-timestamps --nobind --config %i.conf
+WorkingDirectory=/etc/openvpn/xuanwo/%i
+ExecStart=/usr/bin/openvpn --suppress-timestamps --nobind --config config.ovpn
 CapabilityBoundingSet=CAP_IPC_LOCK CAP_NET_ADMIN CAP_NET_RAW CAP_SETGID CAP_SETUID CAP_SYS_CHROOT CAP_DAC_OVERRIDE
 LimitNPROC=10
 DeviceAllow=/dev/null rw
 DeviceAllow=/dev/net/tun rw
 ProtectSystem=true
-ProtectHome=true
 KillMode=process

 [Install]
```

这是与源文件的 diff，我针对不同的地方稍微介绍一下：

- `%i` 是 systemd 中的一个替换标记，表示 `已转义的实例名称。对于实例化的单元，就是 "@" 和后缀之间的部分。`，比如 `systemctl start vpn@abc`，这个 `%i` 就会被替换成 `abc`。更多选项可以在参考中查阅。
- 原来的配置文件都是指向一个独立的文件，但是我的 VPN 都会按照文件夹组织起来，所以我把工作目录修改为每个 vpn 独立的目录，并且读取目录下的配置文件 `config.ovpn`
- `ProtectHome=true` 表示 `表示对该单元屏蔽 /home, /root, /run/user 目录(内容为空且不可写入)`，此处我知道并且信任这个服务，而且我的 `/etc/openvpn/xuanwo` 实际上是一个到 `/home/xuanwo/Google/VPN/` 的软链接，我需要它访问 `/home` ，因此我去掉了这个配置。

除此以外，我还配置了两个 systemctl 相关的 alias：

```bash
alias sys='sudo systemctl'
alias sus='systemctl --user'
```

最后的效果是这样的：

- 我的所有 VPN 配置都放在 `/home/xuanwo/Google/VPN` 下并自动加密后同步到 Google Drive
- 每个 VPN 都是一个独立的目录，每个目录下都有这个 vpn 需要的所有文件
  - 特别的，一些需要密码的 vpn 可以在 `config.ovpn` 中配置 `auth-user-pass passwd`，并在当前目录下创建一个 `passwd` 文件，内容为两行，第一行是用户名，第二行是密码，这样就可以免交互启动 VPN 了。*当然了，这样做会导致 VPN 的安全性有所下降，请根据自己的实际情况配置。*
- 所有的 vpn 都有了它对应的 service，因此可以做所有 service 支持的操作，比如 start 来启动，stop 来关闭，enable 来设置为开机启动
- 不过现在 systemd 好像没有什么办法能查看指定模板下所有 service 的状态，我一般是用 `sys status | grep vpn` 这样来查看（又不是不能用.png）
- 当然也有了 `journald` 的支持，我们可以用 `journalctl -u vpn@abc -r` 来查看这个 vpn 近期的日志

## 限制某个 Service 的内存用量

Systemd 底层使用了 `cgroup` 来控制和管理所有的服务，因此我们同样获得了控制服务所使用的内存占用的能力。

只需要在 Serivce 的配置文件中增加一行即可：

```ini
MemoryHigh=512M
```

这里有一些可以选择的配置项：

> - `MemoryLow`: 尽可能保障该单元中的进程至少可以使用多少内存。如果该单元及其所有父单元的内存用量都低于最低保障线，那么只要还可以从其他未受保护的单元回收内存， 就不会回收该单元占用的内存。
> - `MemoryHigh`: 尽可能限制该单元中的进程最多可以使用多少内存。虽然这是一个允许被突破的柔性限制，但是突破限制后，进程的运行速度将会大打折扣， 并且系统将会尽可能尽快回收超出的内存。
> - `MemoryMax`: 绝对刚性的限制该单元中的进程最多可以使用多少内存。 这是一个不允许突破的刚性限制，触碰此限制会导致进程由于内存不足而被强制杀死。

比如说我们可以这样来限制 `telegram` 的内存使用量（telegram 真垃圾，一个内存泄漏问题至今修不好）：

```ini
[Unit]
Description=Telegram

[Service]
Type=simple
ExecStart=/usr/bin/telegram-desktop -- %u
KillMode=process
Restart=on-abnormal
RestartSec=2
MemoryHigh=512M

[Install]
WantedBy=multi-user.target
```

我们可以覆盖应用自带的 desktop 文件，让它总是通过 systemd 来启动应用：

```desktop
[Desktop Entry]
Version=1.0
Name=Telegram Desktop
Comment=Official desktop version of Telegram messaging app
Exec=systemctl --user start telegram.service
Icon=telegram
Terminal=false
StartupWMClass=TelegramDesktop
Type=Application
Categories=Network;InstantMessaging;Qt;
MimeType=x-scheme-handler/tg;
```

只要把这个文件命名为 `telegramdesktop.desktop` 并放在 `~/.local/share/applications` 目录下，我们的启动器就会总是使用这个文件，无缝集成~

看起来非常美好，然而并没有什么卵用，因为 systemd 这里的实现有问题，主要是以下的几个原因：

- cgroup v1 无法确保非特权进程安全的使用资源控制器，所以 systemd 用户实例无法使用 cgroup v1，也就是说 systemd 的用户实例无法通过配置 `MemoryHigh=512M` 来实现资源控制
- 如果使用系统实例的话，会有如下两个问题
  - 需要额外配置：`Environment=DISPLAY=:0`，否则图形化界面不会正确展示
  - 运行一个普通应用要输入 sudo 密码，感觉非常蛋疼
- 如果做一个勇士，通过内核参数设置 `systemd.unified_cgroup_hierarchy` 来强制启用 cgroup v2，那么你会面对如下问题：
  - docker 啥的全崩了，因为 runc 还不支持 cgroups v2，参见[这个 issue](https://github.com/opencontainers/runc/issues/654) ，从社区反馈来看，感觉还遥遥无期
  - systemd 的 cgroup v2 的资源控制实现有问题，并不能正常工作，参见[这个 issue](https://github.com/systemd/systemd/issues/9887)，我补充了一些复现的 case，然而并没有什么反馈

> 虽说暂时还用不上，但是先记录一下，万一修好了呢~

## 为指定的 Service 设置环境变量

这个就比较简单啦，总有一些应用自己不提供代理的配置，我们可以通过 systemd 来启动它并为它设置专门的环境变量：

```ini
Environment=no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com" http_proxy=http://127.0.0.1:1090 https_proxy=http://127.0.0.1:1090
```

> 说的就是你，Skype！

## 解决关机时等待 stop job 的问题

关机的时候总会遇到这种问题：

> `A stop job is running for Session xxx of user yyy`

这一般是因为 systemd 给某个服务发送 kill 之后，那个服务没有正确退出，因此 systemd 会等待一段时间，直到 timeout 之后，直接给它发送 `kill -9` 来强制关闭。这个时候我们首先要查看 systemd 的相关 log 来定位问题到底出在哪里：

```bash
journalctl -b -1 -r
```

`-b` 参数表示显示开机至今的日志，而后面跟上 `-1` 表示偏差值为一，`-r` 表示逆序显示，连在一起就是逆序展示上次开机的日志。

接下来我们需要耐心的查看一下日志，每个人启用的服务和系统的状况都不一样，要根据实际的情况来判断，比如我这边关闭失败的日志是这样的：

```
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: Stopped Skype.
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: Failed with result 'timeout'.
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: Main process exited, code=killed, status=9/KILL
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: Killing process 22768 (D-Bus thread) with signal SIGKILL.
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: Killing process 22001 (TaskSchedulerFo) with signal SIGKILL.
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: Killing process 1478 (skypeforlinux) with signal SIGKILL.
Oct 29 23:14:57 thinkpad-x1-carbon systemd[547]: skype.service: State 'stop-sigterm' timed out. Killing.
Oct 29 23:13:26 thinkpad-x1-carbon systemd[547]: Stopping Skype...
```

我们可以看到在等待了 90s 之后，systemd 强行关闭了 skype。后来发现是我的 service 文件写的不太对，KillMode 被错误的设置成了 `control-group`，将这个问题修复之后，这个问题搞定了。

有时候有些服务的实现上会有问题，导致没有正确关闭，我们在确定 `kill -9` 没有问题的前提下，可以将它的 timeout 时间设置的更短一些，比如：`TimeoutStopSec=1s`。

## 参考

- [可以用在单元文件中的替换标记](http://www.jinbuguo.com/systemd/systemd.unit.html#%E6%9B%BF%E6%8D%A2%E6%A0%87%E8%AE%B0)
- [systemd.resource-control](http://www.jinbuguo.com/systemd/systemd.resource-control.html)
- [KillMode](http://www.jinbuguo.com/systemd/systemd.kill.html#KillMode=)
- [timesyncd can't stop](https://www.reddit.com/r/archlinux/comments/4bawf7/a_stop_job_is_running_for_session_c2_of_user/d187683/)

## 动态

- 关于 S8 世界总决赛
  - 气死了，RNG 八强被淘汰，丢人。
  - 尽力了，EDG 八强被淘汰，明年再来。
  - 太强了，iG 成功进入总决赛，加油！
- 关于游戏
  - 荒野大镖客 2 已经出来了，然而我还在苦苦守候着我的皇牌空战 = =
  - 传送门骑士真的是垃圾游戏，打个一级的小怪都会卡一下，千万不要玩
- 关于动漫
  - [刀剑神域 Alicization](https://www.bilibili.com/bangumi/play/ss25510/) 画质炸裂，诚意满满，强烈推荐！
  - [青春猪头少年不会梦到兔女郎学姐](https://www.bilibili.com/bangumi/play/ss25733/) 男主各种神级操作，一定要认真学习，我笔记已经记了好几本了。
  - [弦音 -风舞高中弓道部-](https://www.bilibili.com/bangumi/play/ss25696/) 我知道你们想说什么 - -，但是弓道真的好帅啊，运动番，运动番
- 关于阅读
  - 金庸先生走了哎，感觉 20 世纪真的逐步远去，**他**可能也快要走了
  - 重读[时代的稻草人](https://book.douban.com/subject/20499536/)，大学毕业一年多，我的精英意识已经完全被现实消磨光了，高中的时候满脑子社会变革，自我批判，要做时代的守望者，现在想起来居然觉得有些羞耻
  - 我们 Team 买了一本[万物皆数](https://www.amazon.cn/dp/B07GJ6H3X3)，挺有意思的，社会精英当不了，搞搞纯粹理性的东西是不是会更快乐一些
