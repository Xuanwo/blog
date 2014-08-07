title: 强大且配置项丰富的在线IDE应用——Cloud9
date: 2014-08-07 13:31:00
tags: [IDE, Cloud, Github]
categories: Opinion
toc: true
---
废话先不说，首先来一张大图秀一下编辑状态下的页面：
![C9的主界面](https://raw.githubusercontent.com/Xuanwo/xuanwo.github.io/master/imgs/opinion/C9-main.png)

<!-- more -->

下面转入正题，来介绍一下这个基于Node,JavaScript以及HTML5的在线IDE。

# 介绍
[Cloud9](https://github.com/ajaxorg/cloud9)是一个托管在Github下的开源项目，开源许可是GPL v3。根据官方的文档来看，C9既可以通过 <https://c9.io/> 运行，也可以安装在本地（支持Windows和Linux，理论上来说，Mac也是可以的）。当然啦，运行C9的浏览器推荐Chrome，其他的浏览器并没有测试（如果有朋友测试过了，可以反馈给我，我补充进来）。这个项目相当活跃，有能力的朋友也可以加入到开发中去。恩，简单的介绍就到这里，下面来讲一下基本的用法。

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

# 配置
TODO（配置项比较多，默认的就很OK，有空的时候再研究。）

# 更新日志
2014年08月07日  完成C9的`介绍`和简单的`用法`说明，`配置`部分有待完成。