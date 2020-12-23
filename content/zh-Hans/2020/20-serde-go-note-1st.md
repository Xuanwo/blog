---
categories: Code
date: 2020-12-23T05:00:00Z
tags:
- Golang
- serde-go
title: serde-go 开发手记第一期
---

[serde-go](https://github.com/Xuanwo/serde-go/) 是 [serde](https://serde.rs/) 的 Golang Port，目标是实现通用且高效的 Golang 数据结构序列化与反序列化。本系列的内容包括 `serde-go` 开发中的总结和未来规划，而本文作为第一期将会介绍 `serde-go` 的主要设计。

---

## 接口设计

`serde-go` 沿用了 `serde` 中的大部分设计：

- 实现 `Serializer`/`Deserializer` 就能作为将数据结构序列化或者反序列化
- 实现 `Serializable`/`Deserializable` 就能被序列化或者反序列化

但是在很多细节上，由于 Golang 语言自身的特性，`serde-go` 做了很多调整：

比如 `Serializable`/`Deserializable` 无法返回类型本身，只能实现为这个结构体的方法。

```go
type Serializable interface {
	Serialize(serializer Serializer) (err error)
}
```

Golang 的基础类型与 rust 相比差异也很大，`serde-go` 支持了所有的基础类型：

```go
type Serializer interface {
	SerializeNil() (err error)

	SerializeBool(v bool) (err error)
	SerializeInt(v int) (err error)
	SerializeInt8(v int8) (err error)
	SerializeInt16(v int16) (err error)
	SerializeInt32(v int32) (err error)
	SerializeInt64(v int64) (err error)
	SerializeUint(v uint) (err error)
	SerializeUint8(v uint8) (err error)
	SerializeUint16(v uint16) (err error)
	SerializeUint32(v uint32) (err error)
	SerializeUint64(v uint64) (err error)
	SerializeFloat32(v float32) (err error)
	SerializeFloat64(v float64) (err error)
	SerializeComplex64(v complex64) (err error)
	SerializeComplex128(v complex128) (err error)
	SerializeString(v string) (err error)
	SerializeBytes(v []byte) (err error)

	SerializeSlice(length int) (s SliceSerializer, err error)
	SerializeMap(length int) (m MapSerializer, err error)
	SerializeStruct(name string, length int) (s StructSerializer, err error)
}
```

需要注意的是，`serde-go` 没有支持内置的 `alias type`，比如 `byte` 和 `rune`，因为对序列化来说这些类型没有区别。特别的，`serde-go` 保留了 `[]byte`，这是为了方便后续做 bytes 相关的性能优化。

`serde-go` 支持了 `Slice`，`Map` 和 `Struct` 等容器类型：

```go
type SliceSerializer interface {
	SerializeElement(v Serializable) (err error)
	EndSlice() (err error)
}

type MapSerializer interface {
	SerializeEntry(k, v Serializable) (err error)
	EndMap() (err error)
}

type StructSerializer interface {
	SerializeField(k, v Serializable) (err error)
	EndStruct() (err error)
}
```

`Struct` 与 `Map` 的区别在于 `Struct` 的大小和顺序通常是固定的，因此可以采取更多的优化。

相对来说，`Deserialize` 更为复杂一些，为了能够将反序列化出来的值取出来，`serde-go` 选择传入一个 `Visitor`：

```go
type Deserializer interface {
	DeserializeAny(v Visitor) (err error)

	DeserializeNil(v Visitor) (err error)
	DeserializeBool(v Visitor) (err error)
	DeserializeInt(v Visitor) (err error)
	DeserializeInt8(v Visitor) (err error)
	DeserializeInt16(v Visitor) (err error)
	DeserializeInt32(v Visitor) (err error)
	DeserializeInt64(v Visitor) (err error)
	DeserializeUint(v Visitor) (err error)
	DeserializeUint8(v Visitor) (err error)
	DeserializeUint16(v Visitor) (err error)
	DeserializeUint32(v Visitor) (err error)
	DeserializeUint64(v Visitor) (err error)
	DeserializeFloat32(v Visitor) (err error)
	DeserializeFloat64(v Visitor) (err error)
	DeserializeComplex64(v Visitor) (err error)
	DeserializeComplex128(v Visitor) (err error)
	DeserializeString(v Visitor) (err error)
	DeserializeBytes(v Visitor) (err error)

	DeserializeSlice(v Visitor) (err error)
	DeserializeMap(v Visitor) (err error)
	DeserializeStruct(name string, fields []string, v Visitor) (err error)
}

type Visitor interface {
	VisitNil() (err error)

	VisitBool(v bool) (err error)
	VisitInt(v int) (err error)
	VisitInt8(v int8) (err error)
	VisitInt16(v int16) (err error)
	VisitInt32(v int32) (err error)
	VisitInt64(v int64) (err error)
	VisitUint(v uint) (err error)
	VisitUint8(v uint8) (err error)
	VisitUint16(v uint16) (err error)
	VisitUint32(v uint32) (err error)
	VisitUint64(v uint64) (err error)
	VisitFloat32(v float32) (err error)
	VisitFloat64(v float64) (err error)
	VisitComplex64(v complex64) (err error)
	VisitComplex128(v complex128) (err error)
	VisitString(v string) (err error)
	VisitBytes(v []byte) (err error)

	VisitSlice(s SliceAccess) (err error)
	VisitMap(m MapAccess) (err error)
}

type MapAccess interface {
	NextKey(v Visitor) (ok bool, err error)
	NextValue(v Visitor) (err error)
}

type SliceAccess interface {
	NextElement(v Visitor) (ok bool, err error)
}
```

## 内置类型支持

`serde-go` 通过代码生成的方式实现了所有内置类型的 Visitor 支持：

```go
type Int8Visitor struct {
	v *int8
}

func NewInt8Visitor(v *int8) Int8Visitor {
	return Int8Visitor{v: v}
}

func (vi Int8Visitor) String() string {
	return "Int8"
}

func (vi Int8Visitor) VisitInt8(v int8) (err error) {
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitUint8(v uint8) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitInt16(v int16) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	if v < MinInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitUint16(v uint16) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitInt32(v int32) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	if v < MinInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitInt(v int) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	if v < MinInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitUint32(v uint32) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitUint(v uint) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitInt64(v int64) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	if v < MinInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}

func (vi Int8Visitor) VisitUint64(v uint64) (err error) {
	if v > MaxInt8 {
		return errors.New("overflow")
	}
	*vi.v = int8(v)
	return nil
}
```

此外还实现了所有内置类型的 Serializer：

```go
type Int8Serializer int8

func (s Int8Serializer) Serialize(ser Serializer) (err error) {
	return ser.SerializeInt8(int8(s))
}
```

与 `serde` 一样，`serde-go` 提供 `cmd/serde` 为指定结构体自动生成 `Serializable`/`Deserializable` 的实现。

```shell
go run -tags tools github.com/Xuanwo/serde-go/cmd/serde ./...
```

## Tag Format 设计

`serde-go` 自行设计了一套新的 [Tag Format](https://github.com/Xuanwo/serde-go/blob/master/docs/design/02-tag-format.md)：

```go
// serde: deserialize,serialize
// serde: default,rename_all=xxx,rename_all_serialize=xxx
type Example struct {
	value  [2]int `serde:"skip,rename=xx"`
}
```

由于 `serde-go` 不依赖反射获取结构体的信息，所以没有导出的字段也能够加入到序列化与反序列化中。

## 现状&规划

目前 `serde-go` 还在开发中，很多必要的功能还没有实现，能用的序列化实现也只有 [serde-msgpack-go](https://github.com/Xuanwo/serde-msgpack-go)，用起来的感觉大概是这样：

```go
import (
    "log"
    "testing"

    msgpack "github.com/Xuanwo/serde-msgpack-go"
)

// serde: deserialize,serialize
type Example struct {
	vint64   int64
	vmap     map[int]int
	varray   [2]int `serde:"skip"`
	vslice   []int
	vpointer *int
}

func main() {
	ta := Example{
		vint64: 3,
	}
	content, err := msgpack.SerializeToBytes(&ta)
	if err != nil {
		log.Fatalf("msgpack SerializeToBytes: %v", err)
	}

	x := Example{}
	err = msgpack.DeserializeFromBytes(content, &x)
	if err != nil {
        log.Fatalf("msgpack DeserializeFromBytes: %v", err)
	}
	log.Printf("%#+v", x)
}
```

现在支持的序列化类型还太少，以后如果支持更加广泛，我们只需要生成一次代码，就能够用于各种序列化器。

虽然目标是通用且高效，但是从 Benchmark 的结果来看，`serde-msgpack-go` 比 `vmihailenco/msgpack` 要慢 20% 左右，所以在性能调优上还有很多事情要做。

未来的一段时间里，会专注于实现下列的功能：

- External Type: 支持序列化与反序列化非当前包的结构体
- Default: 支持为结构体在序列化 & 反序列化的过程中设置默认值
- Rename: 支持在序列化 & 反序列化的过程中修改字段的名字

## 总结

[serde](https://serde.rs/) 是我最喜欢的 rust 库之一，我希望能把同样（相近）的能力带到 Golang 社区～
