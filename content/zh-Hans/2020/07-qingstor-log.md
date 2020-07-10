---
categories: Code
date: 2020-07-10T01:00:00Z
title: "qingsotr/log: 为关键业务场景设计的 Logger"
series: "Self-made Wheels"
tags:
- golang
---

作为一个服务可观察性的重要组成部分，日志会出现在代码的任何地方，这使得日志库本身的性能和可靠性也会影响到服务本身。为了在不影响可观察性的前提下减少关键 IO 路径中的额外开销，我设计并实现了一个为关键业务场景设计的 Logger：[qingstor/log](https://github.com/qingstor/log)。目前这个 logger 只实现了最基础的功能，但已经足够验证我的思路并做一些简单的介绍了。

---

## 目标

- 1ms 内能输出 10 个字段
- 除了字段本身，没有额外的内存分配
- 支持输出结构化的纯文本或者 JSON
- 即使挂了也不影响业务
- 不做多余的事情

## 设计

从更抽象一些的角度来看，logger 做的事情是触发事件，然后对这个事件去做处理。所以一个 Logger 的设计会被分为三个部分：

- `Event`: 如何表达一个事件，数据结构如何组织，有哪些元数据，更具体的比如，有哪些级别
- `Transform`: 如何将一个事件由内存中的结构体转换为其他形式
- `Executor`: 对一个事件做哪些操作，比如将 Trasnform 后的结果写入到 `io.Writter` 或者调用特定的 API

Golang 官方的 `log` 库的设计是不区分 `Event` 与 `Transform` 且只支持 Write Executor，触发之后直接转换为字节流并写入到指定的 `io.Writter` 中。

使用人数最多的 Golang 日志库 [logrus](https://github.com/sirupsen/logrus) 的设计是在 `Entry` 中存储一部分结构化数据，同时支持将其他参数直接转换为字节流：

```golang
log.WithFields(log.Fields{
  "omg":    true,
  "number": 122,
}).Warn("The group's number increased tremendously!")
```

比如上文中的 `"omg": true,` 会被存储到 `Entry` 的 `Fields` 中，而 `Warn`/`Warnf` 中传入的数据则会直接通过 `fmt.Sprintf` 直接转换为字符串再传入。

`Entry` 中的结构化数据允许做多种 Transform，logrus 支持的包括 Text 和 JSON Format。

[zap](https://github.com/uber-go/zap) 的设计走的更远了一些，放弃了形如 `Warnf` 的支持，要求所有传入的字段都是强类型的，从而使得他们能够实现一个高效的 JSON Encoder。

从最后的效果上来看，zap 确实要比 logrus 快出来一个量级：我们线上服务中常见的日志 pattern 中，logrus 通常会需要 20ms，而 zap 只需要 900ns。只是通过简单的替换日志库，就能让我们的小文件 IOPS 再提高几个百分点。

但是 zap 并不适合我们线上的业务：一方面我们资源比较受限，我们暂时没有办法去部署大规模的统一日志管理平台，更多时候还是需要通过 grep request id 并肉眼查看日志，所以 zap 使用的 JSON 格式不太友好；另一方面，我们不希望 log 库能够做 panic 或者 fatal，也不希望 log 库本身能提供这么多特性。

所以我自己设计了一个新的抽象：

```
+--------------------+
|                    |
| Logger             |
|                    |       +-----------------+
| +----------------+ |       |                 |
| |                | |       | Entry           |
| |     Fields     | |       |                 |
| |                | |       | +-------------+ |
| +----------------+ |       | |             | |
|                    |       | |    Meta     | |
| +----------------+ |       | |             | |
| |                | |       | +-------------+ |
| |   Transform    | |       |                 |
| |                | |       | +-------------+ |
| +----------------+ |       | |             | |
|                    |       | |   Fields    | |
| +----------------+ |       | |             | |
| |                | |       | +-------------+ |
| |    Executor    | |       |                 |
| |                | |       +-----------------+
| +----------------+ |
|                    |
+--------------------+
```

- 除了维护一些 Logger 级别的字段之外，Logger 还会维护 `Transformer` 与 `Executor`：在初始化的时候，用户需要自行指定这个 Logger 使用什么 Transformer，以及对事件进行什么样的操作
- 仅支持 `DEBUG`，`INFO`，`WARN` 和 `ERROR` 级别，不会做 panic，也不会做 `os.Exit` 等操作，未来也不会支持更多的级别
- 不会支持反射，也不会像 zap 一样提供一个 sugar
- Entry 本身会携带 Meta 信息

## 实现

```golang
type Logger struct {
	...

	// The executor that logger will execute on every entry.
	executor Executor
	// The transformer that logger used.
	transformer Transformer
	// Logger level fields will be transformed in every entry.
	fields []Transformee
}
```

Logger 在它的每次调用中会创建一个新的 Entry，并执行对其 executor。在 executor 中，Logger 可以调用 transformer 以执行 Transform。

### Executor

```golang
type Executor func(l *Logger, e *Entry)
```

Logger 目前对外暴露了两个函数：

- `Transform`：对 Entry 进行转换
- `WriteInto`：将 Entry 转换的结果写入 `io.Writer`

所以想实现一个简单的 Logger 就只需要这样做：

```golang
func ExecuteWrite(w io.Writer) Executor {
	return func(l *Logger, e *Entry) {
		l.Transform(e)
		l.WriteInto(e, w)
	}
}
```

当然，Logger 的一个基础功能是可以定义日志级别，用户可以自行实现逻辑来实现日志分级：比如定义一个 Matcher，根据日志级别是否满足要求来决定是否输出以及输出到哪里：

```golang
func ExecuteMatchWrite(m Matcher, w io.Writer) Executor {
	return func(l *Logger, e *Entry) {
		if !m.Match(e) {
			return
		}

		l.Transform(e)
		l.WriteInto(e, w)
	}
}
```

目前 log 库只实现了这两种简单的 Executor，更具体的实现选择交给用户自己来做。

### Transformer

目前的设计是将形式与内容分离，Transformer 只规定和处理格式，优点是开发者能够自由的实现不同形式的输出，缺点是内容的产出固定，使得类似于 msgpack 这样的二进制日志形式无法实现。考虑到短期内只需要支持纯文本和 JSON 格式，这样的实现也能够接受。

处理格式有两个需要解决的问题：第一，如何允许用户尽可能自由的定义格式；第二，如何获取当前的 context。第一个问题解决的不好会让用户没法使用自己想要的格式，而第二个问题解决不好会使得用户无法得到自己预期的输出。

为了解决上述的问题，log 引入了 `Container` 的概念：

```golang
const (
	ContainerEntry Container = iota + 1
	ContainerObject
	ContainerMap
	ContainerArray
	ContainerQuote
)
```

最外层的容器叫做 `Entry`，内部是 KV 的形式，而 Value 内部还有可能会嵌套其他的 Container。同时，Transformer 提供了如下 API：

```golang
type Transformer interface {
	// Key will append new key.
	Key(*Entry, string)
	// Start will pre a container.
	Start(*Entry, Container)
	// End will post a container.
	End(*Entry, Container)
}
```

所有的 Field 在实现的时候需要主动申明当前的状态，比如：

```golang
func (f *StringField) Transform(l *Logger, e *Entry) {
	l.transformer.Key(e, f.k)

	l.transformer.Start(e, ContainerQuote)
	defer l.transformer.End(e, ContainerQuote)

	e.buf.AppendString(f.v)
}
```

这样 Transformer 就能获取并记录 Entry 当前的状态。在这个设计的基础上，针对 Text Transformer，还能够参考标准库中 Time Format 解析的方式设计一套 Text Format：

```golang
type Text struct {
	// Value containers
	vc [][2]byte

	pre  func(*Entry)
	post func(*Entry)
}

type TextConfig struct {
	// Whole log format
	// "{level} - {time} {value}"
	EntryFormat string
	// ERROR
	LevelFormat level.FormatCase
	// 1136239445 or time layout
	TimeFormat string
	// a container to byte map.
	ValueContainer map[Container][2]byte
}
```

在初始化 Text Transformer 时 TextConfig 会被解析成一组函数并在 Start/End ContainerEntry 的时候执行，这使得用户能够完全自由的指定（支持的）字段位置和格式：

```golang
EntryFormat: "[{level}] - [{time}] {value}"
```

### Field

Field 会统一实现 `Transformee` interface:

```golang
type Transformee interface {
	Transform(l *Logger, e *Entry)
}
```

调用 Transformer 的函数，并直接操作 Entry 中的 Buffer：

```golang
func (f *IntField) Transform(l *Logger, e *Entry) {
	l.transformer.Key(e, f.k)
	e.buf.AppendInt(f.v)
}
```

## 成果

在上述的工作之后，我们可以这样来使用 log:

```golang
tf, err := NewText(&TextConfig{
  // Use unix timestamp for time
  TimeFormat: TimeFormatUnixNano,
  // Use upper case level
  LevelFormat: level.UpperCase,
  EntryFormat: "[{level}] - {time} {value}",
})
if err != nil {
  println("text config created failed for: ", err)
  os.Exit(1)
}

e := ExecuteMatchWrite(
  // Only print log that level is higher than Debug.
  MatchHigherLevel(level.Debug),
  // Write into stderr.
  os.Stderr,
)

logger := New().
  WithExecutor(e).
  WithTransformer(tf).
  WithFields(
    String("request_id", "8da3aceea1ba"),
  )

logger.Info(
  String("object_key", "test_object"),
  Int("version", 3),
)
```

上述的样例代码创建了一个 logger，它将输出所有高于 Debug 级别的日志到 stderr 中。

```golang
logger.Error(
  String("string", x),
  Bytes("bytes", []byte(x)),
  Int("int64", 1234567890),
  Float("float64", 1234.056789),
  Time("time", now, time.RFC1123),
)
```

像这样输出 5 个字段大约需要 280ns：

```golang
goos: linux
goarch: amd64
pkg: github.com/qingstor/log
BenchmarkLogger_Info
BenchmarkLogger_Info-8   	 4104688	       279 ns/op	     304 B/op	       7 allocs/op
PASS
```

## 差异

### qingstor/log vs zap

不难发现相比于 zap，qingstor/log 多了很多分配，这是因为两者 Field 设计上的差异：

```golang
type Field struct {
	Key       string
	Type      FieldType
	Integer   int64
	String    string
	Interface interface{}
}
```

zap 会在创建 Field 时将 int 类型都转换为 `int64` 存储，字符串类型也做类似的处理，而其他的类型则直接存入 Interface 并在使用的时候做类型断言。log 选择的是另外一条路径：为所有类型单独实现一个 Field。麻烦的地方在于有很多冗余的代码需要写，但是这个后续能通过模板生成的方式来优化。优点是能够避免额外的类型断言。

## 总结

qingstor/log 库是一个强类型的结构化 Logger 库，专门为关键业务场景设计。

目前这个项目还在开发阶段，后续会应用到所有 qingstor 开源的项目当中，欢迎大家试用并在 [issues](https://github.com/qingstor/log/issues) 区提出反馈意见，首个可用的版本将会在七月底正式发布～
