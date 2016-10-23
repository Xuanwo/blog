---
title: Chocolatey——Windows下的包管理工具
date: 2016-2-15 20:15:46
tags: [Software, Windows]
categories: Opinion
toc: true
---

# 前言
[Chocolatey](https://chocolatey.org/)是一个基于Nuget的Windows包管理工具，截止到我更新此文章的时候，一共有3.7k多个独立包。本文旨在介绍Chocolatey这一工具的安装和用法，希望能有更多人享受到该工具的便利之处。

<!-- more -->

# 安装chocolatey

## CMD
打开一个具有管理员权限的命令行窗口，执行如下命令：
```PowerShell
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
```

## PowerShell
打开一个具有管理员权限的PowerShell窗口，执行如下命令：
```PowerShell
iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
```

# 使用chocolatey

## 安装包

安装包十分的容易，只需要打开管理员权限的命令行即可：

```PowerShell
choco install <package>
```

## 卸载包

卸载也同样十分简单，打开管理员权限命令行，执行：

```PowerShell
choco uninstall <package>
```

## 更新包

更新包则需要使用如下命令：

```PowerShell
choco upgrade <package>
```

# 为chocolatey做贡献

Chocolatey的一个特点就是社区化的环境，每一个人都可以向它提交自己喜爱的包。因为Chocolatey总是从官方下载所需要的包，所以避免了授权等问题。当然，本来收费的软件，同样需要收费，比如JetBrains系列的产品。

## 注册APIKey

提交包则会略为复杂一点，首先你需要在https://chocolatey.org/ 注册一个账号，并获取跟你账户绑定的唯一APIKey。然后在命令行中执行如下命令：

```PowerShell
choco apikey -k <your key here> -s https://chocolatey.org
```

## 新建软件包

在命令行中运行

```PowerShell
choco new <package name here>
# 为方便理解，此处使用test做包名
```
则当前目录下就会自动生成一个名为`test`的文件夹，目录结构如下：

```PowerShell
test.nuspec
tools
  |--chocolateyinstall.ps1
  |--chocolateyuninstall.ps1
  |--ReadMe.md
```

## 完善信息

### 修改test.nuspec

自动生成的描述文件在需要填写的位置都有大写英文注释，只需要按照要求一一填写即可，下面我列举一份已经通过审核的Datagrip的描述文件作为参考：

```XML
<?xml version="1.0" encoding="utf-8"?>
<!-- Do not remove this test for UTF-8: if “Ω” doesn’t appear as greek uppercase omega letter enclosed in quotation marks, you should use an editor that supports UTF-8, not this one. -->
<package xmlns="http://schemas.microsoft.com/packaging/2015/06/nuspec.xsd">
  <metadata>
    <!-- Read this before publishing packages to chocolatey.org: https://github.com/chocolatey/chocolatey/wiki/CreatePackages -->
    <id>datagrip</id>
    <title>DataGrip</title>
    <version>1.0.1</version>
    <authors>JetBrains</authors>
    <owners>Xuanwo</owners>
    <summary>Your Swiss Army Knife for Databases and SQL</summary>
    <description>## Intelligent query console
Allows you to execute queries in different modes and provides local history that keeps track of all your activity and protects you from losing your work.
......(省略)
</description>
    <projectUrl>https://www.jetbrains.com/datagrip/</projectUrl>
    <packageSourceUrl>https://github.com/Xuanwo/datagrip-chocolatey-package</packageSourceUrl>
    <!--<projectSourceUrl></projectSourceUrl>
    <docsUrl></docsUrl>
    <mailingListUrl></mailingListUrl>-->
    <bugTrackerUrl>https://youtrack.jetbrains.com/issues/DBE</bugTrackerUrl>
    <tags>datagrip admin jetbrains trial 30days</tags>
    <copyright>Commercial</copyright>
    <!--<licenseUrl></licenseUrl>-->
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <!--<iconUrl>http://cdn.rawgit.com/__REPLACE_YOUR_REPO__/master/icons/datagrip.png</iconUrl>-->
    <!--<dependencies>
      <dependency id="" version="__VERSION__" />
      <dependency id="" />
    </dependencies>-->
    <releaseNotes>https://confluence.jetbrains.com/display/DBE/DataGrip+1.0.1+Release+Notes</releaseNotes>
    <!--<provides></provides>-->
  </metadata>
  <files>
    <file src="tools\**" target="tools" />
  </files>
</package>
```

有一个比较坑的地方是`<description>`部分是支持Markdown的，内容直接顶着括号写就OK，不用另起一行，也不用自己加缩进。

### 补充chocolateyinstall.ps1

> `chocolateyuninstall`可以没有，但是一定要有`chocolateyinstall`脚本。

`chocolateyinstall.ps1`如果点击`编辑`打开的话，会自动调用`Windows Powershell ISE`编辑器。

下面同样列举一份已经填写完成的样例：

```PowerShell
$packageName= 'datagrip'
$installerType = 'EXE'
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = 'https://download.jetbrains.com/datagrip/datagrip-1.0.1.exe'
$silentArgs = '/S'
$validExitCodes = @(0)

Install-ChocolateyPackage "$packageName" "$installerType" "$silentArgs" "$url"  -validExitCodes $validExitCodes
```

需要注意的是，填写完毕之后，一定要在Powershell中运行下列代码以删除所有的注释文字：

```PowerShell
$f='c:\path\to\thisFile.ps1'
gc $f | ? {$_ -notmatch "^\s*#"} | % {$_ -replace '(^.*?)\s*?[^``]#.*','$1'} | Out-File $f+".~" -en utf8; mv -fo $f+".~" $f
```

### 打包上传

所有的信息填写完成后，在`test.nuspec`所在目录下执行`choco pack`就会自动进行打包。
如果有重要的信息没有填写，choco将会报错，并红字提示：

```PowerShell
LicenseUrl cannot be empty.
ProjectUrl cannot be empty.
PackageSourceUrl cannot be empty.
```

如果没有问题，则会有如下提示：

```PowerShell
Attempting to build package from 'datagrip.nuspec'.
Successfully created package 'datagrip.1.0.1.nupkg'
```

之后执行 `choco push datagrip.1.0.1.nupkg`即可将包上传至Chocolatey，通过管理员的审核之后，就会出现在软件列表中供人们下载了。


# 参考资料

- [Chocolatey 官方网站](https://chocolatey.org/)
- [Chocolatey, 我爱你](http://isaachan.github.io/blog/2013/02/07/chocolatey-i-love-you/)

# 更新日志

- 2016年02月15日 初步完成
- 2016年02月20日 修复脚本中的部分错误