---
categories: Opinion
date: 2018-01-14T10:07:00Z
tags:
  - Share
  - Software
  - Automation
title: 基于 AWS Lambda 实现自动化
url: /2018/01/14/automation-based-on-aws-lambda/
---

在上一篇文章中我们介绍了 [Integrmat](https://xuanwo.org/2017/12/03/integromat-intro/) 这个自动化平台，但是在实际的应用当中，它还是有一些不太符合我们项目需求的地方。基于 AWS Lambda 实现的自动化工具就是我们找到的替代方案，接下来我会将阐述一下项目的需求，然后根据对项目的需求分析为什么 Integrmat 不适合以及基于 AWS Lambda 实现的好处在哪里。之后会介绍一下 AWS Lambda 是什么以及如何实现我们的自动化工具，并分享一些在实现自动化工具中遇到的一些坑。

<!--more-->

## 项目需求

我们项目中主要有一下几个部分需要用到自动化工具：

- 在 Jenkins 上运行的自动构建出错时自动在 Trello 中创建 Card
- Grafana 报警时自动在 Trello 中创建 Card
- 移动到 Done 列表的超过两周的 Card 自动归档

### Why not Integrmat

以 `Jenkins 出错后在 Trello 中创建 Card` 这个需求为例，我们需要的不仅仅是简单的出错之后加个 Card 就可以了。我们需要的是一个 Jenkins 出错到恢复的全生命周期的管理，也就是说根据上一次 Jenkins Job 执行的状态和本次状态，我们会有如下几种情况：

上次状态 | 本次状态 | 执行操作
---- | ---- | -----
成功 | 成功 | 忽略
成功 | 失败 | 创建一个新 Card
失败 | 失败 | 在之前创建的 Card 中增加新的评论
失败 | 成功 | 归档对应的 Card

这就会带来除了创建 Card 之外额外的操作次数调用，而这些都是计费的。

不仅如此，我们的 Jenkins 每天 24 小时都在不停的执行 Job，按照并行三个 Job，单个 Job 执行 1 分钟来计算，每天会触发 8640 次。每次 Job 如果失败的话需要操作大约 5 次，成功的话需要操作 2 次。按照 1% 的失败率来计算，我们一个月需要的操作数为 596160 次。对应到 Integrmat 的收费政策，我们需要开通每月 299 刀的最顶级套餐 = =。

Integrmat 在其优质服务，良好体验的背后，带来是不菲的开销。显然，此路不通。

### Why AWS Lambda

分析完了上面的为什么不是 Integrmat 之后，使用 AWS Lambda 的理由就变得非常明显了。

- 不想自己从头撸一个 FaaS 框架
- AWS Lambda 很便宜

AWS 提供的免费套餐中有着如下几条：

- Lambda 每月 100 万个免费请求 （永久）
- DynamoDB 25GB 存储 （永久）
- API Gateway 每月接收 100 万次 （12 个月免费）

结合前面的计算，AWS 的免费套餐已经完全可以覆盖我们的需求。

## AWS Lambda / FaaS 介绍

FaaS 是指给 Function 提供运行环境和调度的服务，而 AWS Lambda 则是目前 FaaS 中运用比较广泛的一个服务。用户只需要实现业务逻辑，将代码上传到 AWS 之后，AWS 会负责处理接下来的所有事情：调度，伸缩，高可用，日志等等。而这些只有在方法被调用的时候才会计费，可以真正的做到按需运行，按毫秒计费。更详细的介绍可以看老王之前写的一篇文章 —— [Serverless/FaaS 的现状和未来](http://jolestar.com/serverless-faas-current-status-and-future/)。

> 需要说明的是，从理论上来说任何 FaaS 框架都可以用来实现本文中描述功能，本文以 AWS Lambda 为例只是因为我们项目中刚好在用以及比较便宜而已，并不代表本人的任何倾向。老王的文章中也有介绍各个平台的 FaaS 服务，感兴趣的同学可以去看一看。

## 如何实现自动化

我们主要用到了以下工具：

- Lambda
- DynamoDB
- API Gateway
- CloudWatch

其中 Lambda 会提供函数运行的环境，我们主要使用了 Python 3.6。Lambda 每次运行都是一个完全独立的环境，我们需要接入 DynamoDB 来提供持久化存储的能力。API Gateway 则会对外暴露出一个链接作为 Webhook 来触发 Lambda 运行，CloudWatch 除了收集日志之外，还能够定时触发任务。这四件套下来，基本上就能够覆盖我们开发自动化工具所需要的大部分功能。下面我们就以 `Jenkins 出错后在 Trello 中创建 Card` 这个需求为例，讲解一下如何实现基于 AWS Lambda 的自动化工具。

### 创建函数

- 进入 Lambda 的界面，点击右上方的 `创建函数`。
- 选择 `从头开始创作` 即可。
- 填写函数的名字，这个名字在创建好之后是不能修改的。
- 选择运行语言，根据自己的喜好选择即可
- 选择运行角色，这里我推荐 `创建自定义角色`。为每一个函数都创建一个独立的角色，这样方便控制权限，以后比较容易分得清。AWS 的 IAM 超级恶心，这是我摸索出来的不太容易出问题的步骤。对 AWS IAM 熟悉的同学可以忽略我的建议。
- 点击 `创建函数`

这样我们的一个函数就创建好了。

### 接入服务

为了能够实现我们上述的需求，我们还需要接入对应的服务： DynamoDB，API Gateway 和 CloudWatch。其中每个函数会默认添加一个 CloudWatch，因此不需要再做额外的配置。DynamoDB 和 API Gateway 都建议先再外部创建好，然后再在 Lambda 中去添加，要不然 AWS 自动创建的 IAM 规则会非常乱，很容易出现各种奇怪的问题。如果对稳定性要求比较高的同学可以将 API Gateway 绑定到一个固定的 version 上，比如创建一个 version 叫做 `production`，然后再将 `production` 指向某个具体的版本，这样可以保证线上运行的代码始终是不变的，同时也方便使用 API Gateway 的流量调度来做一些灰度测试之类的。没有这方面需求的同学，可以直接将 API Gateway 绑定到 `$LASTEST` 上，这样所有的请求都会由最新的代码来执行。

### 编辑函数

函数创建好之后就进入了函数的配置界面。这个地方 AWS 嵌入了 Cloud9 的在线编辑器，自带语言高亮，缩进和提示，还是比较好用的。当然除了在线编辑之外也可以上传 zip 包或者选择从 S3 上传，之后用到的时候再讲。

```python
import os
import json
import boto3
from trello import TrelloClient

trello = TrelloClient(
    api_key=os.environ['TRELLO_API_KEY'],
    api_secret=os.environ['TRELLO_API_SECRET'],
    token=os.environ['TRELLO_TOKEN'],
    token_secret=os.environ['TRELLO_TOKEN_SECRET']
)
board = trello.get_board(os.environ['TRELLO_BOARD_ID'])
todo_list = board.get_list(os.environ['TRELLO_TODO_LIST_ID'])
done_list = board.get_list(os.environ['TRELLO_DONE_LIST_ID'])

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

SUCCESS = ['SUCCESS']


def main(event, context):
    event = json.loads(event['body'])
    name = event['name']
    status = event['build']['status']

    q = table.get_item(Key={'project': name})
    # Create a new card if this project is not exist.
    if 'Item' not in q:
        # Nothing need to do if event is successful.
        if status in SUCCESS:
            return
        card = todo_list.add_card(
            name='%s #%d Build %s' % (name, event['build']['number'], status),
            desc=event['build']['full_url'],
            position='top'
        )
        table.put_item(Item={
            'project': name,
            'status': status,
            'card_id': card.id
        })
        return

    # If project exists, we should update card depends on project status.
    item = q['Item']
    card = trello.get_card(card_id=item['card_id'])

    if status in SUCCESS:
        table.delete_item(Key={'project': name})
        card.comment(
            '%s #%d Build %s\n%s' %
            (name, event['build']['number'], status, event['build']['full_url']))
        card.set_closed(True)
        return

    if status not in SUCCESS:
        card.comment(
            '%s #%d Build %s\n%s' %
            (name, event['build']['number'], status, event['build']['full_url']))

    return
```

以上就是我们实现 `Jenkins 出错后在 Trello 中创建 Card` 的全部代码。有几个需要拿出来单独讲一下的地方：

- 函数运行是调用的 Handler 函数是可以修改的，比如这里就是修改成了 `main.main`，Lambda 会在代码中寻找 `main.py` 文件并执行该文件中的 `main` 函数。
- Handler 函数主要接收两个参数，event 与 context，event 中就是外部传入的数据。如果在 Lambda 外面套了 API Gateway 的话，API Gateway 会增加额外的内容，并且把请求体放到 `event['body']` 中，因此我们需要 `json.loads(event['body'])` 才能取到外部传过来的真实值。
- Lambda 环境中自带了 boto3 并且与 IAM 集成了，因此可以不需要额外的认证直接调用已经授权的服务，比如这个地方用到的 `dynamodb`。
- Lambda 支持设置环境变量，因此可以将一些参数都放到环境变量中并通过 `os.environ` 来读取。
- 如果要在 Lambda 中引用外部的库，则需要将这些库一起打包上传。以这里的 `trello` 库为例，我们需要执行 `pip install py-trello -t .` 将这个库及其相关依赖下载到当前目录，然后使用 `zip -r ../code.zip *` 压缩后上传。

具体的实现就不再多讲，相信大家都能看懂。

### 调试函数

在代码写好之后，我们可以在页面直接调试。页面右上方可以配置一些测试事件，点击 `保存` 后点 `测试` 即可直接运行。运行结果会有对应的日志展示出来，也可以到 CloudWatch 中去查看更为完整的日志，根据日志反馈的情况修改自己的代码即可。

> 从国内上传代码很是恶心，开着代理也经常出问题，不知道啥原因。

## 总结

这篇文章主要介绍了如何基于 AWS Lambda 来实现一个自动化脚本。

优点：

- 除了偶尔请求 timeout 之外，服务很稳定，上线之后不用费心维护
- 自动集成的 CloudWatch 日志挺好用，调试很方便

缺点：

- 调试的过程比较麻烦，不能接入外部的 Git 服务，只能用 AWS 自己的那个
- 上线的脚本多了之后维护起来很麻烦，没有一个统一管理的方案
- 强依赖 AWS 自己的服务，日后迁移要大改脚本

---

## 动态

- 这篇文章是一月份写的，但是一直到今天（2018.3.4）才写好结尾发出来 = =
- 我的 github profile 是有多像一个前端以至于所有公司给我发的 JD 都是前端？
- 尼尔半价了，2B 小姐姐赛高
- 我永远喜欢薇尔莉特.jpg
