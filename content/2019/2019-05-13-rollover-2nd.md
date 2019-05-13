---
categories: Daily
date: 2019-05-13T01:00:00Z
tags:
- tmux
- rime
- archlinux
- nginx
series: "Rollover Live"
title: 翻车实况第 2 期
url: /2019/05/13/rollover-2nd/
---

> 这文档里面都说过的事情，哪能算翻车！

<!--more-->

## fcitx 快捷键与 rime 冲突

从很久之前开始就隐隐感觉 fcitx 和 rime 中间有些微妙的不对付，具体现象是使用 `L Shift` 切换中英文之后会出现 rime 在中英文间疯狂切换导致无法正常输入。以前一直都是重新 Deploy 一下 rime 将就一下，直到有一天终于忍不住了，在 Archlinuxcn 的群里问了一下，[传送门](https://t.me/archlinuxcn_group/1397962)。

![](rime.png)

哦吼，有位群友指出 rime 和 fcitx 都有自己的中英文切换键，所以在默认配置下会出现快捷键的冲突。后来我按照群友的指示把 fcitx 的快捷键关掉，只用 rime 的切换（因为我只需要输入中文和英文，而且我只有 rime 这一个输入法）。

果然好了！困扰了我大半年的毛病十秒钟就被解决了= =

## tmux 2.9 配置变更

前一段时间 tmux 上了 2.9，导致 `window-status-bg`，`message-fg` 这种常用的配置参数都失效了。

tmux 的 CHANGES 文件中有提到如何迁移： <https://github.com/tmux/tmux/blob/master/CHANGES#L89-L90>

```
* The individual -fg, -bg and -attr options have been removed; they
  were superseded by -style options in tmux 1.9.
```

具体的来说就是把形如 `status-bg colour235` 的参数替换为 `status-style bg=colour235`，比如

```
set-option -g status-bg colour235
set-option -g status-fg colour136	
```

替换为：

```
set-option -g status-style fg=colour136,bg=colour235
```

我在用的主题是 [tmux-colors-solarized](https://github.com/seebi/tmux-colors-solarized)，已经有人贡献了一个修复 tmux 2.9 兼容的 [PR](https://github.com/seebi/tmux-colors-solarized/pull/23)，其他主题参考一下即可。

## go get failed

有一天用 go get 去访问托管在自建的 gitea 的时候突然发现会出现这样的报错：

```
:) go get git.xuanwo.io/let-go-mod-happy/logrus
package git.xuanwo.io/let-go-mod-happy/logrus: unrecognized import path "git.xuanwo.io/let-go-mod-happy/logrus" (https fetch: Get https://git.xuanwo.io/let-go-mod-happy/logrus?go-get=1: x509: certificate signed by unknown authority)
```

一开始感觉有点奇怪，因为浏览器访问是正常的，随后用 curl 测试了一下：

```
:) curl https://git.xuanwo.io/let-go-mod-happy/logrus -v
*   Trying xxx.xxx.xxx.xxx...
* TCP_NODELAY set
* Connected to git.xuanwo.io (xxx.xxx.xxx.xxx) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: none
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (OUT), TLS alert, unknown CA (560):
* SSL certificate problem: unable to get local issuer certificate
* Closing connection 0
curl: (60) SSL certificate problem: unable to get local issuer certificate
More details here: https://curl.haxx.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
```

emmmm，`unknown CA`，这可能跟我的 nginx 的 SSL 配置有关。检查了一下果然如此：

```
ssl_certificate /etc/nginx/certs/git.xuanwo.io/cert;
ssl_certificate_key /etc/nginx/certs/git.xuanwo.io/key;
```

我配置的证书并不是完整的链，所以导致 TLS 在握手的时候失败了，将选用的证书修改为 fullchain 即可。

```
ssl_certificate /etc/nginx/certs/git.xuanwo.io/fullchain;
ssl_certificate_key /etc/nginx/certs/git.xuanwo.io/key;
```
