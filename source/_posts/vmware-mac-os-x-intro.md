title: 史上最详细的虚拟机安装Mac OS X图文教程
date: 2015-8-9 01:30:51
tags: [虚拟化, Mac]
categories: Opinion
toc: true
---
# 前言
最近在电脑上配置了VMware，想要搭建一个Mac OS X的虚拟机以供体验。不过网上的资料过于老旧，版本更新不及时，导致我在配置的过程中遇到了无数的坑，折腾了一个晚上才配置成功。事后我总结了相关的经验和实践完成了这份教程，希望能够对大家有所益处~

> Update:
> 因为要用到[Vagrant](https://xuanwo.org/2015/10/22/vagrant-intro/)，所以又捣鼓了一番在VirtualBox上安装Mac OS X，同样踩了不少坑，相关的总结如下。

<!-- more -->

# 需要准备的东西

## 懒人包镜像
- [OS X 10.10 懒人包镜像](http://xuanwo.qiniudn.com/Soft/Yosemite%20Install-14A389.cdr)
- [OS X 10.11 懒人包镜像](http://xuanwo.qiniudn.com/Soft/EI%20Capitan%2010.11%20Install.cdr)

## 基于Vmware
- [VMware 11.1.1](http://pan.baidu.com/s/1mgAazK8)
- [Unlocker](http://pan.baidu.com/s/1i3nLNXr)

## 基于VirtualBox
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

# 虚拟机环境配置

## 配置VMware
### 安装并激活VMware
首先自然是安装好VMware，然后是一串奇怪的字符序列：`1F04Z-6D111-7Z029-AV0Q4-3AEH8`，我也不知道怎么用（>.<）。

### 使用Unlocker解锁VMware

> VMware Workstation并不支持Mac OS X的安装，只有VMware Fusion（也就是Mac平台上的VMware）才支持。于是有大神推出了这个解锁补丁，安装好这个补丁之后，VMware便可以支持OS X 的虚拟机安装。

下载并解压Unlocker，右击使用管理员权限打开`win-install.cmd`，当任务执行完毕后，窗口会自动退出。
![运行Unlocker](/imgs/opinion/vmware-unlocker.png)

这时候再打开VMware，你将会看到`Apple Mac OX X`的字样，说明你已经成功解锁了Mac OS X的安装功能。
![可以选择Apple Mac OS X了](/imgs/opinion/vmware-apple-appear.png)

## 基于Vmware配置Mac OS X虚拟机

### 启动新建虚拟机向导
没啥好说的，选择`典型`。
![配置类型选择](/imgs/opinion/vmware-apple-1.png)

### 安装客户机操作系统
因为我们还需要一些特别的配置，所以这里我们选择`稍后安装操作系统`。
![安装客户机操作系统](/imgs/opinion/vmware-apple-2.png)

### 选择客户机操作系统
这里我们选择`Apple Mac OS X`，版本就选择最新的`OS X 10.10`，其实这个版本对我们的安装没啥大的影响，主要是涉及到一些硬件兼容性的问题，无须在意。
![选择客户机操作系统](/imgs/opinion/vmware-apple-3.png)

### 命名虚拟机
在这里我们需要设定虚拟机的名称以及位置，这里就按照自己的喜好设定吧。
![命名虚拟机](/imgs/opinion/vmware-apple-4.png)

### 指定磁盘容量
这里我们需要指定Mac虚拟机最大占用的空间大小，VMware推荐的是40G，如果空间够的话，可以设置的更大一些。然后下面的设置可以根据自己的喜好来，如果对性能比较注重，可以使用存储为单个文件的方式。
![指定磁盘容量](/imgs/opinion/vmware-apple-5.png)

### 开始创建虚拟机
到这里，Mac虚拟机的一些简单设置就已经全部完成了，点击完成，我们进入到下一个阶段。
![开始创建虚拟机](/imgs/opinion/vmware-apple-6.png)

### 虚拟机故障排除
**选择cdr镜像**
在新弹出的页面中选择`编辑虚拟机设置`，然后点击`CD/DVD(SATA)`
![虚拟机设置](/imgs/opinion/vmware-error-1.png)
选择`浏览`，在弹出的`浏览ISO映像`中，点击右下角的`CD-ROM 映像(.iso)`，切换成`所有文件`，然后就可以正常打开我们的cdr镜像了。
![切换所有文件](/imgs/opinion/vmware-error-2.png)

**修复无法正常引导**
即使前面的操作全部正确，我们依然无法正常启动我们的虚拟机。为了可以正常引导，我们还需要修改我们虚拟机的vmx文件。
进入我们之前设定的虚拟机位置，在文件夹中可以找到`xxxxx.vmx`这样的文件，右击选择打开方式，使用记事本打开。在`smc.present = "TRUE"`后面添加`smc.version = 0`，保存之后退出，便可以解决。

## 配置VirtualBox

### 安装VirtualBox
安装没有什么坑点，一路Next即可

### Hack一下VirtualBox
VirtualBox原生支持Mac OS X的安装，但是只有在系统环境为Mac的环境下，才能正常引导，因为在非Mac环境下，安装程序会检测出我们的CPU不是已经识别的型号，从而拒绝进一步的安装。为此，我们需要执行以下命令来Hack：

```bash
VBoxManage setextradata "yourvboxname" "VBoxInternal/Devices/smc/0/Config/DeviceKey" "ourhardworkbythesewordsguardedpleasedontsteal(c)AppleComputerInc"
```

*如果VBoxManage没有被加入PATH的话，可能会提示VBoxManage不是可执行的命令。只需要进入VirtualBox的安装目录下`Shift+右键`在当前目录打开命令行执行即可~*

原理非常简单：利用VBox的命令行工具在虚拟机的DeviceKey中加入Apple的声明即可。理论上来讲，这应该是侵犯苹果权益的行为，所以请不要用于商业行为，后果自负~

# 开始安装Mac OS X
经过如上配置之后，我们终于可以进入到Mac OS X的安装界面了~

## 加载界面
首先附上酷炫的加载界面，我们什么都不用做，静静地等到它加载完成即可。
![加载界面](/imgs/opinion/apple-install-1.png)

## 语言选择
然后是语言选择界面，选择自己喜欢的语言吧，不想折腾自己的话就老老实实简体中文吧~
![语言选择](/imgs/opinion/apple-install-2.png)

## 硬盘分区
安装之前，我们必须要对磁盘进行分区。首先我们点击安装界面最上方的`实用工具`，然后选择`磁盘工具`，进入分区管理界面。
![选择实用工具](/imgs/opinion/apple-install-3.png)
我们首先点击左侧列出的磁盘，然后在右侧选择`分区`，空间也不大，选择一个分区即可。可以自己设定这个磁盘的名字，格式化类型默认即可，无需改动。
![选择分区](/imgs/opinion/apple-install-4.png)
配置完成后，我们点击左上角红色的叉叉退出磁盘工具，点击继续，开始我们的安装。
![正式开始安装](/imgs/opinion/apple-install-5.png)

## 许可协议
作为一家有操守的大公司，该推的锅肯定是要推干净，于是有了这份许可协议。还有一个二次确认，如果拒绝，安装就结束了= =，不过反正是虚拟机，我们一路同意即可。
![阅读许可协议](/imgs/opinion/apple-install-6.png)

## 选择安装磁盘
这里我们需要选择前面已经设定好的磁盘，选中之后点击继续即可。
![选择安装磁盘](/imgs/opinion/apple-install-7.png)

## 默默等待
然后就到了真正的安装过程了，这个过程中我们需要做的只有等待。出去溜达两圈，或者搓一把炉石？
![等待安装完成](/imgs/opinion/apple-install-8.png)

# 坑点总结
## 使用DMG镜像提取
网上的教程大多是使用DMG镜像提取，需要用到UltraISO这款软件。但是不知道是否为版本差异还是我下载的镜像有问题，我每次试图提取出安装镜像的时候，都出现了进度超过100%，剩余时间为负的情况。尝试了大概四五个镜像以及多个UltraISO版本均宣告失败。

## VMX文件修改
在VMX文件未修改的情况下，VMware无法正常加载相关的镜像，这也是一个非常恼人的坑点。所以在新建完虚拟机之后一定要记得修改VMX文件，当然也可以被坑了一次之后再来修改，233。

# 更新日志
- 2015年08月09日 初步完成教程
- 2015年10月31日 更换懒人包下载链接，请在页面上直接点击~
- 2015年11月02日 加入了VirtualBox的相关配置
- 2015年11月03日 修复了镜像链接错误，新增了10.11的懒人包镜像