title: 强大且配置项丰富的在线IDE应用——Cloud9
date: 2014-08-07 13:31:00
tags: [Web]
categories: Opinion
toc: true
---
废话先不说，首先来一张大图秀一下编辑状态下的页面：
![C9的主界面](//dn-xuanwo.qbox.me/opinion/C9-main.png)

<!-- more -->

下面转入正题，来介绍一下这个基于Node,JavaScript以及HTML5的在线IDE。

# 介绍
[Cloud9](https://github.com/ajaxorg/cloud9)是一个托管在Github下的开源项目，开源许可是GPL v3。根据官方的文档来看，C9既可以通过 <https://c9.io/> 运行，也可以安装在本地（支持Windows和Linux，理论上来说，Mac也是可以的）。当然啦，运行C9的浏览器推荐Chrome，其他的浏览器并没有测试（如果有朋友测试过了，可以反馈给我，我补充进来）。这个项目相当活跃，有能力的朋友也可以加入到开发中去。恩，简单的介绍就到这里，下面来讲一下基本的用法。

---

# 用法
本地端没有测试，直接使用 <https://c9.io/> 运行。

## 注册
进入主页，大大的SIGN UP，直接点进去，进入到注册页面，右边介绍了一下免费版和专业版（也就是收费版）之间的区别。
免费版拥有：
- 1 Private Workspace
- 1 FTP Workspace
- Full Shell Access and Terminal
- Unlimited Public Workspaces
- Unlimited Collaborators

专业版除了完全拥有免费版的功能之外，还有：
- 6 Private Workspaces
- Connect to your own VM
- Unlimited FTP Workspaces

看起来公司很厚道，免费版完全够用，尤其是还提供了完全的Shell权限，这一点非常重要，后面会详细讲，现在先直接Github登录。
值得一提的是，Github登录之后，C9会添加一个SSH key到Github中，并且会同步你拥有的所有库，以后可以很方便的直接添加到Workplace中，而且操作都会同步，非常赞。除了Github之外，还支持另一个使用广泛的开源平台——Bitbucket。

## 使用
注册成功后会进入Dashboard，左边是你拥有的Workplace，中间是一个简单的使用教程，最近的动态，已经绑定的服务（Github），最右边是账户设置。
下面创建一个`demo-project`，点击`start editing`，会打开一个新的编辑页面，可以自由选择想要的界面，因为之前就一直使用`Sublime`，所以这次也直接选择`Sublime`。C9支持很多语言，默认支持的就有`Node.js`，`Python`，`Ruby`，`PHP`，`Go`，更逆天的是，他还支持数据库，包括`MySQL`，`MongoDB`，`Redis`，`SQLite`。
不过，作为ACMer，更加常用的语言是C/C++，C9虽然可以识别，但是不能直接通过RUN来运行。是不是C9就不能当作一个C/C++的IDE来用呢？非也非也，这时候，C9真正的强大之处就体现出来了。其实，C9不仅仅是一个IDE，而是一个已经配置好了的虚拟机，顺便透露一下系统环境是`Ubuntu 14.04 LTS`，而且支持sudo命令。
所以，如果想要编译并且运行C/C++的代码，只需要在Shell中输入`g++ test.cpp -o test`，然后再`./test`运行可执行文件，就OK啦～（~~其实在RUN的窗口下，还支持环境的修改，不过还没有仔细研究，下次再作介绍吧。~~貌似有很多方式可以修改，包括修改build system，修改runner，修改系统环境，有空的时候再研究一下）

---

# 发现
搜罗了一些Ubuntu下显示硬件配置的命令，逐个试了一下，感觉挺有意思的，结果如下

## 硬盘空间
`Bash`中输入命令`df`查看磁盘空间，结果如下
```Size  Used Avail  Use%
1.5G  165M  1.2G   13%
```C9真心厚道，每个人给了1.5G的空间，已经够用了。
>
偷偷的曝光一件我做的不地道的事情，我单开了一个叫做test的workplace，输入命令
```sudo apt-get update
sudo apt-get install ubuntu-desktop
```经过漫长的等待之后- -，果然，空间不足了，哈哈哈。
其实我蛮好奇要是安装成功了会是什么样的，难道真的会有一个桌面跳出来？
我可以再试试别的轻量一点的桌面，恩。

## CPU配置
`Bash`中输入命令`cat /proc/cpuinfo`查看CPU配置,结果如下
```processor       : 0  //核心数从0到7，其他的全都一样
vendor_id       : GenuineIntel
cpu family      : 6
model           : 45
model name      : Intel(R) Xeon(R) CPU @ 2.60GHz
stepping        : 7
microcode       : 0x1
cpu MHz         : 2599.998
cache size      : 20480 KB
physical id     : 0
siblings        : 8
core id         : 0
cpu cores       : 8
apicid          : 0
initial apicid  : 0
fpu             : yes
fpu_exception   : yes
cpuid level     : 13
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss syscall nx pdpe1gb rdtscp lm constant_tsc nopl xtopology eagerfpu pni pclmulqdq ssse3 cx16 sse4_1 sse4_2 x2apic popcnt aes xsave avx hypervisor lahf_lm xsaveopt
bogomips        : 5199.99
clflush size    : 64
cache_alignment : 64
address sizes   : 46 bits physical, 48 bits virtual
power management:
```我了个擦，着实有点羡慕，八核的至强处理器。不过我猜应该是亚马逊或者Google的云服务器吧，而且我在用的时候没觉得有多快啊= =。


## 系统版本
`Bash`中输入命令`sudo lsb_release -a`查看系统版本,结果如下
```No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 14.04 LTS
Release:        14.04
Codename:       trusty
```果然是最新版，不知道会不会同步更新，应该是不带桌面的server版本。

---

# 应用场景
虽然Cloud9宣传的时候还是以在线的IDE为主，但是在试用的过程中，我发现C9在一些应用场景下，有着绝妙的用处。

## 配合Hexo和Git，用于管理和生成博客
Hexo一类的静态博客生成器有一个很大的问题就是，它的配置不能进行同步，以至于更换一台电脑或者电脑出了意外，基本上就要重头再来。虽然将Blog本身使用Git管理可以部分解决这个问题，但是同样要面临nodejs和git的环境配置，十分麻烦。
在有了Cloud9之后，这些问题都迎刃而解了。在C9上安装hexo（C9已经将nodejs和git配置好了，无需重新安装），配置完毕后，即可进行在线编辑。常用的电脑上，可以进行环境配置，本地编辑，deply上传，没有区别；在临时电脑上，直接登录C9，进行在线编辑即可～

## 在线的Ubuntu虚拟机
第一次玩Linux没有经验？怕把电脑弄坏？想试试某个软件或者某个命令，却不敢在本地尝试？快来C9吧，弄坏了只要把那个Workplace删掉就好，也就是说，你拥有了无限个1.5G的在线Ubuntu虚拟机！这还不够赞？

## 免费的Web服务器
自带了一个服务器的功能，可用于Demo预览，支持直接从外界进行访问。不过不建议真的把自己的应用放在那个上面，首先速度太慢了- -，其次心里过意不去。

---

# 配置
TODO（配置项比较多，默认的就很OK，有空的时候再研究。）

---

# 更新日志
- 2014年08月07日  完成C9的`介绍`和简单的`用法`说明，`配置`部分有待完成。
- 2014年08月10日  完成`发现`和`应用场景模块`，配置部分暂缓更新，等待C9官方issus的回复。