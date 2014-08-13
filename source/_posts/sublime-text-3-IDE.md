title: Sublime Text 3 化身为高大上的C/C++ IDE
date: 2014-06-05 23:00:00
tags: [software, C/C++]
categories: Opinion
toc: true
---

# 前言
我是一只有着小小的强迫症的苦逼菜鸟，敲代码追求一个爽快。原来一直在用Code::Blocks，虽然说是用C++开发的，效率很高，但是每次启动的时候总是要盯着它不怎么样的启动页看很久，不开心= =。这两天开始接触Sublime Text，顿时被迷住了，不管不顾的决定把它改造成一个狂霸酷拽屌的IDE，所以，走你～～

<!--  more -->
----------


# 安装
以下均为Sublime Text 3 3059版 更新于17 December 2013
### OS X
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059.dmg](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059.dmg)
### Windows 32 bit
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059%20Setup.exe](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059%20Setup.exe)
### Windows 64 bit
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059%20x64%20Setup.exe](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203059%20x64%20Setup.exe)
### Ubuntu 32 bit
[http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_i386.deb](http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_i386.deb)
### Ubuntu 64 bit
[http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_amd64.deb](http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3059_amd64.deb)


----------


# 运行环境
以MinGW为例，其他编译系统类似
## 下载安装MinGW
有被墙的风险，如果不能访问，请在某管，某三的软件管家中搜索MinGW
[http://sourceforge.net/projects/mingw/files/](http://sourceforge.net/projects/mingw/files/)
## 添加系统环境变量
默认条件下是`C:/MinGW/bin`，如果不是请自行修改，将其添加到PATH之后，记得不要忘记分号。如果不知道如何修改系统环境变量，请参考[http://www.java.com/zh_CN/download/help/path.xml](http://www.java.com/zh_CN/download/help/path.xml "如何设置或更改 PATH 系统变量？")

运行CMD(开始-> 运行-> Cmd)，输入：mingw-get后则会运行MinGW界面，这里说明变量设置成功。然后输入：g++ -v，用于检测安装g++有没有成功。
## 建立新的编译系统
Tools –> Build System –> New Build System
### Windows下
在打开的页面中粘贴以下代码

    {
     "cmd": ["g++", "${file}", "-o", "${file_path}/${file_base_name}"],
     "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
     "working_dir": "${file_path}",
     "selector": "source.c, source.c++",
     "shell": true,
     "encoding":"cp936",
     "variants":
     [
          {
               "name": "Run",
                  "cmd": ["start", "cmd", "/c", "${file_base_name} & echo. & pause"]
          }
     ]
    }

保存，并且取一个自己喜欢的名字，在`Tools->Build System`中选择即可。

如果复制出现问题，请访问[https://gist.github.com/Xuanwo/0cb4bce76929ed764daf](https://gist.github.com/Xuanwo/0cb4bce76929ed764daf)

### Linux下
在打开的页面中粘贴以下代码
```
{
    "cmd": ["g++", "${file}", "-o", "${file_path}/${file_base_name}"],
    "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
    "working_dir": "${file_path}",
    "selector": "source.c, source.c++",
    "variants":
    [
        {
            "name": "Run",
            "cmd":["gnome-terminal", "-x", "bash", "-c", "g++ '${file}' -o '${file_path}/${file_base_name}' && '${file_path}/${file_base_name}' ;read -n1 -p 'press any key to continue.'"]
        }
    ]
}
```
保存，并且取一个自己喜欢的名字，在`Tools->Build System`中选择即可。

如果复制出现问题，请访问[https://gist.github.com/Xuanwo/31ac95e82d446db37c2e](https://gist.github.com/Xuanwo/31ac95e82d446db37c2e)

## 收工
一个简单的IDE已经构建完毕了，下面可以进行一些简单的测试。

编译并构建`Ctrl+B`
运行`Ctrl+shift+B`


----------


# 配置
## 界面
### 字体、主题风格等设置
当需要更改主题时，直接可以通过`Preferences —> Color Scheme`来设置，主界面上只能改变字体的大小。若需要改变字体和字体大小，可以先`Preferences —> Browse Packages`，找到`Default`文件夹，然后找到`Preferences.sublime-settings`这个文件，用Sublime Text 3打开这个文件，这个文件保存了一些常用的设置，比如字体、主题风格、是否显示行号、智能提示延迟时间等，可以根据自己的需要自行设置。
### 打开（关闭）侧边栏、右边缩略图等常用面板
默认情况下Sublime Text 3是没有打开侧边栏文件浏览器的，可以通过`View`来打开和关闭侧边栏，默认情况下Sublime Text 3右边是有文件的缩略图的，可以通过`View`来打开和关闭缩略图。
### 快捷键寻找文件和已定义的函数
在Sublime Text 3中可以非常快速地切换到想找的文件，只需要通过`Ctrl+P`打开切换面板即可。然后输入想找的文件名称就可以快速找切换到该文件了。如果想要找函数，可以通过输入`@+函数名`可以快速切换到定义该函数的文件。
## 插件
### Package Control
*必装的插件，没有它，有了它可以很方便的安装和管理其他的插件。*

使用快捷键`ctrl+反斜杠`或者 `View -> Show Console`打开命令行，粘贴以下代码：

    import urllib.request,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)

如果复制出现问题，请访问[https://gist.github.com/Xuanwo/fd4e4388099536bcdd65](https://gist.github.com/Xuanwo/fd4e4388099536bcdd65)
###ConvertToUTF8
*此插件可以有效的解决中文乱码问题*

`Ctrl+P`打开切换面板，输入`PackageControl`回车，打开包管理。输入或者点击`install`进入安装页面，等待片刻后，在新弹出的窗口中输入`ConvertToUTF8`，点击它便开始自动下载安装。

如果出现乱码，只要在`File`里面找到`Encoding`并选择合适的编码模式即可，快捷键`Ctrl+Shift+C`。
###AStyleFormatter
*Sublime Text 3下的C/C++代码整理工具，好像还支持java*

`Ctrl+P`打开切换面板，输入`PackageControl`回车，打开包管理。输入或者点击`install`进入安装页面，等待片刻后，在新弹出的窗口中输入`AStyleFormatter`，点击它便开始自动下载安装。

使用时只要在代码编辑页面右击，选择`AStyleFormatter->Format`即可,快捷键为`Ctrl+Shift+F`。


----------


# 尾言
出于个人喜好，没有附带汉化以及破解教程。

毕竟是用来敲代码的，软件本身是英文的还是中文的其实影响不大，所以费尽心思折腾汉化没有什么意思。此外，支持正版从我做起，ST的作者并没有刻意的进行反盗版处理，使用一些简单的汇编工具就可以进行破解，但是出于对作者的尊重，我没有这样做。因为就算是未破解版也不过是跳出一个提示窗口而已，功能完全没有阉割，已经非常厚道了。总之，求汉化，求破解的人可以去Google看看，这里是不会有了。

本文仓促完工，如果有不正确的地方请在下方评论窗口指出，谢谢。


----------


# 更新日志

 - 2014年06月05日 写完全文，观察效果，并发布
 - 2014年07月03日 博客迁移至Hexo，做细节调整
 - 2014年08月08日 添加了Sublime在Linux下的`.buildsystem`代码