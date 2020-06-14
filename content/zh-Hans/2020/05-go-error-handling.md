---
categories: Code
date: 2020-06-14T01:00:00Z
title: (我的) Golang 错误处理最佳实践
tags:
- golang
---

在开发 [storage](https://github.com/Xuanwo/storage) 库的过程中，我设计并实现了一套 Golang 错误处理的规范。原始的提案和规范可以参考 [Proposal: Error Handling](https://storage.xuanwo.io/design/11-error-handling.html) 与 [Spec: Error Handling](https://storage.xuanwo.io/spec/1-error-handling.html)，本文是两者汇总后重新梳理的产物。

## TL;DR

- 区分 `预期` 与 `非预期` 错误
- 定义所有预期错误，返回所有的非预期错误
- 总是返回自定义错误类型以携带与错误上下文有关的信息，该类型必须实现 `xerrors.Wrapper` 接口
- 使用 `errors.Is` 来判断错误，使用 `errors.As` 来获取错误上下文

---

## 定义

- `错误`：不管是错误，故障，异常，失效抑或其他近义词汇，只要程序运行不符合预期，下文统称为 `错误`
- `包`: 所有有效的 golang `package`
- `实现者`：负责实现一个 `包` 的开发者
- `调用者`：负责调用一个 `包` 的开发者

## 目标

一个好的错误处理机制应该是这样的：

- 实现者不需要做额外的工作，只需要专注于处理包自身的错误
- 调用者能够知道发生了什么错误
- 调用者能够决定如何处理这个错误
- 调用者能够了解为什么会发生这个错误

## 设计

从一个包的角度来看，能够将错误分为两类：`预期` 与 `非预期` 。

- `预期`错误：实现者预期可能会出现并能处理的错误
  - 比如在解析 Protocol 时，返回 `ErrUnsupportedProtocol` 表示该 Protocol 尚未支持
  - 所有的预期错误都必须提前声明
  - 预期错误属于当前包，只有在当前包中才能返回，不允许直接返回其他包定义的预期错误
- `非预期`错误：实现者不知道为何会出现或者无法处理的错误
  - 比如调用其他包返回的错误
  - 所有的非预期错误实现者都不需要处理

无论是何种错误，在返回时都必须被包裹在自定义的错误类型中，该类型需要实现 `error` 和 `xerrors.Wrapper` 接口并携带充足的上下文信息：

```go
var (
	// ErrSegmentPartsEmpty means segment's parts is empty
	ErrSegmentPartsEmpty = errors.New("segment part empty")
)

type Error struct {
    Op  string
    Err error

    Seg *Segment
}

func (e *Error) Error() string {
	return fmt.Sprintf("%s: %v: %s", e.Op, e.Seg, e.Err)
}

func (e *Error) Unwrap() error {
	return e.Err
}
```

- 一般的，可以使用 `Op` 表示什么操作触发了这个错误，使用 `Err` 来携带原始错误。
  - 如果是预期错误，那 `Err` 应当是提前声明好的 `error`

    ```go
    return &Error{"parse", s[0], nil, ErrUnsupportedProtocol}
    ```

  - 如果是非预期错误，那 `Err` 应当是未被修改的原始错误或者实现了 `xerrors.Wrapper` 接口的自定义错误

    ```go
    port, err := strconv.ParseInt(s[2], 10, 64)
    if err != nil {
        return nil, &Error{"parse", ProtocolHTTP, s[1:], err}
    }
    ```

- 自定义错误类型中出现的 `ContextX` 类型应当尽可能的实现 `String() string` 方法
- 同一个项目中需要统一 `Error() string` 返回的字符串格式
  - 在 [storage](https://github.com/Xuanwo/storage) 项目中，我选择的格式是 `{Op}: {ContextA}, {ContextB}: {Err}`
- `Unwrap() error` 方法中，应当直接返回 `Err` 并不做任何修改

调用者可以自行决定如何使用包返回的错误：

- 直接返回给上层应用
  ```go
  if err != nil {
    return err
  }
  ```
- 处理特定的错误
  ```go
  if err != nil && errors.Is(err, segment.ErrSegmentPartsEmpty) {
    log.Print("segment is empty")
  }
  ```
- 获取错误的上下文信息
  ```go
  var e segment.Error
  if err != nil && errors.As(err, &e) {
      log.Print(e.Segment)
  }
  ```

## 参考资料

- [storage Proposal: Error Handling](https://storage.xuanwo.io/design/11-error-handling.html)
- [storage Spec: Error Handling](https://storage.xuanwo.io/spec/1-error-handling.html)
- [Go Blog: Error handling and Go](https://blog.golang.org/error-handling-and-go)
- [Go Blog: Working with Errors in Go 1.13](https://blog.golang.org/go1.13-errors)
- [The Error Model in Midori](http://joeduffyblog.com/2016/02/07/the-error-model/)
