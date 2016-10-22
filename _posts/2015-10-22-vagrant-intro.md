---
layout: post
title: Vagrant——构建虚拟开发环境的新思路
date: 2015-10-22 09:24:57
tags: [Software, Develop]
categories: Opinion
toc: true
---
# 前言
说到虚拟开发环境，人人都觉得好，但是在实际应用中，人们还是在一台电脑上配置所有用到的环境。究其原因，还是因为搭建虚拟开发环境的过程不比在实体机上配置更简单。但是，Vagrant出现了。Vagrant抹平了不同的虚拟化软件的差异，以统一的命令取而代之；抛弃了传统的系统镜像分发安装方式，以直接封装好的虚拟磁盘代替。除此以外，还提供了各种已经封装好的环境下载，搭建一个虚拟开发环境的便利程度有了大幅提高。

<!-- more -->

本文主要介绍了Vagrant的配置以及使用，旨在安利这款十分有用的工具，希望能为更多人带来便利

# Vagrant介绍
[Vagrant](https://www.vagrantup.com/)是一款用来构建虚拟开发环境的工具。对于团队开发而言，可以用来构建一致的开发环境；而对于个人开发而言，则可以方便地搭建不冲突不互相影响的各种开发环境。

# Vagrant配置

## 安装Vagrant

在[此处下载Vagrant](https://www.vagrantup.com/downloads.html)。
Vagrant主要以二进制安装包形式分发，覆盖了Windows，Mac OS X，DEB以及RPM。均不支持的平台可以自行编译安装，此处不再赘述。

## 安装Provider
Vagrant在本地主要支持两种：VirtualBox ，VMware。我推荐使用小巧且开源的[VirtualBox](https://www.virtualbox.org/wiki/Downloads)，下载好对应的安装包之后直接安装即可。

## 配置Path
在Windows上使用还需要自行配置Path，否则Vagrant无法调用VirtualBox。
在Path中添加Vagrant以及VirtualBox的可执行文件路径即可
```
C:\HashiCorp\Vagrant\bin;C:\Program Files\Oracle\VirtualBox
```

# Vagrant初步

## 添加box

> box介绍
> 在Vagrant中，box是一个打包好了的Vagrant环境，包括特定的系统配置和软件参数。一个box可以在任何支持Vagrant的平台和系统上运行，可以跨平台地提供一致的系统环境，这正是Vagrant的有用之处。

首先在[此处](https://atlas.hashicorp.com/search)下载自己想要的box，然后使用`vagrant box add ubuntu\vivid64 X:\path\to\box`来注册一个本地的box以便于后续的使用。

## 初始化

首先使用`vagrant init ubuntu/vivid64`命令在当前目录下新建一个基于Ubuntu 15.04的配置文件。

> 此处使用ubuntu 15.04作为演示，更多的box可以在[此处](https://atlas.hashicorp.com/search)下载

## 启动

经过初始化操作后，就可以使用`vagrant up`启动自己的虚拟机了。
默认的情况下，可以使用`127.0.0.1:2222`来连接虚拟机，你可以非常方便地使用自己喜欢的ssh工具来进行操作。
存放着`vagrantfile`的文件夹会以`/vagrant`的形式挂载到虚拟机中，你可以毫无障碍的在主机和虚拟机之间传递文件，比如将代码放在此文件夹下，虚拟机就可以直接进行编译并执行，非常酷炫。

# Vagrant进阶
## 修改虚拟机默认内存大小
VirtualBox的默认内存大小为512MB，在编译某些软件时会因为内存过小导致错误。
可以修改`Vagrantfile`来改变这个参数：
```
config.vm.provider "virtualbox" do |vb|
#   # Display the VirtualBox GUI when booting the machine
#   vb.gui = true
#
#   # Customize the amount of memory on the VM:
   vb.memory = "2048"
end
```
修改时需要注意，如果要启用`vb.memory`这一选项，需要同时取消上面`config`以及下面的`end`之前的注释，否则vagrant执行时会因为配置文件格式错误而报错。

# 更新日志
- 2015年10月22日 初步完成