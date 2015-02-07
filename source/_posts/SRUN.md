title: 深澜HTML登陆——防掉线，开共享
date: 2014-10-3 20:38:27
tags: [Web]
categories: Opinion
toc: true
---
# 前言
一直以来使用的是老版的SRUN3000.exe客户端，同时也忍受着老版客户端频繁掉线以及莫名卡死等诡异问题。来到实验室之后，老版客户端出现了秒退的现象，刚登陆就提示“检测到代理服务，已自动下线”；使用新版的客户端，则提示“与绑定的IP不一致或开启了共享，balabala”。看来深澜的限制已经影响到我的正常使用了，不如自己捣鼓一下吧。下面直接放出解决方案（地大专用），如果对原理感兴趣的可以继续往下看。

<!-- more -->

# 解决方案
[点击下载网页登陆版深澜客户端](http://pan.baidu.com/s/1eQgo9bG)

# HTML源代码
## IPv4登陆
```
<!DOCTYPE HTML>
<html>
	<head>
    	<meta charset="utf-8" />
    	<title>Srun Login!</title>
        <script type="text/javascript">
			function submit() {
				document.getElementById('submit').click();
			}
        </script>
    </head>
    <body onload="submit();">
        <form action="http://202.204.105.195:3333/cgi-bin/do_login" method="post">
            <!--将账号，密码，MAC地址分别填写进value=""的俩冒号中，例如value="1234567"-->
            <p>账号：<input name="username" value=""></p>
            <p>密码：<input type="password" name="password" value=""></p>
            <p>MAC：<input name="mac" type="hidden" value=""></p>
            <input name="n" type="hidden" value="99">
            <input name="type" type="hidden" value="3">
            <p><input type="submit" id="submit" value="OK" /></p>
        </form>
    </body>
</html>
```
## IPv6登陆
```
<!DOCTYPE HTML>
<html>
	<head>
    	<meta charset="utf-8" />
    	<title>Srun Login!</title>
        <script type="text/javascript">
			function submit() {
				document.getElementById('submit').click();
			}
        </script>
    </head>
    <body onload="submit();">
        <form action="http://[2001:da8:214:102:d6be:d9ff:feaa:422a]/cgi-bin/do_login" method="post">
            <!--将账号，密码，MAC地址分别填写进value=""的俩冒号中，例如value="1234567"-->
             <p>账号：<input name="username" value=""></p>
            <p>密码：<input type="password" name="password" value=""></p>
            <input name="n" type="hidden" value="100">
            <input name="is_pad" value="1">
            <input name="type" type="hidden" value="1">
            <p><input type="submit" id="submit" value="OK" /></p>
        </form>
    </body>
</html>
```
## login页面
```
<!DOCTYPE HTML>
<html>
	<head>
    	<meta charset="utf-8" />
    	<title>Srun Login!</title>
        <style type="text/css">
			iframe {
				border:none;
				width:100%;
				display:block;
			}
		</style>
    </head>
    <body>	
        <iframe src="ipv6.html">
        </iframe>
        <iframe src="ipv4.html">
        </iframe>  
    </body>
</html>
```

# 鸣谢
- [@Austin Lee](http://imnerd.org/srun-login-by-html.html)
- [@范神](http://www.freemeepo.com/)
- @嘉琦学长

# 更新日志
- 2014年10月3日 捣鼓了一天，总算能用了。期间因为对POST的错误理解，还绕了一个大弯子。以后再完善吧，争取做出一个可用的版本，不用复杂的配置，可移植性强。