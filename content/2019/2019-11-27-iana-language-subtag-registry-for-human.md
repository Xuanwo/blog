---
categories: Code
date: 2019-11-27T01:00:00Z
tags:
- golang
title: 更好用的 IANA Language Subtag Registry 数据
url: /2019/11/27/iana-language-subtag-registry-for-human
---

研究 Language Tag 的时候发现 IANA 发布的 Language Subtag Registry 是用 [Record Jar](https://tools.ietf.org/html/draft-phillips-record-jar-01) 格式发布的，虽然读起来比较容易，但是用于代码中执行自动化操作很麻烦，所以我做了一些工作将 `Record Jar` 转换为 JSON 格式。

## 背景介绍

### Language Subtag Registry

[BCP 47](https://tools.ietf.org/html/bcp47) 是用于区分语言的当前最佳实践，包含的 RFC 有 [RFC 5646](https://tools.ietf.org/html/rfc5646) 和 [RFC 4647](https://tools.ietf.org/html/rfc4647)，几乎所有语言和操作系统都遵循了这一规范。BCP 47 除了规范 Language Tag 的定义，格式及其使用之外，还规定了所有有效的 Subtag 如何存储和检索，即`IANA Language Subtag Registry`。

## Record Jar

Record Jar 最早由 [Eric S. Raymond](https://en.wikipedia.org/wiki/Eric_S._Raymond) 在他的著作 [The Art of Unix Programming](http://www.catb.org/~esr/writings/taoup/html/) 中描述，之后被规范化并提出了草案 [draft-phillips-record-jar-02](https://tools.ietf.org/html/draft-phillips-record-jar-02)。BCP 47 就是使用了这个格式来存储 Language Subtag。

## IANA Language Subtag Registry For Human

Record Jar 看起来大概是这样：

```
Type: language
Subtag: ia
Description: Interlingua (International Auxiliary Language
  Association)
Added: 2005-10-16
%%
Type: language
Subtag: cu
Description: Church Slavic
Description: Church Slavonic
Description: Old Bulgarian
Description: Old Church Slavonic
Description: Old Slavonic
Added: 2005-10-16
```

`%%` 作为前缀表示注释，Key 和 Value 通过 `:` 来分割，任意的 Key 都有可能出现多次。为了维护可读性，还会支持 Folding，即通过一些特定的格式来展示多行文本。

这是一个非常简单的文本格式，很好读，但是不好用。如果想提取这些 Subtag 来做一些事情的话，就需要先解析 Record Jar，然后再映射到对应的数据结构中。我在另外一个项目写完了这部分的代码之后认为这些工作其实没有必要重复进行，首先我可以按照 RFC 5646 的描述设计出一个数据结构，然后可以解析 Record Jar 并映射到这个数据结构上，最后再生成一些更加结构化的数据描述，比如 JSON。

说干就干，首先实现了 [go-record-jar](https://github.com/Xuanwo/go-record-jar)。它的作用是支持解析 Record Jar，并将其存储为 `[]map[string][]string`。目前它已经可以完整的解析整个 `Registry` 文件，支持多行 Value，支持重复的 Key。[go report A+](https://goreportcard.com/report/github.com/Xuanwo/go-record-jar)，测试覆盖率 [91%](https://codecov.io/gh/Xuanwo/go-record-jar)，已经基本可用。

然后是 [go-language](https://github.com/Xuanwo/go-language)，这个项目实际上还没有完工，只是给出了 Language Tag 的结构体声明，未来会读取 `Registry` 来生成对应的 Tag。

```go
type Tag struct {
	// MUST contain at least one each
	Type        string
	Description []string
	Added       string

	// MUST contain one of them.
	Tag    string
	Subtag string

	// MAY also contain the following fields
	Deprecated     string
	PreferredValue string `json:"Preferred-Value"`
	Prefix         []string
	SuppressScript string `json:"Suppress-Script"`
	Macrolanguage  string
	Scope          string
	Comments       string
}
```

最后我开发了 [iana-language-subtag-registry](https://github.com/Xuanwo/iana-language-subtag-registry)，并上线了网站 https://iana-language-subtag-registry.xuanwo.io/ （当然，很丑，欢迎贡献前端- -） 。这个很简单，用 [go-record-jar](https://github.com/Xuanwo/go-record-jar) 解析内容，然后生成 JSON 文件。后续还会去做一些自动化更新的事情，会自动的去更新这些内容。生成其他的格式也相当容易，不过目前暂时还没有看到类似的需求。

欢迎大家使用，有需求或者反馈的话可以提交到 [Issues](https://github.com/Xuanwo/iana-language-subtag-registry/issues)。

## 灵魂发问

为什么要重复造轮子呢？

### Golang 不是已经有 [language](https://godoc.org/golang.org/x/text/language) 包了吗？

language 完整的实现了 BCP 47 支持，但是它对外只暴露出了完整的 Language Tag：

```go
var userPrefs = []language.Tag{
    language.Make("gsw"), // Swiss German
    language.Make("fr"),  // French
}

var serverLangs = []language.Tag{
    language.AmericanEnglish, // en-US fallback
    language.German,          // de
}
```

而构造 Language Tag 需要通过形如 `language.Make("gsw")` 的方式，这对于写一个解析 `Accept-Language` 的服务器端应用可能很好，但是对上层库的实现者就不太友好了：缺少可用的 Subtag 全集。所以我的计划是在 [go-language](https://github.com/Xuanwo/go-language) 中加入 Subtag 的全集，并实现与 [language](https://godoc.org/golang.org/x/text/language) 包的互操作，这样我基于这些工作来完成我的其他项目了。

### 将 Registry 转换为 JSON 的工作已经有人做过了！

是的，[language-subtag-registry](https://github.com/mattcg/language-subtag-registry) 项目已经实现了类似的工作，还对 Subtag 进行了分组，提高了易用性。

但是这个项目主要目标是作为一个 npm 包在 Javascript 的生态中提供服务，这与我语言无关的主旨相违背。其次，[iana-language-subtag-registry](https://github.com/Xuanwo/iana-language-subtag-registry) 期望作为一个可靠的数据源为所有语言提供支持，所以它不会在上游的数据上做额外的封装，也不会生成出一个 ID 可能变动的 Index 出来。

*当然也能傲娇的说一句："Because I can."*

## 参考资料

推荐阅读

- [CLDR - Locale](https://leohacker.github.io/textprocessing/CLDR-Locale/) 是 [@Leo Jiang](https://leohacker.github.io/) 写的一篇介绍 CLDR(Unicode Common Locale Data Repository) 和语言环境的文章，推荐阅读
- [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/) 介绍了 HTML  `lang`  和 XML `xml:lang` 中使用的 Language Tag
- [Choosing a Language Tag](https://www.w3.org/International/questions/qa-choosing-language-tags) 介绍了如何选择 Language Tag 

用于参考

- [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) 是 IANA 发布的所有可用 Language Subtag 列表
- [BCP 47 Tags for Identifying Languages](https://tools.ietf.org/html/bcp47) 是用于区分语言的 Best Current Practice
- [UCRT 区域设置名称、语言和国家/地区字符串](https://docs.microsoft.com/zh-cn/cpp/c-runtime-library/locale-names-languages-and-country-region-strings?view=vs-2019) 是 Windows NLS API 支持的 locale 参数
- [Language and Locale Matching in Go](https://blog.golang.org/matchlang) Golang Blog 中关于 language 包使用的介绍
- [BCP47 language subtag lookup](https://r12a.github.io/app-subtags/) 被 W3C 引用的 Subtag 检索工具，非常好用，甚至想自己搞一个

