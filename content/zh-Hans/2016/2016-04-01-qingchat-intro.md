---
categories: Code
date: 2016-04-01T00:00:00Z
title: 微信多群直播的新探索——Qingchat
toc: true
url: /2016/04/01/qingchat-intro/
---

在我之前写过的一篇文章中，我曾经探索过类似的问题：[微信群重复人员识别](https://xuanwo.io/2016/02/28/wechat-remove/)。当初我就提出过能否自动获取相关数据，但因为种种原因的限制不了了之了。后来发现了[Mojo-Weixin](https://github.com/sjdy521/Mojo-Weixin)这个库之后，我决定在这个的基础上实现一个微信多群直播的工具——Qingchat。（*尽管在刚刚实现完不久，微信就更新了转发到多个群的功能，Sad。*）探索的成果如下： [Qingchat](https://github.com/Xuanwo/qingchat)，目前仅支持 python3 ，欢迎各位看官提 issues ，交 code ，或者拍砖。
接下来我会先介绍一下 Qingchat 的原理，然后介绍 Qingchat 的使用，最后展望一下 Qingchat 未来的发展方向。

<!--more-->

# 原理
Qingchat 基于 [Mojo-Weixin](https://github.com/sjdy521/Mojo-Weixin) 进行开发，通过调用 Mojo－Winxin 的 http 接口与微信服务器进行通信以实现群发功能。目前主要支持微信群发工作，可以从文件中读取内容，并根据内容长度设置发送延时以模拟真人输入效果。

# 用法

## 配置
想要使用Qingchat，首先需要在服务器或者本地配置好 Mojo－Weixin 环境。

### 测试&安装perl环境
除了 Windows 环境，大部门环境下已经默认预装了 perl 环境，可以通过｀perl －－version｀查看。本环境要求 perl 5.10 以上。
缺乏相关环境的，可以安装对应系统的集成包：

|平台   |推荐选择|下载地址
|-------|--------|-------------|
|Windows|1. **StrawberryPerl**<br>2. ActivePerl<br>|[StrawberryPerl下载地址](http://strawberryperl.com/)<br>[ActivePerl下载地址](http://www.activestate.com/activeperl/downloads)|
|Linux  |1. **ActivePerl**<br>2. 官方源码<br>3. yum/apt等包管理器<br>4. Mojo-ActivePerl|[ActivePerl下载地址](http://www.activestate.com/activeperl/downloads)<br>[Mojo-ActivePerl下载地址](https://github.com/sjdy521/Mojo-ActivePerl)|
|Mac    |1. **ActivePerl**|[ActivePerl下载地址](http://www.activestate.com/activeperl/downloads)｜

### 安装 Mojo::Weixin 模块

首先需要安装 cpanm 工具：
```bash
cpan -i App::cpanminus
```

然后通过 cpanm 工具安装 Mojo::Weixin

```bash
cpanm Mojo::Weixin
```

### 运行

将如下代码使用utf－8编码保存为源码文件：

```perl
#!/usr/bin/env perl
use Mojo::Weixin;
my ($host,$port,$post_api);

$host = "0.0.0.0"; #发送消息接口监听地址，修改为自己希望监听的地址
$port = 3000;      #发送消息接口监听端口，修改为自己希望监听的端口
#$post_api = 'http://xxxx';  #接收到的消息上报接口，如果不需要接收消息上报，可以删除或注释此行

my $client = Mojo::Weixin->new(log_level=>"info",ua_debug=>0,qrcode_path=>"qrcode.jpg");
$client->login();
$client->load("ShowMsg");
$client->load("Openwx",data=>{listen=>[{host=>$host,port=>$port}], post_api=>$post_api});
$client->run();
```

上述代码保存为 `test.pl` ， 并通过 perl 来运行：

```bash
perl test.pl
```

然后就会产生一个监听 3000 端口的 http 服务器。

未竟事宜可以参考[此处](https://github.com/sjdy521/Mojo-Weixin/blob/master/README.md)

### 配置Nginx

为了方便调用二维码，还需要配置一个 Web 服务器。安装Nginx，在配置文件中添加：

```
server {
	listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;

	root /path/to/your/qrcode; # 
}
```

最终，能在浏览器中以 `http://xxx.xxx.xxx.xxx/qrcode.jpg` 的形式访问到二维码即配置成功。

## 安装Qingchat

### pip

Qingchat已经上传到了pypi，只需要使用pip进行安装即可：

```bash
pip install qingchat
```

### 源码

Qingchat最新开发版代码位于： https://github.com/Xuanwo/qingchat/tree/dev

你可以使用

```bash
pip install -e git+https://github.com/Xuanwo/qingchat/tree/dev
```

或


```bash
git clone https://github.com/Xuanwo/qingchat/tree/dev
cd qingchat
python setup.py install
```

以进行安装。

## 使用

Qingchat 的使用非常简单：

### 配置

通过如下命令配置后端服务器的 ip 地址和端口：

```bash
qingchat config ip <ip>
qingchat config port <port>
```

配置文件默认会保存在`~/.config/qingchat/config.yml`。

> Win下可能需要设置`HOME`环境变量才能正常运行

### 登陆

配置完毕后，执行

```bash
qingchat config login
```

就会自动弹出一个二维码，使用微信扫描并登录后即可。如果出现问题，请再次执行此命令。

### 群发消息

```bash
qingchat group list
```

此命令可以列出你保存到通讯录中的所有群组。

```bash
qingchat group choose <group_name>
```

此命令可以将指定群组加入列表，支持正则

```bash
qingchat group clean
```

此命令可以清除列表

```bash
qingchat group send -t <content>
qingchat group send -i <media>
qingchat group send -f <file>
```

- `-t` 参数用于发送文本信息
- `-i` 参数用于发送媒体信息，图片会直接显示，其他类型将以文件形式传输
- `-f` 参数用于指定文件，逐行发送，在开头添加`!`可以发送媒体信息

# 展望

Qingchat 目前还处于开发阶段，功能不完善，BUG也很多，部署也相当麻烦。接下来，我将努力完成以下工作：

- 更好的二维码呈现机制
- 基于 Web 的图形化界面
- 支持消息上报的 Server 端
- 更多功能的实现，支持好友管理&群组管理等

# 更新日志

- 2016年04月01日 初次发布