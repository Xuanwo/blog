title: Sublime Text 3 化身为高大上的C/C++ IDE
date: 2014-06-05 23:00:00
tags: [Software, C]
categories: Opinion
toc: true
---

# 前言
我是一只有着小小的强迫症的苦逼菜鸟，敲代码追求一个爽快。原来一直在用Code::Blocks，虽然说是用C++开发的，效率很高，但是每次启动的时候总是要盯着它不怎么样的启动页看很久，不开心= =。这两天开始接触Sublime Text，顿时被迷住了，不管不顾的决定把它改造成一个狂霸酷拽屌的IDE，所以，走你～～

<!-- more -->

# 安装
以下均为Sublime Text 3 3083版 更新于26 March 2015

### OS X
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083.dmg](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083.dmg)

### Windows 32 bit
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203080%20Setup.exe](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083%20Setup.exe)

### Windows 64 bit
[http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203080%20x64%20Setup.exe](http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083%20x64%20Setup.exe)

### Ubuntu 32 bit
[http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3080_i386.deb](http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3083_i386.deb)

### Ubuntu 64 bit
[http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3080_amd64.deb](http://c758482.r82.cf2.rackcdn.com/sublime-text_build-3083_amd64.deb)

# ChangeLog

## Build 3083
Release Date: 26 March 2015
```
    * Fixed high CPU usage caused by a corrupt index. This was occuring for some users upgrading from 3065
    * Added setting index_workers to control the number of threads used for file indexing. By default the number of threads is based on the number of CPU cores. By setting index_workers to 1 or 2, indexing will be slower, but less intrusive
    * Fixed a crash when showing the Command Palette with an empty .sublime-build file
    * Tab completion no longer completes numbers. Edit/Show Completions can still be used for this
```

## Build 3080
Release Date: 24 March 2015
```
    * Fixed Redo sometimes restoring the selection to the incorrect location
    * Reworked how Build Systems are selected (More Information)
    * Build Systems may now declare "keyfiles" (e.g., 'Makefile' for the Make build system) to better auto detect which build system to use
    * Improved handling of build systems that generate lots of output
    * New windows always use the automatic build system, rather than the build system of the last used window
    * Command Palette now remembers the last entered string
    * Improved change detection for files that disappear and reappear, as happens with disconnected network drives
    * atomic_save is disabled by default
    * Right clicking on a URL will show an "Open URL" menu item
    * Added Goto Definition to the context menu
    * Improved behavior of Goto Definition when using multiple panes
    * Misspelled words can now be added to the dictionary, in addition to being ignored
    * Fixed Ignored Words not persisting after exiting
    * Fixed a long standing issue with spell checking and non-ascii characters
    * Added spelling_selector setting, to control what text is checked for misspellings
    * Tweaked handling of syntax definitions and unused captures, resolving an issue with spell checking in Markdown links.
    * Goto Anything supports :line:col syntax in addition to :line
    * Added Edit Project to the Command palette
    * Improved quote auto pairing logic
    * Added <current file> option to Find in Files
    * Improved Console Panel scrolling behavior
    * .tmLanguage files may contain a hidden setting, to indicate they shouldn't be displayed to the user
    * Improved some error messages when parsing .tmLanguage files
    * remember_open_files setting is now defaults to false. Note that this change will have no effect if the hot_exit setting is left at its default value of true
    * Added auto_complete_cycle setting
    * Fixed Minimap refusing to draw on very large windows
    * Fixed not being able to click on the selected row of the auto complete popup
    * Fixed sidebar icons sometimes being invisible on startup
    * Transient sheets (e.g., as created by Goto Anything when previewing files) are no longer added to the Recently Closed list
    * Improved scrolling behavior when line_padding_top is > 0
    * Fixed a bug with scrolling tabs, where a 1 pixel line would occasionally appear underneath them
    * Fixed tabset background being set to the wrong color on startup if different colored tabs are used
    * Updated to a never version of leveldb, fixing constant low level CPU usage if the index becomes corrupted
    * Fixed a crash that could occur when directories are being rapidly deleted and recreated
    * Fixed a crash that occurred when dragging rows scrolled out of view in the side bar
    * Fixed a long standing plugin_host crash triggered via modal dialogs
    * Fixed a typo in the "Save Workspace As" dialog
    * Fixed incorrect menu mnemonics
    * Linux: Added sudo save
    * Windows: Popup windows are able to receive scroll wheel input
    * Windows: subl.exe command line helper accepts wildcards
    * Windows: Fixed access denied errors that could occur when saving with atomic_save disabled
    * Windows: Added workaround for broken std::condition_variable in MSVC 2012, fixing a crash in plugin_host
    * Windows: Added more descriptive errors when the Update Installer fails to rename a folder
    * Windows: Fixed incorrect window sizing after making a maximised window full screen
    * OSX: Added work around for performActionForItemAtIndex: taking an excessively long time in Yosemite. This affected any commands that had a corresponding menu item.
    * OSX: Workaround for an OS issue with zero size windows and OpenGL views
    * OSX: subl command line tool no longer uses Distributed Objects, resolving some intermittent failures
    * Posix: Fixed new files not respecting the umask permission flags
    * API: Added View.show_popup() and related functions
    * API: Added sublime.yes_no_cancel_dialog()
    * API: Added sublime.expand_variables()
    * API: Added Window.extract_variables()
    * API: Added Sheet.view()
    * API: Window.show_quick_panel() now accepts the flag sublime.KEEP_OPEN_ON_FOCUS_LOST
    * API: Window.show_quick_panel() will now scroll to the selected item when shown
    * API: Fixed on_post_window_command() not getting called
```

## Build 3065
Release Date: 27 August 2014
```
    * Added sidebar icons
    * Added sidebar loading indicators
    * Sidebar remembers which folders are expanded
    * Tweaked window closing behavior when pressing ctrl+w / cmd+w
    * Improved quote auto pairing logic 
    * Selected group is now stored in the session
    * Added remember_full_screen setting
    * Fixed a lockup when transitioning from a blinking to a solid caret
    * Fixed a crash in plugin_host
    * Fixed a crash triggered by Goto Anything cloning views
    * Windows: Added command line helper, subl.exe
    * OSX: Added 'New Window' entry to dock menu
    * Posix: Using correct permissions for newly created files and folders
    * API: Updated to Python 3.3.3
```

## Build 3059
Release Date: 17 December 2013
```
    * Added tab scrolling, controlled by the enable_tab_scrolling setting
    * Added image preview when opening images
    * Encoding and line endings can be displayed in the status bar with the show_encoding and show_line_endings settings
    * Added settings caret_extra_top, caret_extra_bottom and caret_extra_width to control the caret size
    * Added index_exclude_patterns setting to control which files get indexed
    * Automatically closing windows when the last tab is dragged out
    * Changed tab close behavior: the neighboring tab is now always selected
    * When the last file is closed, a new transient file is created automatically
    * Ctrl+Tab ordering is stored in the session
    * Added minimap_scroll_to_clicked_text setting
    * Improved error messages when unable to save files
    * Auto complete now works as expected in macros
    * Minor improvements to Python syntax highlighting
    * Vintage: A block caret is now used
    * Vintage: Improved behavior of visual line mode with word wrapped lines
    * Find in Files will no longer block when FIFOs are encountered
    * Linux: Added menu hiding
    * Linux: Fixed incorrect handling of double clicks in the Find panel
    * Linux: Fixed incorrect underscore display in some menus
    * Posix: Fixed new files being created with unexpected permissions
    * Windows: SSE support is no longer required for 32 bit builds
    * API: Window.open_file now accepts an optional group parameter
    * API: Plugins may now call Settings.clear_on_change() within a callback from Settings.add_on_change()
    * API: Calling Settings.add_on_change() from within a settings change callback won't cause the added callback to be run
```
## Build 3047
Release Date: 27 June 2013
```
    * Beta is now open to non-registered users
    * Windows and Linux: Added High DPI support
    * Improved file change detection
    * Improved rendering performance
    * HTML tag auto completion is better behaved in script tags
    * Fixed a crash on exit that could occur when hot_exit is disabled
    * Linux and OSX: atomic_save is adaptively disabled when it's not possible to preserve file permissions
    * OSX: Fixed context menus not working when the application is in the background
    * Windows: Auto updater supports updating from unicode paths
    * API: Plugins in zip files are able to be overridden via files on disk
    * API: Added support for the termios module on Linux and OS X
    * API: Fixed Selection.contains
    * API: Fixed settings objects getting invalidated too early with cloned views
```
## Build 3033
Release Date: 7 May 2013
```
    * New auto update system for Windows and OS X
    * Previewing a file from the side bar will no longer add an entry to the OPEN FILES section of the side bar
    * Added Paste from History
    * Added setting 'auto_find_in_selection', for S2 style Find in Selection logic
    * Find panel has a drop down arrow to select previous items
    * Pressing right in the Goto Anything overlay will open the selected file without closing the overlay
    * Fixed several crash bugs
    * Further startup time improvements
    * Improved HTML completions when typing outside of tags
    * Fixed Close Tag not respecting self closing tags
    * PHP: Improved auto indenting for the alternative control syntax
    * Added setting always_prompt_for_file_reload
    * Improved handling of deleted files when restoring sessions
    * Deleting a file via the side bar will first close the corresponding view, if any
    * "Remove all Folders from Project" now prompts to confirm
    * Added telemetry. Telemetry is disabled by default, but can be turned on with the enable_telemetry setting
    * Using Google Breakpad to automatically report crashes
    * Updated syntax highlighting for PHP, Haskell and Pascal
    * Symlinks are followed by default in folders added to the side bar
    * Windows: Fixed erroneous entries in system menu
    * Windows: New style Open Folder dialogs are used on Vista and later
    * API: Significantly improved communication speed with plugin_host
    * API: Added view.close()
    * API: Added view.show_popup_menu()
    * API: Added is_valid() method to view and window, to determine if the handle has been invalidated
    * API: Added on_post_text_command and on_post_window_command
    * API: on_text_command and on_window command are now called when the menu is used
    * API: Added sublime.get_macro()
    * API: view.substr(point) now has the same semantics as S2 for out of bounds addresses
    * API: view.command_history(0, True) now returns the last modifying command, as expected
```

# 运行环境

## Windows下
`以MinGW为例，其他编译系统类似`

### 下载安装MinGW
有被墙的风险，如果不能访问，请在某管，某三的软件管家中搜索MinGW
[http://sourceforge.net/projects/mingw/files/](http://sourceforge.net/projects/mingw/files/)

### 添加系统环境变量
默认条件下是`C:/MinGW/bin`，如果不是请自行修改，将其添加到PATH之后，记得不要忘记分号。如果不知道如何修改系统环境变量，请参考[http://www.java.com/zh_CN/download/help/path.xml](http://www.java.com/zh_CN/download/help/path.xml "如何设置或更改 PATH 系统变量？")

运行CMD(开始-> 运行-> Cmd)，输入：mingw-get后则会运行MinGW界面，这里说明变量设置成功。然后输入：g++ -v，用于检测安装g++有没有成功。

### 建立新的编译系统
`Tools –> Build System –> New Build System`
在打开的页面中粘贴以下代码
```
{
 "cmd": ["g++", "${file}", "-std=c++11", "-o", "${file_path}/${file_base_name}", "&", "start", "cmd", "/c", "${file_base_name} & echo. & pause"],
 "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
 "working_dir": "${file_path}",
 "selector": "source.c, source.c++",
 "shell": true,
 "encoding":"cp936",
}
```
保存，并且取一个自己喜欢的名字，在`Tools->Build System`中选择即可。

如果复制出现问题，请访问[https://gist.github.com/Xuanwo/0cb4bce76929ed764daf](https://gist.github.com/Xuanwo/0cb4bce76929ed764daf)

## Linux下
``以Ubuntu为例，系统不同请自行修改终端参数。``
建立新的编译系统
`Tools –> Build System –> New Build System`
在打开的页面中粘贴以下代码
```
{
    "cmd": ["g++", "${file}", "-o", "${file_path}/${file_base_name}", "&", "gnome-terminal", "-x", "bash", "-c", "g++ '${file}' -o '${file_path}/${file_base_name}' && '${file_path}/${file_base_name}' ;read -n1 -p 'press any key to continue.'"],
    "file_regex": "^(..[^:]*):([0-9]+):?([0-9]+)?:? (.*)$",
    "working_dir": "${file_path}",
    "selector": "source.c, source.c++",
}
```
保存，并且取一个自己喜欢的名字，在`Tools->Build System`中选择即可。

如果复制出现问题，请访问[https://gist.github.com/Xuanwo/31ac95e82d446db37c2e](https://gist.github.com/Xuanwo/31ac95e82d446db37c2e)

## 收工
一个简单的IDE已经构建完毕了，下面可以进行一些简单的测试。

编译并运行`Ctrl+B`

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
*必装的插件，有了它可以很方便的安装和管理其他的插件。*

使用快捷键`ctrl+反斜杠`或者 `View -> Show Console`打开命令行，粘贴以下代码：
```
import urllib.request,os,hashlib; h = 'eb2297e1a458f27d836c04bb0cbaf282' + 'd0e7a3098092775ccb37ca9d6b2e4b7d'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```
如果复制出现问题，请访问[https://gist.github.com/Xuanwo/fd4e4388099536bcdd65](https://gist.github.com/Xuanwo/fd4e4388099536bcdd65)

### ConvertToUTF8
*此插件可以有效的解决中文乱码问题*

`Ctrl+P`打开切换面板，输入`PackageControl`回车，打开包管理。输入或者点击`install`进入安装页面，等待片刻后，在新弹出的窗口中输入`ConvertToUTF8`，点击它便开始自动下载安装。

如果出现乱码，只要在`File`里面找到`Encoding`并选择合适的编码模式即可，快捷键`Ctrl+Shift+C`。

### AStyleFormatter
*Sublime Text 3下的C/C++代码整理工具，好像还支持java*

`Ctrl+P`打开切换面板，输入`PackageControl`回车，打开包管理。输入或者点击`install`进入安装页面，等待片刻后，在新弹出的窗口中输入`AStyleFormatter`，点击它便开始自动下载安装。

使用时只要在代码编辑页面右击，选择`AStyleFormatter->Format`即可,快捷键为`Ctrl+Alt+F`。

### InsertDate
*顾名思义，此插件用于在文中快速插入时间*
`Ctrl+P`打开切换面板，输入`PackageControl`回车，打开包管理。输入或者点击`install`进入安装页面，等待片刻后，在新弹出的窗口中输入`InsertDate`，点击它便开始自动下载安装。

默认的键位需要用到`F5`键，但是ThinkPad默认状态下需要同时按`Fn`才能使用`F5`，所以修改一下键位吧。

点击`Preferences->Key Bindings - Users`，打开自定义键位设置，输入如下代码：
```
[
    { "keys": ["ctrl+m"], //ctrl+m可以换成任意一组没有冲突的组合键
    "command": "insert_date",
    "args": {"format": "%H:%M:%S"} },
]
```
这样，不管在什么状态下，我都能用`Ctrl+m`输入当前时间了～

## 代码片段(`snippet`)功能
点击`Tools->New Snippet`之后，会新建一个文件，内容如下：
```
<snippet>
    <content><![CDATA[
Hello, ${1:this} is a ${2:snippet}. //这里输入你想要键入的代码～
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <!-- <tabTrigger>hello</tabTrigger> --> //这里把hello换成你想要使用的快捷键。
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <!-- <scope>source.python</scope> --> //这里选择起作用的文件类型
</snippet>
```
设置完毕之后，`Ctrl+S`保存，默认会保存在User文件夹下，为了方便管理，不妨新建一个Snippet文件夹，后缀名为`.sublime-snippet`。保存好之后，就可以使用啦～
用我自己的一个Snippet文件举例：
```
<snippet>
    <content>
<![CDATA[
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>
#include <ctime>
#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <deque>
#include <list>
#include <set>
#include <map>
#include <stack>
#include <queue>
#include <numeric>
#include <iomanip>
#include <bitset>
#include <sstream>
#include <fstream>
#define debug puts("-----")
#define pi (acos(-1.0))
#define eps (1e-8)
#define inf (1<<30)
using namespace std;
]]>
    </content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>#init</tabTrigger>
    <description>C/C++ header file</description> //描述信息，可选
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.c, source.c++</scope>
</snippet>
```
该文件起到的作用就是，当我输入`#init`并敲击`Tab`是，会自动将`#init`转换成我预先设定的代码。

## 备份
配置到现在，Sublime也算用的顺手了，要是换一台电脑都得这么捣鼓一下，肯定得疯。所以下面介绍一下如何同步自己的Sublime配置——只要备份`Packages\User`文件夹即可，里面的`sublime-settings`文件都保存了你的所有设置，更换电脑之后，只要恢复过去，打开Sublime的时候会自动检测，下载并安装你需要的包。

### Windows下
备份文件夹：`C:\Users\yourusername\AppData\Roaming\Sublime Text 3\Packages\User`

### Linux下
备份文件夹：`~/Library/Application/Support/Sublime\ Text\ 3/Packages/User`
注意空格的转义= =。`rm -rf /usr /balabala`之类的梗我才没有听说过呢。

# 尾言
出于个人喜好，没有附带汉化以及破解教程。

毕竟是用来敲代码的，软件本身是英文的还是中文的其实影响不大，所以费尽心思折腾汉化没有什么意思。此外，支持正版从我做起，ST的作者并没有刻意的进行反盗版处理，使用一些简单的汇编工具就可以进行破解，但是出于对作者的尊重，我没有这样做。因为就算是未破解版也不过是跳出一个提示窗口而已，功能完全没有阉割，已经非常厚道了。总之，求汉化，求破解的人可以去Google看看，这里是不会有了。

本文仓促完工，如果有不正确的地方请在下方评论窗口指出，谢谢。

# 更新日志

 - 2014年06月05日 写完全文，观察效果，并发布
 - 2014年07月03日 博客迁移至Hexo，做细节调整
 - 2014年08月08日 添加了Sublime在Linux下的`.buildsystem`代码
 - 2014年08月16日 添加了关于Snippet功能和快速插入时间插件的介绍。
 - 2014年08月22日 添加了关于备份Sublime设定的介绍
 - 2014年09月01日 更新Sublime Text 3下载链接至3065版本，增加Changelog，修改下载地址。
 - 2015年01月06日 采纳读者建议，修改了编译系统部分的文字，现在更加容易懂了~
 - 2015年03月25日 新版本的Build变得有点傻逼- -，重新修改了sublime-build，现在只需要一次按键就能编译并运行了~，Linux下没有进行测试，求反馈。
 - 2015年06月30日 更新Sublime Text 3下载链接至3083版本，更新了Toc上的BUG，修复了Package Control的安装脚本。