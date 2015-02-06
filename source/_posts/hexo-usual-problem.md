title: Hexo常见问题解决方案
date: 2014-08-14 05:20:00
tags: [Software]
categories: Opinion
toc: true
---
# 介绍
Hexo是一个非常好用的静态博客生成器，但是由于很多方面的原因，导致在使用过程中经常出现错误。这些错误中，有些是因为自己的设置不当，导致程序报错；有些是因为版本更迭，导致原有的设置失效；而有些，则是Hexo程序本身的BUG。本文旨在尽可能的解决前两类问题，缓解Hexo项目大量重复issues的现象。当然，我个人的力量是有限的，因此也希望使用Hexo的大家也能一起行动起来，通过[提交PR](https://github.com/Xuanwo/xuanwo.github.io/pulls)，[发布issues](https://github.com/Xuanwo/xuanwo.github.io/issues)或者在下方评论区评论等形式参与到本文档的编辑中来。同时，也希望有能力的人可以将本文档翻译成英文，以帮助到更多的人。浏览时，使用`Ctrl+F`搜索关键词。

**本文欢迎转载，但是恳请保留贡献者信息，谢谢。**

<!--more-->

---

# 常见错误
## 本地浏览没问题，Deploy报错
### Git环境配置错误
**问题描述：**
*Windows系统*出现报错信息如下
```
[info] Start deploying: git
[info] Setting up Git deployment...
[error] Error: spawn ENOENT
Error: spawn ENOENT
    at errnoException (child_process.js:1000:11)
    at Process.ChildProcess._handle.onexit (child_process.js:791:34)

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: spawn ENOENT
    at errnoException (child_process.js:1000:11)
    at Process.ChildProcess._handle.onexit (child_process.js:791:34)
```
**解决方案：**
1. 检查Git的相关配置，将git所在目录添加到系统path中去。
2. 使用`Github For Windows`的朋友，将git添加至path之后，使用`git shell.lnk`启动Hexo。在lnk文件的属性界面中`目标`项中添加`C:\Users\xuanw_000\AppData\Local\GitHub\GitHub.appref-ms --open-shell /k "C:\Program Files\nodejs\nodevars.bat"`。其中`C:\Users\xuanw_000\AppData\Local\GitHub\GitHub.appref-ms --open-shell /k`是原来的文本，`"C:\Program Files\nodejs\nodevars.bat"`是新增的，用于在shell中添加nodejs运行环境。不会配置可以点击[这里](https://github.com/Xuanwo/xuanwo.github.io/raw/blog/Git%20Shell.lnk)下载。

### Deploy设置错误
**问题描述：**
输入`hexo deploy`后，出现错误信息：
```
'github' does not appear to be a git repository
```
**解决方案：**
1. 检查`_config.yml`中deploy设置。参见<http://hexo.io/docs/deployment.html>。
2. 删除`.deploy`文件夹并且执行`hexo clean`后，重新`hexo deploy`。

## Deploy之后，页面长时间404
**问题描述：**
直接上图了，不要哭= =
![Github 404 孩子不哭](http://xuanwo.qiniudn.com/opinion/Github-404.png)
**解决方案：**
### 检查Github Pages类型
**个人主页**
也就是库的名称为`yourname.github.io`的主页，页面文件应当在master分支下，文件结构可以参考[我的主页](https://github.com/Xuanwo/xuanwo.github.io/tree/master)，也就是应当以HTML文件为主，是没有Markdown文件的。
**项目主页**
也就是库名不是`yourname.github.io`的主页，页面文件应当在`gh-pages`分支下，文件结构与个人主页基本一致，同样没有Markdown文件。
### 检查Github验证邮件
曾经出现过所有操作都没有问题但就是404的状况，新创建的用户最好都去看看是不是验证邮件没有通过。
### 注意库的名字
现在大多改成`.io`结尾域名了，但是不确定是不是真的跟这个有关，最好改成`.io`。

## 自有域名二级目录无法访问
**问题描述**
[参见issue820](https://github.com/hexojs/hexo/issues/820)

**问题分析**
问题出在CNAME跳转，下面附上我的分析，如果不感兴趣可以直接翻到解决方案。
> 
如果没有CNAME跳转，访问`yourname.github.io/repo`会自动地去访问gh-pages分支下的静态文件。
但是一旦进行了CNAME跳转，访问`yourname.github.io/repo`就会自动跳转为`yoursite.com/repo`，显然在你的博客目录下是没有这个文件夹的，所以自然而然的会出现访问404错误。

**解决方案**
*增加一个新的DNS记录*
修改自己域名的DNS记录，增加一条记录（A记录或者CNAME都可以，指向github），内容是`repo.yoursite.com`，访问时通过`repo.yoursite.com`来访问。
*将这个库移动到博客目录下*
按照上述的分析，把这个库的repo移动至博客目录下即可。注意修改html以免被hexo再次渲染，还有如果是直接复制或者clone，注意删除隐藏的`.git`文件夹。

## Hexo命令失效
**问题描述：**
输入命令后出现如下信息：
```
localhost:~ apple$ hexo new "title"
Usage: hexo

Commands:
help Get help on a command
init Create a new Hexo folder
migrate Migrate your site from other system to Hexo
version Display version information

Global Options:
--debug Display all verbose messages in the terminal
--safe Disable all plugins and scripts

For more help, you can use hexo help [command] for the detailed information
or you can check the docs: http://zespia.tw/hexo/docs/
```
**解决方案：**
检查`_config.yml`内容，特别注意`:`后面需要有一个空格。

## Hexo所有命令报错
**问题描述：**
[参见Issues](https://github.com/hexojs/hexo/issues/832)
报错信息如下：
```
[error] { name: 'HexoError',
  reason: 'end of the stream or a document separator is expected',
  mark: 
   { name: null,
     buffer: '# Hexo Configuration\n## Docs: http://hexo.io/docs/configuration.html\n## Source: https://github.com/tommy351/hexo/\n\n# Site\ntitle: 2hu\nsubtitle:\ndescription: 2hu\nauthor: @2hu10n92hen9\nemail:\nlanguage:\n\n# URL\n## If your site is put in a subdirectory, set url as \'http://yoursite.com/child\' and root as \'/child/\'\nurl: http://2hu.me\nroot: /\npermalink: :year/:month/:day/:title/\ntag_dir: tags\narchive_dir: archives\ncategory_dir: categories\ncode_dir: downloads/code\n\n# Directory\nsource_dir: source\npublic_dir: public\n\n# Writing\nnew_post_name: :year-:month-:day-:title.md # File name of new posts\ndefault_layout: post\nauto_spacing: false # Add spaces between asian characters and western characters\ntitlecase: false # Transform title into titlecase\nexternal_link: true # Open external links in new tab\nmax_open_file: 100\nmulti_thread: true\nfilename_case: 0\nrender_drafts: false\npost_asset_folder: false\nhighlight:\n  enable: true\n  line_number: true\n  tab_replace:\n\n# Category & Tag\ndefault_category: uncategorized\ncategory_map:\ntag_map:\n\n# Archives\n## 2: Enable pagination\n## 1: Disable pagination\n## 0: Fully Disable\narchive: 2\ncategory: 2\ntag: 2\n\n# Server\n## Hexo uses Connect as a server\n## You can customize the logger format as defined in\n## http://www.senchalabs.org/connect/logger.html\nport: 4000\nserver_ip: 0.0.0.0\nlogger: false\nlogger_format:\n\n# Date / Time format\n## Hexo uses Moment.js to parse and display date\n## You can customize the date format as defined in\n## http://momentjs.com/docs/#/displaying/format/\ndate_format: MMM D YYYY\ntime_format: H:mm:ss\n\n# Pagination\n## Set per_page to 0 to disable pagination\nper_page: 10\npagination_dir: page\n\n# Disqus\ndisqus_shortname: 2hu\n\n# Extensions\n## Plugins: https://github.com/tommy351/hexo/wiki/Plugins\n## Themes: https://github.com/tommy351/hexo/wiki/Themes\ntheme: strict\nexclude_generator:\n\n# Deployment\n## Docs: http://hexo.io/docs/deployment.html\ndeploy:\n  type: github\n  repository: https://github.com/zhulongzheng/zhulongzheng.github.io.git\n  branch: master\n\u0000',
     position: 168,
     line: 8,
     column: 8 },
  message: 'Config file load failed',
  domain: 
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [ [Object] ] },
  domainThrown: true,
  stack: undefined }
```
**解决方案：**
仔细检查`_config.yml`文件中所有冒号后面的空格，格式很严格，必须是**只有一个**，**半角**。不管是多了还是少了都会报错，这是yml解释器所定义的语法。如果不确定的话，将输入法调整到英文模式，删除所有冒号后面的空格重新输入，不要使用Tab。

## 更新至2.8.X版本后，构建失败
**问题描述：**
输入`hexo g`后，报错如下：
```
[error] { name: 'HexoError',
  reason: 'incomplete explicit mapping pair; a key node is missed',
  mark:
   { name: null,
     buffer: 'categories: Categories\nsearch: Search\ntags: Tags\ntagcloud: Tag Cloud\ntweets: Tweets\nprev: Prev\nnext:
 Next\ncomment: Comments\narchive_a: Archives\narchive_b: Archives: %s\npage: Page %d\nrecent_posts: Recent Posts\ndescr
iption: Description\nread_more: Read More\n\u0000',
     position: 163,
     line: 9,
     column: 19 },
  message: 'Process failed: languages/default.yml',
  domain:
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [ [Object] ] },
  domainThrown: true,
  stack: undefined }
```
**解决方案：**
主题目录下所有yml文件中所有有空格的字段都用双引号括起来，尤其注意languages下面的yml文件。
![就像这样](http://xuanwo.qiniudn.com/opinion/hexo-languages-error.png)
*感谢[@dukewan](https://github.com/dukewan)提供的截图*

## 修改主题文件之后，网页不更新
**问题描述：**
在修改主题文件之后，页面的文件依然没有更新。
**解决方案：**
`hexo clean`并且删除`.deploy`文件夹之后，`hexo d -g`。为了强制浏览器更新资源文件，可以采用'Ctrl+F5'来刷新。

## 页面没有渲染（partial转义失败）
**问题描述：**
[参见Issues](https://github.com/hexojs/hexo/issues/838)
看不到渲染后的页面，只能看到类似如下信息：
```
<%- partial('_partial/head') %>
<%- partial('_partial/header', null, {cache: !config.relative_link}) %>
<%- body %>
<% if (theme.sidebar && theme.sidebar !== 'bottom'){ %> <%- partial('_partial/sidebar', null,     {cache: !config.relative_link}) %> <% } %>
<%- partial('_partial/footer', null, {cache: !config.relative_link}) %>
<%- partial('_partial/mobile-nav', null, {cache: !config.relative_link}) %> <%- partial('_partial/after-footer') %>
```
**解决方案：**
在博客所在目录下执行'npm install'用以安装插件。
**感谢[@tommy351](http://zespia.tw/)提供的解决方案**

---

# 常见问题
## 如何在不同电脑（系统）上使用Hexo
将自己的`Blog`文件夹使用`Git`来管理，需要注意一下几点。

1. 如果主题是通过git管理的，需要将主题文件夹下的`.git`文件夹删除，才能同步Blog文件夹（.git文件夹是隐藏的，需要显示隐藏文件才能删除，Linux下需要`rm -rf`命令才能删除，Mac没用过，不清楚）。
2. 按照Blog目录下自带的`.gitignore`文件，`node_modules`文件夹是不会同步的，所以同步之后需要自己再次进行`npm install`，但是注意，不要进行`hexo init`了，否则`_config.yml`全都白弄了。

然后看一下同步之后的目录结构：
<https://github.com/Xuanwo/xuanwo.github.io/tree/blog>

## 在主目录下添加`README.md`文件或者html文件
**感谢[@TimNew](http://timnew.me/)提供的思路**
*额，不知道是不是有人跟我一样有一个库没有`README.md`文件就浑身不舒服的强迫症= =*
正如大家所知道的，在source文件夹下的所有md文件都会被hexo渲染成html文件，导致`README.md`文件不能好好的放在里面了，即使是添加了`layout: false`依然没有用。

不过现在有一个另外的好办法，那就是利用主题的source目录，也就是`themes/themes-name/source`。因为这个文件夹里面的所有文件都会被复制到网站的根目录中去，也就是说，如果在里面放上`README`，就可以正常的存在于网站的主目录了。

同样的，对于一些需要在网站下添加html文件的需求也可以这样来达成。比如百度或者谷歌在验证站长权限的时候，通常都会要求在主目录下添加一个html文件。同样的，只要把这个文件放在`themes/themes-name/source`就可以搞定了。

## Hexo版本回退
有时候更新之后发现新版本的Hexo不能按照预期的方式工作，这时候就需要使用版本回退功能。
打开命令行，输入`npm install -g hexo@版本号`就可以回退到没有出现问题的版本上来。
*这个命令适用于所有Node.js模块*
> 
少数情况下会出现Node.js版本问题，可以使用`nvm install 版本号`来安装报错信息中需要的版本。
*推荐使用nvm来管理Node.js版本*

## 如何为站点添加社会化评论
### 使用Disque
Hexo默认支持Disque，打开`_config.yml`，在`disqus_shortname:`后面输入自己的Disque账号。保存，重新渲染，清除缓存之后就能看到自己的评论窗口。
### 使用Duoshuo
部分主题添加了对多说的支持，只要输入Duoshuo账号，就可以看到效果了。如果主题不支持的话，就需要自己添加。需要对自己的主题结构有一定的了解，不是每一个主题都会有一样的文件，找不到同样的文件也正常，但是都会存在相同功能的区块，自己去定位即可。如果没把握的话，最后做好备份。

在`after_footer.ejs`模块中输入如下代码：
```
<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
var duoshuoQuery = {short_name:"yourshortname"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		 || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
	</script>
<!-- 多说公共JS代码 end -->
```

在`article.ejs`模块中输入如下代码：
```
<% if (page.comments){ %>
        <div class="ds-thread" data-thread-key="<%- page.path %>" data-title=<%- page.title %> data-url=<%- page.permalink %>>
<% } %>
```

## 如何避免在Deploy时输入密码
### 使用Github客户端
安装好Github客户端之后，使用Github客户端内置的Git Shell进行hexo的部署操作。
### 自行生成SSH key
使用Github客户端可以免去输入密码操作的原因就是客户端在本地生成了一个SSH key并且添加到了Github网站中。不喜欢使用Github客户端的童鞋可以参考下面的流程自行生成SSH key。

打开Git Bash，并且输入：
`ls -al ~/.ssh`
这个命令会列出你`.ssh`账户中已经存在的SSH key，如果之前没有设置过，一般都是没有。
然后输入：
`ssh-keygen -t rsa -C "your_email@example.com"`
这个命令将会生成一个以`your_email@example.com`为标签的ssh key，然后bash中会显示：
```
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/you/.ssh/id_rsa): [Press enter]
```
直接回车，然后出现：
```
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]
```
因为追求操作方便，我们不打算在deploy的时候输入这个`passphrase`，所以直接回车两次设为空。然后你会看到：
```
Your identification has been saved in ~/.ssh/id_rsa.
Your public key has been saved in ~/.ssh/id_rsa.pub.
The key fingerprint is:
01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db your_email@example.com
```
下一步输入：
`ssh-agent -s`
如果出现类似`Agent pid XXXX`这样的字样，则跳过下一步，否则输入：
`eval `ssh-agent -s``
直到出现`Agent pid XXXX`这样的提示之后，输入：
`ssh-add ~/.ssh/id_rsa`
这样，你成功的在本地生成了一个SSH key，下面将这个key添加到github网站。
打开[https://github.com/settings/ssh](https://github.com/settings/ssh)，点击`Add SSH Key`，复制`id_rsa.pub`中的所有内容到`Key`框中，在`Title`框中输入方便自己记忆的名字（建议输入能让自己明白是哪台电脑的名字，方便以后管理）。
当网页显示添加成功后，就已经完成了全部的操作。
下面进行一些测试，同样是打开Git Bash，输入：
`ssh -T git@github.com`
bash中会显示如下字样：
```
The authenticity of host 'github.com (207.97.227.239)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
```
输入yes之后，计算机会自动将`github.com`列入已知的host，然后会出现如下提示：
```
Hi username! You've successfully authenticated, but GitHub does not
provide shell access.
```
如果成功看见，说明你已经配置好了，快去享受爽快的hexo一键部署吧；
如果出现任何错误提示，请仔细检查自己的操作，或者将错误信息发给我。

# 贡献者
- [@Xuanwo](http://xuanwo.org/)
- [@TimNew](http://timnew.me/)
- [@tommy351](http://zespia.tw/)

# 更新日志
- 2014年08月14日 完成大体框架，内容慢慢填充。
- 2014年08月23日 补充404问题，以及如何在不同电脑（系统）上使用Hexo。
- 2014年09月06日 新增自有域名二级目录无法访问，在主目录下添加md文件。
- 2014年09月09日 新增Hexo版本回退，Hexo所有命令报错。
- 2014年09月23日 新增Partial没有转义
- 2014年09月24日 新增添加社会化评论
- 2015年02月06日 新增本地添加SSH key，修复部分笔误