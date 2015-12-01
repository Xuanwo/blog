title: Hexo常见问题解决方案
date: 2014-08-14 05:20:00
tags: [Software, Hexo, Github-Pages, Blog]
categories: Opinion
toc: true
---
# 介绍
Hexo是一个非常好用的静态博客生成器，但是由于很多方面的原因，导致在使用过程中经常出现错误。这些错误中，有些是因为自己的设置不当，导致程序报错；有些是因为版本更迭，导致原有的设置失效；而有些，则是Hexo程序本身的BUG。
本文旨在尽可能的解决前两类问题，缓解Hexo项目大量重复issues的现象。当然，我个人的力量是有限的，因此也希望使用Hexo的大家也能一起行动起来，通过[提交PR](https://github.com/Xuanwo/xuanwo.github.io/pulls)，[发布issues](https://github.com/Xuanwo/xuanwo.github.io/issues)或者在下方评论等形式参与到本文档的编辑中来。
同时，也希望有能力的人可以将本文档翻译成英文，以帮助到更多的人。
浏览时，使用`Ctrl+F`搜索关键词或使用目录来定位问题。

**本文欢迎转载，但是恳请保留贡献者信息，谢谢。**

<!-- more -->

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

检查Git的相关配置，将git所在目录添加到系统path中去。

### Deploy设置错误

**问题描述：**

输入`hexo deploy`后，出现错误信息：


```

'github' does not appear to be a git repository

```


**解决方案：**

1. 检查`_config.yml`中deploy设置。参见<http://hexo.io/docs/deployment.html>。
2. 删除`.deploy_git`文件夹并且执行`hexo clean`后，重新`hexo deploy`。

## Deploy之后，页面长时间404

**问题描述：**

![Github 404 孩子不哭](/imgs/opinion/Github-404.png)

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

1. 检查`_config.yml`中的内容，特别注意`:`后面需要有一个空格。
2. 检查`package.json'中的内容，注意添加hexo信息用来标识这是一个hexo目录：


```

{
  "hexo": {
    "version": ""
  }
}

```


3. 如果还是有问题，可以更新hexo之后，在新的文件夹中重新进行`hexo init`。

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
![就像这样](/imgs/opinion/hexo-languages-error.png)
*感谢[@dukewan](https://github.com/dukewan)提供的截图*

## 修改主题文件之后，网页不更新

**问题描述：**

在修改主题文件之后，页面的文件依然没有更新。

**解决方案：**

`hexo clean`并且删除`.deploy_git`文件夹之后，`hexo d -g`。为了强制浏览器更新资源文件，可以采用'Ctrl+F5'来刷新。

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

## 更新至3.0.0版本后，文件渲染时卡死

**问题描述：**

[参见Issues](https://github.com/hexojs/hexo/issues/1137)
表现为文件不多，但是渲染非常缓慢，超过半个小时。

**问题分析：**

问题出在`Highlight.js`在判断语言类型时，会因为`-`这个符号导致卡死。

**解决方案：**

在使用代码块时，明确使用类型，或者全部使用`plain`类型，如下：

{% raw %}

```

plain
something

```

{% endraw %}

## 升级至Hexo 3.0版本后，deploy报错

**问题描述：**

[参见Issues](https://github.com/hexojs/hexo/issues/1013)
升级之后，本来可以deploy的设置出现报错，内容为：


```

ERROR Deployer not found: github

```


**问题分析：**

Hexo3.0与以往版本最大的改变在于，更多的模块都从主程序中剥离了出来，其中就包括deploy的相关模块。

**解决方案：**

首先需要安装对应的deploy模块，目前Hexo支持以下服务器的一键部署：


```

git
heroku
rsync
openshift

```


安装命令为：


```

npm install hexo-deployer-git --save //将git替换为别的名字就可以安装对应模块

```


然后对`_config.yml`做如下设置：


```

deploy:
  type: git   //非git请参考官方文档中的设置
  repo: <repository url>
  branch: [branch]
  message: [message]

```


## Mac OS安装Hexo出错

**问题描述：**

[参见Issues](https://github.com/hexojs/hexo/issues/1326)
命令行返回ERROR：


```

{ [Error: Cannot find module './build/Release/DTraceProviderBindings'] code: 'MODULE_NOT_FOUND' }
{ [Error: Cannot find module './build/default/DTraceProviderBindings'] code: 'MODULE_NOT_FOUND' }
{ [Error: Cannot find module './build/Debug/DTraceProviderBindings'] code: 'MODULE_NOT_FOUND' }

```


**解决方案：**

使用命令`npm install hexo --no-optional`

---

# 常见问题

## 如何在不同电脑（系统）上使用Hexo

使用`Git`来管理自己的`Blog`文件夹，需要注意一下几点。

1. 如果主题是通过git管理的，需要将主题文件夹下的`.git`文件夹删除或者使用git submodule的形式进行管理，才能同步Blog文件夹。

2. Blog目录下自带的`.gitignore`文件，`node_modules`文件夹是不会同步的，所以同步之后需要自己再次进行`npm install`，但是注意，不要进行`hexo init`了，否则`_config.yml`会被覆盖。

然后看一下同步之后的目录结构：
<https://github.com/Xuanwo/xuanwo.github.io/tree/blog>

## 使用git submodule来管理主题

Todo

## 在主目录下添加`README.md`文件或者html文件

### Hexo3.0以下使用

**感谢[@TimNew](http://timnew.me/)提供的思路**

正如大家所知道的，在source文件夹下的所有md文件都会被hexo渲染成html文件，导致`README.md`文件不能好好的放在里面了，即使是添加了`layout: false`依然没有用。

不过现在有一个另外的好办法，那就是利用主题的source目录，也就是`themes/themes-name/source`。因为这个文件夹里面的所有文件都会被复制到网站的根目录中去，也就是说，如果在里面放上`README`，就可以正常的存在于网站的主目录了。

同样的，对于一些需要在网站下添加html文件的需求也可以这样来达成。比如百度或者谷歌在验证站长权限的时候，通常都会要求在主目录下添加一个html文件。同样的，只要把这个文件放在`themes/themes-name/source`就可以搞定了。

### Hexo3.0以上支持

**使用`_config.yml`下的`skip_render`参数。**

`skip_render`使用了[`minimatch`](https://github.com/isaacs/minimatch)，开始匹配的位置是基于你的`source_dir`的，一般来说，是你的`source`文件夹下。下面我分别列举几种常见的情况进行说明：

*请注意yml中的文件格式，输入单个数据请注意空格，输入数组请进行缩进*

1. 单个文件夹下全部文件：`skip_render: test/*`
1. 单个文件夹下指定类型文件：`skip_render: test/*.md`
1. 单个文件夹下全部文件以及子目录:`skip_render: test/**`
1. 多个文件夹以及各种复杂情况：


```

skip_render:
    - `test1/*.html`
    - `test2/**`

```


## Hexo版本回退

有时候更新之后发现新版本的Hexo不能按照预期的方式工作，这时候就需要使用版本回退功能。
打开命令行，输入`npm install -g hexo@版本号`就可以回退到没有出现问题的版本上来。

*这个命令适用于所有Node.js模块*

> 少数情况下会出现Node.js版本问题，可以使用`nvm install 版本号`来安装报错信息中需要的版本。

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
[使用Github SSH Key以免去Hexo部署时输入密码](http://xuanwo.org/2015/02/07/generate-a-ssh-key/)

## 多git部署

参考[hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)插件README进行配置：


```

deploy:
  type: git
  message: [message]
  repo:
    github: <repository url>,[branch]
    gitcafe: <repository url>,[branch]

```


请注意每一个冒号后面的空格，如果丢失会导致yml文件读取错误。

## 开启全站https

Todo

# 贡献者
- [@Xuanwo](http://xuanwo.org/)
- [@TimNew](http://timnew.me/)
- [@tommy351](http://zespia.tw/)

# 更新日志
- 2014年08月14日 完成大体框架，内容慢慢填充
- 2014年08月23日 补充404问题，以及如何在不同电脑（系统）上使用Hexo
- 2014年09月06日 新增自有域名二级目录无法访问，在主目录下添加md文件
- 2014年09月09日 新增Hexo版本回退，Hexo所有命令报错。
- 2014年09月23日 新增Partial没有转义
- 2014年09月24日 新增添加社会化评论
- 2015年02月06日 新增本地添加SSH key，修复部分笔误
- 2015年02月07日 SSH key生成独立成篇
- 2015年04月01日 添加了部分Hexo3.0带来的问题，新增了`skip_render`参数设置
- 2015年04月03日 添加了Hexo3.0中deploy设置
- 2015年08月09日 添加了多git部署，Mac OS安装出错，更新了`skip_render`参数设置以及部分文本说明
- 2015年09月05日 添加了开启全站https以及主题管理，修复了代码显示BUG，删除了部分口水话