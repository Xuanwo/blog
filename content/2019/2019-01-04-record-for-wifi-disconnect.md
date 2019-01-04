---
categories: Code
date: 2019-01-04T12:00:00Z
tags:
- Linux
- Network
title: 记一次 WiFi 断开链接
url: /2019/01/04/record-for-wifi-disconnect/
---

今天下午的时候我的 WiFi 出现了一次时长大约为两秒的断开链接，当时正在抢回家的车票，面对突如其来的 `ERR_ADDRESS_UNREACHABLE` 感到很是愤怒，还在公司的群里问了句刚才 Office 的网络是不是闪断了一下。但是网络组的同事表示监控无异常，较真的我当时就不信了，要不是网络出问题，好端端的电脑怎么会自己断开链接呢？其实结果还真的差不离。。。

<!--more-->

## 致命华彩

网络组表示他们那边没有看出来什么问题，于是我 `journalctl -xe` 看了看，发现了一些可能有关的信息：

```bash
Jan 04 13:18:12 thinkpad-x1-carbon kernel: wlp2s0: disassociated from 06:69:6c:a9:45:6d (Reason: 8=DISASSOC_STA_HAS_LEFT)
Jan 04 13:18:12 thinkpad-x1-carbon skypeforlinux[1944]: ioctl failed for wlan0, errno = 19 (No such device)
Jan 04 13:18:12 thinkpad-x1-carbon wpa_actiond[864]: Interface 'wlp2s0' lost connection to network 'yunify-ldap'
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: authenticate with 06:69:6c:a9:45:6d
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: send auth to 06:69:6c:a9:45:6d (try 1/3)
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: authenticated
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: associate with 06:69:6c:a9:45:6d (try 1/3)
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: RX AssocResp from 06:69:6c:a9:45:6d (capab=0x1 status=0 aid=1)
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: associated
Jan 04 13:18:15 thinkpad-x1-carbon kernel: wlp2s0: Limiting TX power to 27 (30 - 3) dBm as advertised by 06:69:6c:a9:45:6d
Jan 04 13:18:15 thinkpad-x1-carbon wpa_actiond[864]: Interface 'wlp2s0' reestablished connection to network 'yunify-ldap'
```

在 13:18 分的时候突然出现了一次重连，这是为啥呢，明明我在工位上都没有动，为啥网络自己就断开了？我需要搞明白这个 `DISASSOC_STA_HAS_LEFT` 是什么意思。外事不决问 Google，简单搜索一下就能找到对这个错误的解释：

> **Reason**: Disassociated because sending STA is leaving (or has left) BSS
>
> **Explanatio**n: Operating System moved the client to another access point using non-aggressive load balancing.

emmmm，我现在问题反而更多了，`STA` 是啥，`BSS` 又是啥，`non-aggressive load balancing` 又是啥？

## 恕瑞玛的传承

### 背景知识

想要解决这些问题，需要先补充一些背景知识。

首先是耳熟能详的 `LAN`，`LAN` 是 `local area network` 的缩写，中文翻译为局域网，一般用来指有限网络。而 `WLAN` 就是 `Wireless LAN`，我们常说的无线局域网。我们日常挂在嘴边的 `Wi-Fi` 是创建于 [IEEE 802.11 标准](https://zh.wikipedia.org/wiki/IEEE_802.11) 的无线局域网技术，有时候看到的 `11b`，`11n` 就是 `IEEE 802.11` 下的不同标准。

这里的 `STA` 是 `Station` 的缩写，表示连接到无线网络中的一个设备，在这里我的电脑就是一个 `STA`。而 `AP` 则是 `Access Point` 的缩写，表示接入点，是无线网络设备中一类特殊节点，无线网络中的其他类型节点可以通过 `AP` 与无线网络的内部或者外部进行通信。

`SSID` 大家肯定都很熟悉了，其实这是 `Service Set Identifier` 的缩写。`Service Set` （服务集）是无线局域网中的一个术语，用来描述 802.11 网络中的构成单位，是一组互相关联的无线设备。服务集有着不同的种类，规范中分别定义了如下三种：

- `BSS`（基本服务设置，basic service sets）
- `IBSS`（独立基本服务设置，independent BSS）
- `ESS`（扩展服务设置，extended service sets）

其中 `IBSS` 属于对等拓扑模式，也叫做 `Ad-Hoc`，各客户端之间直接相互连接而不需要 `AP` 协助。而 `BSS` 和 `ESS` 都属于基础架构模式，所有客户端和一个或多个 `AP` 关联，各客户端间的数据传输通过 `AP` 中转，各客户端之间不直接相互通信。我们一般家庭中常用的就是 `BSS`，只有一个 `AP`，所有设备都连接到这个 `AP` 上。而在 `ESS` 中，会同时存在多个 `AP`，他们共享同一个 `ESSID`。

> 在这里补充说明一下 `ESSID` 与 `BSSID`：`SSID` 根据标识方式可以细分为两种，其中 `BSSID` 是 `AP` 的 `MAC` 地址，而 `ESSID` 是最长 32 字节区分大小写的字符串，我们常说的 `SSID` 其实就是 `ESSID`。

在同一个 `ESS` 的不同 `BSS` 中间切换的过程叫做漫游。

### 无线接入

在介绍了一些背景之后，下面需要了解一下 `WLAN` 是如何接入的。

客户端与 `AP` 之间的通信是由 `802.11 Mac` 层规定的，大致上分为三步：

- `Scan`，扫描
- `Authentication`，认证
- `Association`，关联

扫描分为主动扫描和被动扫描：我们手机打开 Wifi 界面时候通常需要等待一会儿才能显示出所有的 `SSID`，这个时候手机就是在做主动扫描，手机会在标准规定的 13 个信道中广播一个 `Probe Request Frame`，收到这个 `Frame` 的 `AP` 会根据自己的设置决定是否返回带有自己的 `SSID`，加密方式等信息的 `Probe Response`。而被动扫描则是侦听 `AP` 定时发来的 `Beacon Frame`，这个帧提供了 `AP` 和所在 `BSS` 的信息。

现在我们选择了一个 `SSID`，手机根据 `SSID` 的加密方式会通过不同的方式进行认证，这个阶段就是认证阶段。标准中定义了很多加密方式，我这里就不一一列出来了，我们最常见就是 `WPA2-PSK`。

在认证通过之后，`AP` 会向 `STA` 返回认证响应信息，这时候就会进入关联阶段。`STA` 会向 `AP` 发起关联请求，而 `AP` 则会创建一个 `Association ID` 并返回一个成功的关联响应。到了这是，`STA` 就已经成功的通过 `AP` 连入无线网络了。

在连入无线网络之后，`STA` 仍然会去侦听 `AP` 发来的 `Beacon Frame`，`STA` 根据相同 `SSID` 不同 `AP` 发来的 `Beacon Frame` 来确定哪个 `AP` 信号最强。假设当前连接的是 `AP A`，但是 `STA` 发现有个 `AP B` 跟 `AP A` 的 `SSID` 相同，但是信号更强，那么 `STA` 就会试着向 `AP B` 发送关联请求。`AP B` 在返回了关联响应之后会通过局域网来通知 `AP A`，这个 `STA` 已经被我接管了。这就是我们拿着笔记本在办公室中走来走去的过程中发生的故事。


## 虚空锁敌

好，前面铺垫了那么多，下面终于可以转入正题了。

结果就是：**我也不知道确切原因**。

首先有个技术叫做 `Client Load Balance`，思科那边称之为 `Aggressive Load Balancing`，基本思想是在 `STA` 向 `AP` 发起关联请求的时候，`AP` 根据事先设置好的负载策略（比如最大客户端数量，最大流量等）来决定接受还是拒绝请求。但是这个技术核心要点是只作用于关联阶段，只要成功连上，就不会主动断开你的连接。（有时候在人多的地方死活连不上 WiFi，但是只要连上了就一直能用，就是这么个原因。）因此我的电脑主动断开肯定不是 `AP` 的负载均衡问题。

我搜索了一下这个 `non-aggressive load balancing`，发现只有一处提到，其他的地方基本都是全文引用的。包括思科在内的多家厂商都没有提过这个次，Linux 内核里面也没有搜索到相关信息，而作者给出两个引用都已经 404 了，所以无从得知这个 `non-aggressive load balancing` 到底是怎么来的。

现在的猜想是当时信号不是很稳定，Kernel 认为自己离开了 BSS，于是断开了链接，过了一会儿收到了 Beacon 帧，于是重新连接了上去。

## 答读者问

> 搞什么嘛，研究了半天结果不还是信号不稳定，网络抖动嘛？

结果本身并不重要，重要的是我在这个过程中获得了乐趣~

> 这个不明觉历的小标题是什么意思？

他们是 LOL 中英雄的技能。

其中致命华彩是烬的 W 技能，恕瑞玛的传承是沙皇的被动技能，虚空锁敌是卡莎的 W 技能~

> 说好的日本游记呢？

在写了。

## 参考资料

- [Linux WiFi: Deauthenticated Reason Codes](https://www.aboutcher.co.uk/2012/07/linux-wifi-deauthenticated-reason-codes/)
- [wifi的基础知识及原理1](https://www.cnblogs.com/pyj63/p/8046181.html)
- [Wi-Fi](https://zh.wikipedia.org/wiki/Wi-Fi)
- [IEEE 802.11](https://zh.wikipedia.org/wiki/IEEE_802.11)
- [服务集](https://zh.wikipedia.org/wiki/%E6%9C%8D%E5%8A%A1%E9%9B%86_(%E6%97%A0%E7%BA%BF%E5%B1%80%E5%9F%9F%E7%BD%91))
- [Ad-Hoc](https://zh.wikipedia.org/wiki/%E7%84%A1%E7%B7%9A%E9%9A%A8%E6%84%8F%E7%B6%B2%E8%B7%AF)
- [Understanding the 802.11 Wireless LAN MAC frame format](https://witestlab.poly.edu/blog/802-11-wireless-lan-2/)
- [Wi-Fi MAC layer](https://devopedia.org/wi-fi-mac-layer)
- [802.11 Association process explained](https://documentation.meraki.com/MR/WiFi_Basics_and_Best_Practices/802.11_Association_process_explained)
- [Understanding Wireless Scanning](https://www.juniper.net/documentation/en_US/junos-space-apps/network-director3.1/topics/concept/wireless-scanning.html)
- [What is AP Load Balance?](https://www.draytek.com/en/faq/faq-wlan/wlan.vigorap/what-is-ap-load-balance/)
