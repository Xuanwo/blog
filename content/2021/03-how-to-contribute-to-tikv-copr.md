---
categories: Code
date: 2021-02-03T01:00:00Z
tags:
    - tikv
    - rust
title: 如何为 TiKV Coprocesser 做贡献
---

[TiDB](https://github.com/pingcap/tidb/) 是 PingCAP 推出的开源分布式 SQL 数据库，而 [TiKV](https://github.com/tikv/tikv)  最初是作为 TiDB 的存储底层设计的，现在已经被 PingCAP 捐赠给 CNCF，作为一个通用的分布式 Key-Value 数据库存在。

从社区贡献者的角度来看，TiKV Coprocesser 模块可能是整个 TiKV 项目中最容易参与~~蹭~~贡献的模块：它与 TiKV 的其他部分关联性相对较弱，对存储/数据库背景知识的要求也更少。本文就来讲讲如何为 TiKV Coprocesser 模块 ~~（蹭 PR）~~ 做贡献。

## 介绍

正如最开始提到的，TiKV 是 TiDB 的存储底层，他们的关系如图所示：

![](architecture.png)

于是我们不难构建出这样的模型：

![](logic.png)

这个模型的问题在于：

- TiDB 与 TiKV 之间有大量的传输开销：以 `COUNT` 为例，应用只需要知道结果，但是 TiDB 还是需要从 TiKV 中列取所有的 KV 对。
- TiDB 节点的负载很大，但是 TiKV 的负载却很低，没有充分利用资源。

于是工程师们提出可以将一部分计算任务交给 TiKV，而在 TiKV 中负责这部分计算任务的模块叫做 Coprocessor，这个过程也叫做（算子）下推。

而具体到工程实现上，Coprocessor 在 TiKV 侧的实现可分为如下几部分：

> 此处的介绍均基于成文时 master 分支的最新 commit [aca3d67](https://github.com/tikv/tikv/tree/aca3d673eddbcbe57b7a1c26d05da04e10eb95ec)

- `components/tidb_query_aggr`：Coprocessor 中实现聚合函数的逻辑
- `components/tidb_query_common`：Coprocessor 的通用库
- `components/tidb_query_executors`：Coprocessor 的执行逻辑
- `components/tidb_query_expr`：Coprocessor 中实现的 expression 函数
- `components/tidb_query_codegen`：用于生成向量化实现的 codegen
- `components/tidb_query_datatype`：Coprocessor 中用到的数据类型

Coprocessor 自从提出到现在已经经历过数次变更：

**火山模型 -> 向量化模型**

在向量化模型刚提出时，社区要求贡献者同时提供非向量化和向量化的实现，而现在由于已经彻底过渡到向量化模型，所有非向量化的实现都已经移除了，所以只需要实现向量化即可。

此外，所有向量化的实现均由 `rpn_fn` 这个过程宏自动生成，所以贡献者不需要自行实现，后续我会介绍这个宏的用法。

**Raw based -> Chunk based**

为了减少内存占用，尽可能使用 SIMD 指令优化，社区提出了 [RFC: Using chunk format in coprocessor framework](https://github.com/tikv/rfcs/pull/43/files)。

目前该 RFC 已经基本实现完毕。在实现过程中社区为 `rpn_fn` 宏引入了一个新的配置项叫做：`nullable`，表明这个函数需要自行处理输入参数含有 `None` 的逻辑，实现了对旧有实现的兼容。

## rpn_fn 介绍

`rpn_fn` 的实现位于 `components/tidb_query_codegen/src/rpn_function.rs`，它的主要作用是为函数生成向量化实现。

```rust
#[rpn_fn]
fn foo(x: Option<&u32>) -> Result<Option<u8>> {
    Ok(None)
}
```

`rpn_fn` 常用的参数如下所示，更多的细节请参见 `rpn_fn` 的注释和具体实现。

### nullable

`nullable` 是为了兼容旧实现而增加的参数。

如果函数带 `nullable`，那它需要传入形如 `Option<X>` 的参数，比如：

```rust
#[rpn_fn(nullable)]
#[inline]
pub fn logical_and(lhs: Option<&i64>, rhs: Option<&i64>) -> Result<Option<i64>> {
    ...
}
```

如果函数不带 `nullable`，那 `rpn_fn` 会为其生成 `None` 处理的逻辑：只要输入参数至少有一个含有 `None` 那就返回 `Ok(None)`。生成的逻辑中会进行很多优化，比自行处理要好很多，所以社区鼓励当函数的行为符合这一要求时，就去掉 `nullable`。

```rust
#[rpn_fn]
#[inline]
pub fn length(arg: BytesRef) -> Result<Option<i64>> {
    Ok(Some(arg.len() as i64))
}
```

### writer

`writer` 是针对返回值为 `BytesRef` 函数的优化，设计的细节可以参见 [RFC](https://github.com/tikv/rfcs/pull/43/files)。

以 `repeat` 为例：

```rust
#[rpn_fn(writer)]
#[inline]
pub fn repeat(input: BytesRef, cnt: &Int, writer: BytesWriter) -> Result<BytesGuard> {
    let cnt = if *cnt > std::i32::MAX.into() {
        std::i32::MAX.into()
    } else {
        *cnt
    };
    let mut writer = writer.begin();
    for _i in 0..cnt {
        writer.partial_write(input);
    }
    Ok(writer.finish())
}
```

### capture

`capture` 用于捕获调用函数时传递的变量，比较常用在时间相关的处理逻辑中，因为 SQLMode， 时区之类的信息是存储在调用函数时传递的 `EvalContext` 中的，比如：

```rust
#[rpn_fn(capture = [ctx])]
#[inline]
pub fn date(ctx: &mut EvalContext, t: &DateTime) -> Result<Option<DateTime>> {
    if t.invalid_zero() {
        return ctx
            .handle_invalid_time_error(Error::incorrect_datetime_value(t))
            .map(|_| Ok(None))?;
    }

    let mut res = *t;
    res.set_time_type(TimeType::Date)?;
    Ok(Some(res))
}
```

### varg

`varg` 用来处理输出一组同类型参数的函数，可以与 `min_args` / `max_args` 配合使用。

使用方式参考：

```rust
#[rpn_fn(varg, writer, min_args = 1)]
#[inline]
pub fn concat(args: &[BytesRef], writer: BytesWriter) -> Result<BytesGuard> {
    let mut writer = writer.begin();
    for arg in args {
        writer.partial_write(arg);
    }
    Ok(writer.finish())
}
```

## 内容

最适合社区贡献者的内容就是实现 Expression 函数，也就是 MySQL 中的 `add_time` / `add_durtion` 等函数。根据上文中提到的 Coprocessor 变迁，目前模块中需要贡献的 expr 函数状态如下：

- 完全没有实现（包括之前只有非向量化实现的函数，它们在 master 分支中已经被删除了）
- 有实现但是可以去 `nullable` 化
- 返回值是 `BytesRef` 但是没有加 `writer`

对于完全没有实现的函数可以浏览 [UCP: Migrate functions from TiDB](https://github.com/tikv/tikv/issues/5751) 挑选自己感兴趣的来实现（具体的实现需要参考 [TiDB 侧的逻辑](https://github.com/pingcap/tidb/tree/master/expression)），对于后面两种可以在 `components/tidb_query_expr` 下搜索关键词来进行修改。

此外，TiKV 在最近的迭代中加入了 UTF-8 Collation 的支持，所以部分 UTF-8 相关的函数需要重构以支持 Collation，Issue 可以参见: [copr: UTF8 functions should consider collation #8986](https://github.com/tikv/tikv/issues/8986)。

最后，新一期的 LFX Mentorship 计划即将开始了，本次 TiKV 提交的 Idea 包括 Coprocessor Plugin 和 TiKV compile on Windows 等，感兴趣的同学可以加入 <https://tikv-wg.slack.com/> 的 #lfx-mentorship channel 以了解最新动态。

## 好处

无利不起早，大家都是俗人，为什么要在工作之余花费心力为别的项目做贡献呢？

在我的角度看，为 TiKV 做贡献有这样几个好处：

- 可以直接学习生产级别的 Rust 代码，包括性能优化，接口设计，边界判断的技巧；
- 可以直接参与一个开源项目的运作，包括项目组织，计划，安排，沟通等；
- 可以了解一个分布式存储是如何实现的，相比于具体的实现，更重要的方面在于它遇到了什么样的问题，它是如何解决的，利弊都在哪里。

具体到为 TiKV Coprocesser 做贡献，我理解的好处是这样的：

- 上手门槛更低，学习曲线更平滑，沟通的成本也较低；
- Coprocesser 想象空间很大，目前正在进行很多前沿的实践，比如说基于 wasm 实现插件化等，上限很高；
- sig-copr 的同学们都超有趣，每天水 channel 都很有意思（误。

## Tips

- 在贡献过程中遇到任何问题都可以来 <https://tikv-wg.slack.com/> #sig-copr 频道询问（中英文皆可），可以获得勇斗恶龙的迟先生手把手指点。
- TiKV 是 Apache 2.0 协议授权的开源项目，所有代码版权均属于 CNCF
- TiKV 要求所有 commit 都进行 sign-off，请在 commit 代码时使用 `git commit -s`
- 运行完整的单元测试会耗时很久，可以在根目录下运行 `cargo test -p tidb_query_expr` 来只测试 expr 模块。
- 不需要特别深厚的 Rust 背景，只需要能看懂别人的代码并模仿即可，Reviewer 会提出修改意见，这正是学习 Rust 的大好机会（