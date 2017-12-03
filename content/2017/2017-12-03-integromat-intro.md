---
categories: Opinion
date: 2017-12-03T10:07:00Z
tags:
  - Share
  - Software
  - Automation
title: Integromat -- 最强大的自动化平台
url: /2017/12/03/integromat-intro/
---

![Integrmat Example](/imgs/opinion/integromat-example.png)

今天想跟大家分享一个类似于 IFTTT 的自动化平台： [Integromat](https://www.integromat.com)。与 IFTTT 最大的区别是它允许用户通过操作每一次请求的输入和输出来构建一个完整的链条，比如上图的这个例子就是实现了这样的一个功能：当完成 Todoist 中带有指定属性的任务时，将这个任务移动到 `Done` 列表，并将其放到 `Done` 列表的顶端。

接下来我会先简单地介绍一下 Integromat，然后讲解一下 Integromat 涉及到的一些元素，最后讲讲如何定制并调试自己的场景。

<!--more-->

## 0x00 介绍

Integromat 是由一家专门做系统集成和外包服务的公司 [Integrators](www.integrators.cz) 推出的产品，2012 年开始开发， 2016 年正式面向大众推出。目前团队中有 19 人，其中负责技术的有 9 人。他们愿景是要做互联网的胶水，同时自称 Integromat 是最先进的在线自动化平台，在使用了他们的服务之后我发现他们没有骗我。

## 0x01 特点

详细的特性列表可以参考此处： https://www.integromat.com/en/features ，下面我只列出一些我认为有用 & 特别的特性。

- 完整的 ACID 事务支持，拥有处理异常的能力
- 可视化操作界面，可以看到每一步操作的详细数据，调试便利程度 Max
- 支持路由功能，可以实现多条分支的处理
- 支持常用函数（数值，时间和字符串的常用操作，甚至还有正则）
- 支持解析 JSON 到预设的数据结构当中
- 支持 Webhook 和 定时器 两种触发器

作为一个互联网自动化爱好者，我先后使用过 [IFTTT](https://ifttt.com/)，[Zapier](https://zapier.com) 等商业服务，也部署过 [Beehive](https://github.com/muesli/beehive)，[Huginn](https://github.com/huginn/huginn) 这样的开源服务，但是没有一个像 Integromat 这么强大，更何况，它的界面也是相当的简洁好看。

## 0x02 概念介绍

强大的功能通常都意味着陡峭的学习曲线，Integromat 也不例外。为了实现上文中提到的诸多特性，Integromat 引入了很多概念，这使得它的上手难度比 IFTTT 和 Zapier 高上不少。但是 Integromat 的工程师们在前端的引导和设计上下了很多功夫，尽可能地降低了新用户的门槛。根据我的实际经验，有初步编程开发经验的同学只要摸索上几分钟就能上手，而零编程基础的同学如果不使用那些高级特性的话，只需要十几分钟就能捣鼓出一个实际可用的场景。

为了更好的帮助新同学使用 Integromat，下面我会简单的介绍一下 Integromat 涉及到的一些元素。

- Scenario（场景）：场景是 Integromat 中一系列任务的组合，相当于 IFTTT 中的 Applets。
- Service（服务）：服务是 Integromat 中预设好的一些服务，比如 Dropbox，Gmail 等，相当于 IFTTT 中的 Service。
  - Trigger（触发器）：满足一定条件的时候会触发这个服务
    - Instant（实时）：某些触发器会标着实时，这意味着这个触发器可以通过 Webhook 来实时触发，否则就只能使用 Integromat 的定时器来触发。
  - Action（操作）：这个服务通过一定的输入来执行对应的操作。
- Connection（联接）：联接是 Integromat 中绑定的服务，联接与服务是多对一的关系，可以通过创建同一个服务的多个联接来实现多帐号。
- Webhook：某些服务支持在满足某些条件的时候向预先设置好的 Webhook 发送信息，Integromat 可以创建这样的 webhook 来接受指定的信息，注意这个 Webhook 跟服务的触发器是绑定的。
- Key：Integromat 可以上传一些加密的文件来支持某些敏感的操作
- Device： 与 IFTTT 一样， Integromat 可以与一些设备绑定来支持设备相关的操作
- Data structure（数据结构）： 对于预设的服务，Integromat 已经事先解析好了对应的结构体，但是如果是自己创建的 Webhook，那需要自己定义好对应的数据结构，可以通过上传一个 JSON 文件来创建。
- Data store：Integromat 提供了一个简单的 KV 存储，用于在多个场景或者同一个场景多次执行中共享数据，可以进行 Get，Set 和 Del 等操作。

Integromat 涉及到的元素确实要比 IFTTT 多上不少，但是新同学刚刚上手的时候只需要了解 Scenario，Service 和 Connection 就已经足够了，剩下的高级特性可以之后慢慢摸索。

## 0x03 收费政策

Integromat 的收费政策可以参考： https://www.integromat.com/en/pricing ， 这里主要讲一下 Free 这一档：

> 免费用户每个月可以进行 1000 次操作，有 100 M的流量，定时器的最小间隔为 15 分钟。

所有用户的场景数量都是没有限制的，但是有着 1000 次的操作数量限制，在单个 Scenario 的历史记录当中可以看到每一次运行都进行了多少次操作。基本上可以看作有多少个 “圈” 就会有多少操作，没有执行到的部分不会进行计算。

对于轻度用户而言，1000 次操作基本上刚刚够用；如果不用来在网盘之间同步东西的话，100M 的流量是绰绰有余的。对于重度用户而言，花个 9 刀或者 29 刀购买套餐也是个不错的主意，这么强大的服务值得为止付费。

## 0x04 如何定制 & 调试

Integromat 的图形化界面已经足够优秀了，官方也提供了不少的教程，比如 [google sheet 中增加了一行就创建一个 tweet ](https://www.integromat.com/en/kb/tutorial/get-a-tweet-on-twitter-when-a-new-tweet-from-google-sheet-row-is-created.html)。

这里主要讲讲我感觉需要注意的一些地方：

- 每一个场景都必须从一个触发器开始。实际上每次创建一个场景，都会有一个无法删除的模块，你只需要点击并选择某个服务的触发器即可。
- 两个模块连接的地方会有一个漏斗标志，点开之后可以设置过滤器，如果条件不满足就会在这个地方中止。
- Connections 和 Webhook 不需要提前创建好，只需要在开发场景的时候选择 `Add` 即可。
- 所有的模块运行一次之后就会在右上方出现一个带数字的小圆，点开之后可以看到本次运行的实际数据。所以调试的时候可以点一次 `Run once`，然后就能看到真实的数据了，这样调试起来更加方便。
- 左下角有一个像飞机的图标 `Explain flow`，点击之后就会以动画的形式展示数据的流动。如果正在开发比较复杂的场景，不妨使用这个功能看看数据是怎么流动的。

## 0x05 总结

Integromat 适合以下人群：

- 觉得 IFTTT 反应太慢了/可定制化程度太低了/没有想要的功能的普通用户
- 想要跟自己的工作流做集成的工作人士
- 闲着没事干就想折腾黑科技的 Geek 们

> Have fun in automation!
