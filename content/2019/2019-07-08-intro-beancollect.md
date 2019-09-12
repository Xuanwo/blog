---
categories: Code
date: 2019-07-08T01:00:00Z
tags:
- beancount
- golang
series: "Self-made Wheels"
title: beancollect —— beancount 账单导入工具
url: /2019/07/08/intro-beancollect/
---

每一个 beancount 的使用者最终都会写一个自己的账单导入工具，我当然也不例外。

<!--more-->

## What

[`beancollect`](https://github.com/Xuanwo/beancollect) 是一个为 `beancount` 开发的账单导入工具，其设计目标是：简单，可靠。

- `beancollect` 不会直接修改用户的账单
- `beancollect` 总是显式的执行操作
- `beancollect` 不预测或依赖用户的特定行为或输入

## Why

beancount 的账单导入工具很多，为什么要自己写一个呢？

首先是因为我主要是用微信支付，而目前没有支持微信支付的账单导入工具；其次是我不喜欢大多数账单导入工具的设计，包括 beancount 原生自带的那一套。

## How

### Setup

`beancollect` 被设计用来与 `beancount` 一起工作，因此它需要在 `main.bean` 的项目文件夹中工作。

目前 `beancollect` 会去搜索当前目录下的 `collect` 目录，并读取其中的配置文件来完成初始化。推荐的结构如下：

```
├── account
│   ├── assets.bean
│   ├── equity.bean
│   ├── expenses.bean
│   ├── incomes.bean
│   └── liabilities.bean
├── collect
│   ├── global.yaml
│   └── wechat.yaml
├── main.bean
└── transactions
    └── 2019
        ├── 03.bean
        ├── 04.bean
        ├── 05.bean
        ├── 06.bean
        └── 07.bean
```

### Config

`beancollect` 目前支持如下配置：

```yaml
account:
  "招商银行(XXXX)": "Liabilities:Credit:CMB"
  "招商银行": "Assets:Deposit:CMB:CardXXXX"
  "零钱通": "Assets:Deposit:WeChat"
  "零钱": "Assets:Deposit:WeChat"

rules:
  - type: add_accounts
    condition:
      payee: "猫眼/格瓦拉生活"
    value: "Expenses:Recreation:Movie"
  - type: add_accounts
    condition:
      payee: "北京麦当劳食品有限公司"
    value: "Expenses:Intake:FastFood"
  - type: add_accounts
    condition:
      payee: "滴滴出行"
    value: "Expenses:Transport:Taxi"
  - type: add_accounts
    condition:
      payee: "摩拜单车"
    value: "Expenses:Transport:Bicycle"
```

其中 `account` 部分配置的是给定账单与实际账户的映射，`rules` 部分配置的是对符合条件的账单进行的操作。

### Schema

`beancollect` 目前仅支持 `wechat`，每种 `schema` 会有自己独立的配置，如果存在的话将会覆盖 `global.yaml` 中的配置。

### Rules

目前仅支持增加账户：

```yaml
- type: add_accounts
  condition:
    payee: "摩拜单车"
  value: "Expenses:Transport:Bicycle"
```

如果 `payee` 是 `摩拜单车` 的话，就在 `posting` 中增加账户 `Expenses:Transport:Bicycle`

---

项目地址在 <https://github.com/Xuanwo/beancollect>，欢迎大家提需求和反馈 BUG。
