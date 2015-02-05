title: VPS搭配Github Webhook实现Hexo自动发布
date: 2015-2-5 23:22:30
tags: [Blog, Github-Pages, VPS, Hexo]
categories: Opinion
toc: true
---

# 前言
自从买了VPS之后，我的人生就多了一个需要思考的问题——我的VPS还能用来干嘛？然后想到Github有一个Webhook的功能，可以在每一次提交之后发送一个POST到指定的URL。那么，只要找一个办法获取这个POST，再执行指定的命令，可以实现Hexo的自动发布功能了。从此以后，不管在哪里，我只要修改我的md文件，push之后我的服务器就能自动进行编译并且部署了。

# 配置Nginx

## 安装Nginx

使用apt-get程序来安装nginx
```
apt-get update
apt-get install nginx
```
在浏览器中访问http://your-ip-address or domain/， 如果看到`Welcome to nginx!`字样，说明Nginx已经安装成功了。

## 配置Nginx

修改`/etc/nginx/sites-available/default`文件，在`serve`的框里面的空行中输入：
```
location /update {
proxy_pass http://127.0.0.1:1111;
}
```
这样设置之后`http://your-ip-address or domain/update`访问就会被重定向到1111端口。

## 重启Nginx

输入：
`/etc/init.d/nginx restart`

# 配置Git

## 安装Git

输入：
`apt-get install git`

## 下载自己的代码库

输入：
`git clone yourgit yourdir`

# 配置Python

## 安装Python环境

输入：
`apt-get install python-pip`
然后系统会自动完成相关的配置。

## 编辑Python文件

输入：
```
cd ~/yourdir
vi hook.py
```
在打开的vim界面中，点击一下`i`，进入insert模式，然后粘贴以下代码：
```
#!/usr/bin/env python3
#-*- coding:utf-8 -*-
# start a python service and watch the nginx request dog

from http.server import HTTPServer,CGIHTTPRequestHandler
from threading import Thread,RLock
import subprocess
import logging
import sys
import os.path


_PWD=os.path.abspath(os.path.dirname(__file__))
def execute_cmd(args,cwd=None,timeout=30):
    if isinstance(args,str): args = [args]
    try:
        with subprocess.Popen(args,stdout=subprocess.PIPE,cwd=cwd) as proc:
            try:
                output,unused_err = proc.communicate(timeout=timeout)
            except:
                proc.kill()
                raise
            retcode = proc.poll()
            if retcode:
                raise subprocess.CalledProcessError(retcode, proc.args, output=output)
            return output.decode('utf-8','ignore') if output else ''
    except Exception as ex:
        logging.error('EXECUTE_CMD_ERROR: %s',' '.join(str(x) for x in args))
        raise ex

class HttpHandler(CGIHTTPRequestHandler):
    _lock = RLock()
    _counter = 0
    _building = False

    def build(self):
        with HttpHandler._lock:
            if HttpHandler._counter == 0 or HttpHandler._building:
                return
        HttpHandler._counter = 0
        HttpHandler._building = True
        logging.info("BUILDING NOW...")
        try:
            resp = execute_cmd(os.path.join(_PWD,'build.sh'),cwd=_PWD,timeout=600)
            logging.info(resp)
        finally:
            HttpHandler._building = False
            self.build()

    def do_GET(self):
        self.do_POST()
    def do_POST(self):
        self.send_response(200,'OK')
        self.end_headers()
        self.wfile.write(b'OK')
        self.wfile.flush()
        with HttpHandler._lock:
            HttpHandler._counter += 1
        Thread(target=self.build).start()

if __name__ == '__main__':
    logging.basicConfig(format='%(asctime)s %(levelname)s: %(message)s',level=logging.INFO)

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 1111
    logging.info('starting the server at 127.0.0.1:%s',port)
    httpd = HTTPServer(('127.0.0.1',port),HttpHandler)
    httpd.serve_forever()
```
编辑完成后，输入`:wq`退出vi。

# 编辑sh文件

切换到yourdir，然后输入：
`vi build.sh`
在打开的vi界面中，点击`i`进入编辑模式，然后输入：
```
#!/bin/bash
echo "build at `date`"
. ~/.nvm/nvm.sh
nvm use 0.10.36
cd ~/xuanwo
git pull
hexo clean
hexo d -g
echo "built successfully"
```
编辑完成后，输入`:wq`退出vi。

# 后台运行Python脚本进行监视

运行：
`nohup python3 ~/xuanwo/hook.py >> /tmp/hook.log 2>&1 &`
**每次重启VPS后，貌似都需要运行一次**

# 更新日志
- 2015年2月6日 首次发布
