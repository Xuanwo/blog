---
layout: post
title: Neovim慢速升级攻略
date: 2016-03-12 11:00
tags: [vim, Software]
categories: Develop
toc: true
---


一直都非常羡慕那些能把vim用得非常溜的人，但是自己总是不情愿去学，总是觉得vim的操作方式非常反人类，难度曲线太陡，不适合我。真正让我下定决心去学的，是因为系统切换到Ubuntu Gnome之后发现，Sublime Text 3 不能原生支持中文输入。同时我也发现，如果我不上来就折腾spf13这样的东西的话，其实vim非常好懂。于是，Neovim的慢速升级攻略就这样诞生了。

<!-- more -->

# 安装
安装可以参考[此处](https://github.com/neovim/neovim/wiki/Installing-Neovim)
如果是Ubuntu 的话，则可以执行如下代码：

```
sudo add-apt-repository ppa:neovim-ppa/unstable
sudo apt-get update
sudo apt-get install neovim
```

# Neovim常用操作

## 初步

### 光标移动

`gg` 移动到文件开头
`G` 移动到文件末尾

### 文件操作相关

`:w <filename>` 按照<filename>保存文件
`:wq` 保存并退出
`:q!` 退出不保存
`:e` 打开新的文件并关闭当前文件，使用Tab可以补全

### 文件编辑相关

`dd` 删除当前行
`y` 复制
`yy` 复制当前行
`yG` 复制光标以上全部行
`ygg` 复制光标以下全部行
`p` 粘贴
`u` 撤销

## 入门

### 使用内置终端

`:terminal` 打开终端，输入exit并使用`esc`或`enter`即可退出

### 与系统剪切板集成

这个地方折腾了好久，Neovim默认是支持`+`寄存器的，但是我通过`"+y`命令调用寄存器时却提示`Clipboard No Provider`。通过阅读[文档](https://github.com/neovim/neovim/blob/master/runtime/doc/nvim_clipboard.txt#L19-L27)之后，我得知，必须要安装下列三个包中的至少一个，才能正常使用剪切板：

- xclip
- xsel (newer alternative to xclip)
- pbcopy/pbpaste (only for Mac OS X)

安装好之后再打开，就可以正常使用了。

*快速复制全文的技巧： 在Normal模式下，`gg`跳转到文章开头，`VG`选中全文，`"+y`复制到剪切板。*

# Neovim插件

## vim-airline

[vim-airline](https://github.com/vim-airline/vim-airline)是一个vim的状态栏插件，同样支持neovim。

![vim-airline demo](https://github.com/vim-airline/vim-airline/wiki/screenshots/demo.gif)

> 安装此插件后启动nvim会报错，自行编译后错误消失，不知道具体的原因。

### Smarter tab line

在`init.vim`中加入

```
' 开启tabline功能
let g:airline#extensions#tabline#enabled = 1
' 设置tabline分隔符
let g:airline#extensions#tabline#left_sep = ' '
let g:airline#extensions#tabline#left_alt_sep = '|'
```

支持的一些快捷操作命令：

`:bn`: 跳转下一个buffer
`:bp`: 往上一个buffer
`:b<n>`: 跳往第n个buffer
`:bd`: 关掉目前buffer

### vim-airline-themes

个人比较偏爱`solarized`的暗色皮肤，所以需要使用这个库来安装airline配套的皮肤。
在`init.vim`中添加

```
Plug 'vim-airline/vim-airline-themes'
```

然后修改：

```
let g:airline_theme="solarized"
```

即可

## vim-colors-solarized

顾名思义，这是`solarized for vim`。
在`init.vim`中添加

```
Plug 'altercation/vim-colors-solarized'
```

然后修改：

```
set background=dark
colorscheme solarized
```

即可

# 更新日志
- 2016年03月12日 首次发布
- 2016年03月15日 增加air-line相关内容
- 2016年06月16日 增加主题配置相关内容，并添加了部分常用快捷键
