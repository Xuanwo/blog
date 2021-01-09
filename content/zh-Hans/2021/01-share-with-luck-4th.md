---
categories: Daily
date: 2021-01-09T05:00:00Z
tags:
    - rust
    - golang
series: "Share with luck"
title: 随缘分享第 4 期
---

## 文章

 [Adding BPF target support to the Rust compiler](https://confused.ai/posts/rust-bpf-target)

介绍了 BPF 与 Rust 编译模型上的差异，提出了自己的解决方案，现在 Rust 已经初步支持将 rust 代码编译为  `bpfel-unknown-none` 和 `bpfeb-unknown-none` 了（区别在于 little endian 和 big endian）

[Go 1.16 Release Notes](https://tip.golang.org/doc/go1.16)

几个比较关注的事情：

- `//go:embed` 支持，终于可以抛弃各种 embed 工具了
- `go get` 之类的命令操作不会再修改 go.mod file 了
- 新的接口: `io/fs` 定义了 `fs.FS`
  ```golang
  type FS interface {
    // Open opens the named file.
    //
    // When Open returns an error, it should be of type \*PathError
    // with the Op field set to "open", the Path field set to name,
    // and the Err field describing the problem.
    //
    // Open should reject attempts to open names that do not satisfy
    // ValidPath(name), returning a \*PathError with Err set to
    // ErrInvalid or ErrNotExist.
    Open(name [string](https://tip.golang.org/pkg/builtin/#string)) ([File](https://tip.golang.org/pkg/io/fs/#File), [error](https://tip.golang.org/pkg/builtin/#error))
  }
  ```

[现代科研指北](https://bookdown.org/yufree/sciguide/) 

这其实已经不能算作文章了，是一本关于现代科研的电子书。尽管主题是关于科研的，但是我觉得工业界的同学们也不妨一读：全栈科学家的提法感觉与全栈工程师（尽管这些年已经不流行了）非常相似，或许有所借鉴之处。

[现代微处理器架构 90 分钟入门](https://www.starduster.me/2020/11/05/modern-microprocessors-a-90-minute-guide/)

[@Stardust](https://www.starduster.me) 翻译的这篇长文非常适合在讨论 Apple M1 之前阅读。

[Rimworld 1.0版：Mod推薦之輔助Mod](https://m.gamer.com.tw/home/creationDetail.php?sn=4405389)

Rimworld 好玩是好玩，但是有些操作实在是过于枯燥还坑爹（比如把木门换成钢铁门的时候整个房间就漏气了），本文推荐的 Mod 可以根据自己的需要尝试一下。

[Why write your own programming language?](https://mukulrathi.co.uk/create-your-own-programming-language/intro-to-compiler/)

本文不仅能够用来回答为什么要写自己的语言，也能用来回答为什么要造 XXX 轮子这样的问题：

> 1.  It’s fun
> 2.  It’s cool to have your own programming language
> 3.  It’s a good side-project

[《矮人要塞》开发者：我们的游戏永远不会完工](https://www.chuapp.com/?c=Article&a=index&id=287369)

看完这篇文章我非常感动，然后打开 Steam 下单买了 Rimworld（

[GitHub 的意义和 GitLab 的创新](https://mp.weixin.qq.com/s?__biz=MjM5ODg1NjE2Mg==&mid=2247483760&idx=1&sn=96b34344aede954f52c3ae6f0c4cfb38&chksm=a6c515fd91b29ceb45e0225072af5aab3cb4897f97008480b6a8138e920fde7163344aa8d560)

这篇文章给我带来的新观点是这样的：

> 如果 GitLab 没有代码托管和协作这个和 GitHub 一模一样的核心功能，GitLab 过不了多久都会只是 GitHub 生态链上众多第三方工具中可有可无的一个存在。

> 如果没有这些核心功能，即便开源并且没有任何使用限制，也不会有众多企业依赖于此，更别说基于此进入另一个 GitHub 没有做好甚至也不觉得需要做好的企业服务市场。

过去我总是觉得如果现有的产品已经足够好，我们就不该再浪费时间在同样的功能上，应该想办法做出差异化。现在看来，想要创新除了开辟全新的赛道之外，还有一种可能是在现有赛道上重新出发，参考成熟的对手并努力实践，不要回避相同/相似的功能，在这个基础上再去找新的方向。

## 服务

[Introducing Cloudflare Pages: the best way to build JAMstack websites](https://blog.cloudflare.com/cloudflare-pages/)

CloudFlare 终于入局了 JAMstack 市场的战斗，正式推出了 Cloudflare Pages 产品，在 Workers 的加持下，感觉战斗力会很强。

[Buttondown](https://buttondown.email/) 是一个帮助构建新闻订阅服务的网站，看起来是为个人设计的，有意思的地方在于他公开了自己的网站的全部成本: [Running Costs](https://www.notion.so/Running-Costs-f29729ded5494272947f656440967cbf)。现在很多注重隐私的产品似乎都会这么做，打隐私牌的产品越来越多了，这是好事。

[JobHuntBuddy](https://jobhuntbuddy.co/) 是一个辅助找工作的 SaaS 服务，跟踪职位申请，联系方式等信息。感觉这种服务挺一次性的呀，甚至还提供了 Kanban / Tasks 这样的功能，真的会有人按月订阅这样的服务吗？

[mailbrew](https://mailbrew.com/) 是一个个人每日摘要服务

![](mailbrew.png)

如图所示，它把各种服务的动态转化为一个好看的摘要发送到邮箱。我需要追踪的动态大多数都转化为 RSS 订阅了，所以这个服务对我的价值不是很大。

## 项目

[Yew](https://yew.rs/) 是一个基于 Rust + WebAssembly 实现的前端框架，思路上接近 React 和 Elm，支持跟现有的 NPM 包交互。样例看起来是这个感觉：

```rust
use wasm_bindgen::prelude::*;
use yew::prelude::*;

struct Model {
    link: ComponentLink<Self>,
    value: i64,
}

enum Msg {
    AddOne,
}

impl Component for Model {
    type Message = Msg;
    type Properties = ();
    fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
        Self {
            link,
            value: 0,
        }
    }

    fn update(&mut self, msg: Self::Message) -> ShouldRender {
        match msg {
            Msg::AddOne => self.value += 1
        }
        true
    }

    fn change(&mut self, _props: Self::Properties) -> ShouldRender {
        false
    }

    fn view(&self) -> Html {
        html! {
            <div>
                <button onclick=self.link.callback(|_| Msg::AddOne)>{ "+1" }</button>
                <p>{ self.value }</p>
            </div>
        }
    }
}

#[wasm_bindgen(start)]
pub fn run_app() {
    App::<Model>::new().mount_to_body();
}
```


[HTML over the wire](https://hotwire.dev/)

Basecamp 搞出来的新东西，通过返回 HTML 而不是 JSON 来构建单页应用，他们的新产品 [Hey](https://hey.com/) 就是基于这个开发的。咨询了下前端的同学，他们表示早就该这样了，大概可以围观一下。
