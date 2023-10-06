---
categories: Code
date: 2014-07-07T00:38:09Z
tags:
- Blog
- Software
- Windows
- Github-Pages
- Wiki
title: 使用Hexo构建项目Wiki
toc: true
url: /2014/07/07/use-hexo-to-bulid-project-wiki/
---

七七事件前一天，我有幸加入了[本校OJ2.0](https://github.com/cugbacm/oj)项目组。非常高兴能够为我们学校自己的OJ开源项目做出一份贡献，虽然只是一份整理Wiki的小活儿，但是这是我第一次真正的参与一个源项目。经过谨慎考虑之后，我决定项目的Wiki使用Github Pages来构建。

<!--more-->

# 为什么是Github Pages？
- 免费，无限流量
- 享受git的版本管理功能，不用担心文章遗失。
- 你只要用自己喜欢的编辑器写文章就可以了，其他事情一概不用操心，都由github处理。
*以上引用自[阮一峰先生的相关博文](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)*
- 同Github Wiki一样支持多人协作，但是更加便于查阅，特别是在涉及主题繁杂的时候。
- 比Github Wiki拥有更大的控制权限，避免Wiki被错误操作。

# 前期准备
## Hexo的安装与配置
### Windows环境下
32位地址:<http://nodejs.org/dist/v0.10.29/node-v0.10.29-x86.msi>
64位地址:<http://nodejs.org/dist/v0.10.29/x64/node-v0.10.29-x64.msi>
### Mac OS环境下
安装包地址:http://nodejs.org/dist/v0.10.29/node-v0.10.29.pkg
### Linux环境下
建议使用`nvm`来管理nodejs环境
1. 打开终端，输入`wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh`
2. 重启终端之后,输入`nvm ls`，则会列出所有的可用版本
3. 输入`nvm install 0.10.29`（此处以最新版为例）
4. 下面配置nodejs的环境，分别输入`nvm use 0.10.29`以及`nvm alias default 0.10.29`

## Git的安装与配置
### Windows环境下
不妨使用Github For Windows， 通过添加命令行参数启动环境，无须配置PATH，完全绿色化。（TODO：有待补充）
### Mac OS环境下
同理，使用Github For Mac即可。
### Linux环境下
Ubuntu, Debian：`sudo apt-get install git-core`
Fedora, Red Hat, CentOS：`sudo yum install git-core`

### 开启SSH，避免重复输入帐号密码
可以参考[此处](http://xuanwo.io/2015/02/07/generate-a-ssh-key/)。

# Wiki配置
感谢[wzpan](http://www.hahack.com/)开源的主题，其实还是我主动索要的- -，幸好他非常热情地提供了帮助，在此表示衷心的感谢。
致谢完毕，下面转入配置的细节。
1. 在github上建立一个新的仓库，名为`yourname.github.io`
2. 事先建立好准备存放wiki的文件夹，然后在当前目录下打开终端（或者不停地cd进入），然后输入`hexo init`，初始化。
3. 然后输入`npm install`，自动下载相关的依赖包，此时一个最基本的框架已经构建完毕了。
4. 然后输入`git clone https://github.com/wzpan/hexo-theme-wixo.git themes/wixo`，下载wiki用的主题。
5. 然后修改`_config.yml`中的`theme`条目为`wixo`，注意`theme`后有一个空格。
>
补充一下关于`deploy`的设置
同样是在_config.yml文件夹中，修改`deploy`的部分为

```
deploy:
  type: github
  repo: repository url //使用之前创建的那个库，建议使用SSH
  branch: branch //Hexo会自动识别个人wiki还是项目wiki

```
<p>6. 进入source文件夹，打开_post文件夹，新建一个md文档，在文档的开头加入

```
---
title: your title //这将会是wiki文档的标题
date: 2014-03-16 10:17:16  //构建时间，wiki中用不到
categories: Docs //这将会是本文档所属的类别
toc: true //默认开启，生成table of contents
--- //不可省略，敲回车后，下面的内容就自由发挥了～

```

<p>7. 保存文档后，返回wiki所在文件夹， 输入`hexo d -g`，此时wiki已经自动生成并上传完毕了。

# 协作注意事项
## 项目创建者
按照上述设置，`wiki`默认保存在`yourname.github.io`的`master`分支下。建议另外开启一个`source`分支，用来将整个wiki文件夹上传，方便多地编辑以及同步协作。
>
一开始可能会发现wiki文件夹不能使用git管理，这是因为主题wixo是使用git管理的。所以在上传wiki文件夹之前，要删除位于wixo文件夹下的.git文件夹。

## 项目参与者
让项目创建者在项目的settings中的Collaborators栏目中输入自己的用户名，即可获得对这个项目的控制权。
环境配置完毕后，fork`source`分支，即可开始编辑工作。根据`.gitignore`文件的不同，可能还需要进行`npm install`以解决依赖问题。

# 更新日志
- 2014年07月07日 完成`前言`和`为什么`板块
- 2014年07月24日 完成`前期准备`和`Wiki配置`以及`注意事项`版块，接下来完成免PATH配置的详细步骤以及SSH的配置。此外发现步骤有些混杂不清，下一个版本中将进行修正。
- 2015年04月01日 添加了SSH配置。