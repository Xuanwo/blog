title: 使用Screen管理会话
date: 2015-7-1 09:49:31
tags: [Linux, SSH, VPS]
categories: Opinion
toc: true
---
# 前言
在实现[Together项目](http://xuanwo.org/2015/06/30/together-project/)的过程中，有一个需求是需要下载一个500M左右系统镜像包，由于文件源在国内，国外的下载速度简直感人。在经历多次因为SSH超时导致下载意外终止后，我终于决定要解决掉这个问题。

<!-- more -->

# 原因
**SIGHUP 信号**
首先介绍Linux/Unix中的几个概念：
> [进程组（process group）]()：一个或多个进程的集合，每一个进程组有唯一一个进程组ID，即进程组长进程的ID。
> [会话期（session）]()：一个或多个进程组的集合，有唯一一个会话期首进程（session leader）。会话期ID为首进程的ID。
> 会话期可以有一个单独的控制终端（controlling terminal）。与控制终端连接的会话期首进程叫做控制进程（controlling process）。当前与终端交互的进程称为前台进程组。其余进程组称为后台进程组。

根据[POSIX.1](https://zh.wikipedia.org/wiki/POSIX)定义：
- 挂断信号（SIGHUP）默认的动作是终止程序。
- 当终端接口检测到网络连接断开，将挂断信号发送给控制进程（会话期首进程）。
- 如果会话期首进程终止，则该信号发送到该会话期前台进程组。
- 一个进程退出导致一个孤儿进程组中产生时，如果任意一个孤儿进程组进程处于STOP状态，发送SIGHUP和SIGCONT信号到该进程组中所有进程。

也就是说，一旦putty因为超时产生了SIGHUP信号，那么会连带着当前终端正在运行的程序全部终止。所以，只要避免SIGHUP信号的产生，就可以规避这个问题。

# Screen
简单来说，Screen是一个可以在多个进程之间多路复用一个物理终端的窗口管理器。Screen中有会话的概念，用户可以在一个screen会话中创建多个screen窗口，在每一个screen窗口中就像操作一个真实的telnet/SSH连接窗口那样。
## 安装
很多发行版会预装Screen，如果没有（比如Ubuntu），则需要自行安装，以Ubuntu为例：

```

sudo apt-get install screen

```


## 创建
### 直接创建
直接在命令行下输入

```

screen

```

之后你会看到几页字，按回车跳过之后，你就来到了一个shell的全屏窗口。你可以执行任意shell程序，就像在ssh窗口中那样。在该窗口中键入exit退出该窗口，如果这是该screen会话的唯一窗口，该screen会话退出，否则screen自动切换到前一个窗口。
### 快捷键创建新窗口
在已经激活的Screen会话下，使用快捷键`Ctrl+A`然后点击`C`，screen 在该会话内生成一个新的窗口并切换到该窗口。

## 暂时中断
screen还有更高级的功能。你可以不中断screen窗口中程序的运行而暂时断开（detach）screen会话，并在随后时间重新连接（attach）该会话，重新控制各窗口中运行的程序。例如，我们使用wget下载一个文件：
![SSH超时样例](/imgs/learn/ssh-time-out.png)
之后我们想暂时退出做点别的事情，比如出去散散步，那么在screen窗口键入`Ctrl+A`然后点击`D`，Screen会给出detached提示：
![Screen Detached](/imgs/learn/screen-detached.png)
半个小时之后回来了，找到该screen会话：

```

screen -ls

```

重新连接会话：

```

screen -r 会话ID

```

一切工作都会完全回来，区别只在于，他可能已经做好了>_<。

## 键绑定
> 你可能注意到给screen发送命令使用了特殊的键组合`Ctrl+A`。这是因为我们在键盘上键入的信息是直接发送给当前screen窗口，必须用其他方式向screen窗口管理器发出命令，默认情况下，screen接收以`Ctrl+A`开始的命令。这种命令形式在screen中叫做键绑定（key binding），`Ctrl+A`叫做命令字符（command character）。

可以通过`Ctrl+A ?`来查看所有的键绑定，常用的键绑定有：

`Ctrl+A ?` | 显示所有键绑定信息
--- | ---
`Ctrl+A w`  | 显示所有窗口列表
`Ctrl+A Ctrl+A` |切换到之前显示的窗口
`Ctrl+A c` |  创建一个新的运行shell的窗口并切换到该窗口
`Ctrl+A n`  | 切换到下一个窗口
`Ctrl+A p`  | 切换到前一个窗口(与Ctrl+A n相对)
`Ctrl+A 0..9`   | 切换到窗口0..9
`Ctrl+A a`  | 发送 Ctrl+A到当前窗口
`Ctrl+A d`  | 暂时断开screen会话
`Ctrl+A k`  | 杀掉当前窗口
`Ctrl+A [`  | 进入拷贝/回滚模式


# 参考资料
- [linux 技巧：使用 screen 管理你的远程会话](http://www.ibm.com/developerworks/cn/linux/l-cn-screen/index.html)
- [GNU Screen](http://www.gnu.org/software/screen/)
- [Screen的man page提供了最详细的信息](http://www.slac.stanford.edu/comp/unix/package/epics/extensions/iocConsole/screen.1.html)


# 更新日志
- 2015年07月01日 完成关于Screen的介绍