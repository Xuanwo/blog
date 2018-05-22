---
categories: Operate
date: 2016-04-13T00:00:00Z
tags:
- CUGBLUG
- Gitlab
title: Gitlab部署和汉化以及简单运维
toc: true
url: /2016/04/13/gitlab-install-intro/
---

# 起因
在跟网络中心的老师沟通成立镜像站的相关事宜的时候，意外地接下来搭建一套校内的 Git 服务的任务。
[@怡红公子](https://imnerd.org/) 曾经搭建过一套类似的服务，但由于服务器端没有开启 VT 虚拟化导致不能安装 64 位的操作系统，再加上 Gitlab 不提供 32 位的安装包，所以长期以来怡红公子一直都是自行编译并配置 Gitlab 。考虑到后续维护的方便，我们决定趁着这个机会使用另一台支持安装 64 位操作系统的服务器，一劳永逸地解决这个问题。
我们的服务器环境是 **CentOS 7.2 64bit** ，以下所有操作均以此为基准。

<!--more-->

# Gitlab 安装

推荐使用 [Install a GitLab CE Omnibus package](https://about.gitlab.com/downloads) 安装 ，其他发行版可以点选对应版本，不再赘述。

## 安装和配置依赖

如果需要安装 Postfix 来发送邮件，则需要在安装过程中选择 `Internet Site`。你也可以使用 Sendmail 之类的第三方发信服务或者使用自行配制的 SMTP 服务器。
除此以外，下列命令将会在防火墙中打开 HTTP(80) 和 SSH(22) 对应端口。

```bash
sudo yum install curl policycoreutils openssh-server openssh-clients
sudo systemctl enable sshd
sudo systemctl start sshd
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
sudo firewall-cmd --permanent --add-service=http
sudo systemctl reload firewalld
```

## 添加 Gitlab 源并安装

```bash
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
sudo yum install gitlab-ce
```
这个脚本会在源中添加 Gitlab-CE ，并自动执行`yum makecache`，然后安装`gitlab-ce`。由于源在国外，可能速度较慢，也可以手动添加来自 清华tuna 的源： https://mirrors.tuna.tsinghua.edu.cn/help/gitlab-ce/ ， 链接中为各发行版下的教程，感谢 清华tuna 提供镜像。

## 配置并启动 Gitlab

此时已经可以启动服务了：

```bash
sudo gitlab-ctl reconfigure
```

进行一长串复杂的启动流程之后， gitlab 就已经可以通过 `localhost` 进行访问了。

# Gitlab 配置

## 修改域名

默认的配置文件保存在 `/etc/gitlab/gitlab.rb` ，执行：

```bash
sudo vim /etc/gitlab/gitlab.rb
```

打开文件，并修改：

```ruby
external_url 'http://your.domain'
```

再次执行

```bash
sudo gitlab-ctl reconfigure
```

即可。

有一定概率出现 502 错误，刷新浏览器或者再次更新配置即可。

## Gitlab 汉化

由于服务对象是广大师生，为了降低新手上手的难度，所有进行汉化也是非常有必要的。好在国内有人已经进行了这方面的工作，我们只需要共享其成果即可（欢迎向[原项目](https://gitlab.com/larryli/gitlab)提交高质量翻译）。

首先确认版本：

```bash
sudo cat /opt/gitlab/embedded/service/gitlab-rails/VERSION
```

并确认当前汉化版本的 VERSION 是否相同，当前最新的汉化版本为 8.6 。
如果安装版本小于当前汉化版本，请先升级。如果安装版本大于当前汉化版本，请在本项目中提交新的 issue。
如果版本相同，首先在本地 clone 仓库。

```bash
# GitLab.com 仓库
git clone https://gitlab.com/larryli/gitlab.git

# 或 Coding.net 镜像
git clone https://git.coding.net/larryli/gitlab.git
```

> 根据我的测试， Coding.net 的镜像不完整，clone 之后无法 checkout

然后比较汉化分支和原分支，导出 patch 用的 diff 文件。

```bash
# 8.1 版本的汉化补丁
git diff origin/8-6-stable..8-6-zh > ../8.6.diff
```

然后上传 `8.6.diff` 文件到服务器。

```bash
# 停止 gitlab
sudo gitlab-ctl stop
sudo patch -d /opt/gitlab/embedded/service/gitlab-rails -p1 < 8.6.diff
```

确定没有 .rej 文件，重启 GitLab 即可。

```bash
sudo gitlab-ctl start
```

如果汉化中出现问题，请重新安装 GitLab（**注意备份数据**）。

# Gitlab 运维

## 管理
```bash
# 启动所有 gitlab 组件：
sudo gitlab-ctl start

# 停止所有 gitlab 组件：
sudo gitlab-ctl stop

# 重启所有 gitlab 组件：
sudo gitlab-ctl restart
```

## 备份

备份GitLab repositories and GitLab metadata
在 crontab 中加入如下命令：
```
0 2 * * * /usr/bin/gitlab-rake gitlab:backup:create
```

## 恢复

首先进入备份 gitlab 的目录，这个目录是配置文件中的`gitlab_rails['backup_path']`，默认为`/var/opt/gitlab/backups`。

然后停止 unicorn 和 sidekiq ，保证数据库没有新的连接，不会有写数据情况。

```bash
sudo gitlab-ctl stop unicorn
# ok: down: unicorn: 0s, normally up
sudo gitlab-ctl stop sidekiq
# ok: down: sidekiq: 0s, normally up
```

然后恢复数据，1406691018为备份文件的时间戳

```bash
gitlab-rake gitlab:backup:restore BACKUP=1406691018
```

## 修改数据存储地址

默认情况下，gitlab 将数据存储在`/var/opt/gitlab/git-data`目录下，受限于分区情况&方便管理，我们需要将数据迁移到别的目录下。

### 无需数据迁移

如果还没有投入使用，则可以直接在配置文件中添加：

```ruby
git_data_dir "/path/to/git-data"
```

然后执行：

```bash
sudo gitlab-ctl reconfigure
```

就可以生效了。

### 进行数据迁移

如果已经有数据了，则需要进行迁移。

首先需要暂停服务，避免用户在迁移期间读写数据：

```ruby
sudo gitlab-ctl stop
```

然后使用rsync数据进行迁移：

> 注意前一个地址不需要`/`，后一个地址需要`/`，且只需要迁移`repositories`目录即可

```bash
sudo rsync -av /var/opt/gitlab/git-data/repositories /path/to/git-data/
```

然后运行配置工具以更新并重启服务：

> 官网文档是先更新配置再启动服务，但我在使用中发现先更新配置会提示无法连接上服务器，出现这种问题时可以先启动服务再更新配置。

```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl start
```

最后不要忘了在网页端确认数据的地址是否正确。

> 关于权限问题
> 在使用中，我一开始创建了一个`gitlabhq`用户并创建了一个文件夹，然后修改地址，服务正常启动后提示500。
> 后来使用`root`账户在`/home`下直接创建文件夹解决了这个问题。
> 如果有遇到类似问题的，可以尝试用`root`创建目录。

## 监听IPv6

教育网拥有得天独厚的IPv6资源，所以为我们的gitlab服务添加IPv6支持很有必要。

修改`/etc/gitlab/gitlab.rb`文件中的：

```ruby
# nginx['listen_addresses'] = ['*']
```

为

```ruby
nginx['listen_addresses'] = ['*', '[::]']
```

然后执行

```bash
sudo gitlab-ctl reconfigure
```

然后就可以通过IPv6访问了。

# 参考资料
- [Gitlab 下载](https://about.gitlab.com/downloads/)
- [GitLab Community Edition · Wiki](https://gitlab.com/larryli/gitlab/wikis/home)
- [crontab 定时任务](http://linuxtools-rst.readthedocs.org/zh_CN/latest/tool/crontab.html)
- [Backup restore](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/raketasks/backup_restore.md)
- [Storing Git data in an alternative directory](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/configuration.md#storing-git-data-in-an-alternative-directory)

# 更新日志
- 2016年04月14日 首次发布
- 2016年04月18日 新增数据迁移&监听IPv6配置
