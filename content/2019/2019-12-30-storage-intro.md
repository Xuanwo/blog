---
categories: Code
date: 2019-12-30T01:00:00Z
tags:
- golang
- storage
series: "Self-made Wheels"
title: 面向应用的 Golang 抽象存储层介绍
url: /2019/12/30/storage-intro
---

[storage](https://github.com/Xuanwo/storage) 是一个面向应用的 Golang 统一存储层，其目标是生产级别就绪，高性能，无供应商锁定。目前支持 [Azure Blob storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)，本地文件系统，[Google Cloud Storage](https://cloud.google.com/storage/)，[阿里云对象存储](https://www.aliyun.com/product/oss)，[QingStor 对象存储](https://www.qingcloud.com/products/qingstor/)，[Amazon S3](https://aws.amazon.com/s3/) 等多种存储后端。这个项目从 09/30 开始至今，做了刚刚好三个月，选在今天发布 [v0.5.0](https://github.com/Xuanwo/storage/releases/tag/v0.5.0)，一方面是想总结一下过去三个月的开发经历，展望一下黯淡残酷的未来，另一方面是实在按捺不住想跟大家分享一下的心情。本文首先会介绍 storage 这个项目的诞生，然后介绍项目与社区林林总总各种存储项目的不同，之后再介绍未来的开发计划，最后谈谈自己的一些小体会。

## Showtime

在介绍 storage 的历史和设计之前，先看看 storage 用起来是什么样子吧。

首先初始化一个服务：

```go
srv, store, err := coreutils.Open("qingstor://hmac:test_access_key:test_secret_key@https:qingstor.com:443/test_bucket_name")
if err != nil {
    log.Fatalf("service init failed: %v", err)
}
```

`srv` 是这个存储服务的 `Servicer`，负责管理 `Namespace`；`store` 是这个存储服务的 `Storager`，负责实际的存储交互。`coreutils` 是 `storage` 库提供的工具包，支持通过统一的配置字符串来创建存储服务。

然后使用这个服务来列取一个目录并发送到通道：

```go
ch := make(chan *types.Object, 1)
defer close(ch)

err := store.ListDir("prefix", pairs.WithFileFunc(func(*types.Object){
    ch <- o
}))
if err != nil {
    log.Fatalf("listdir: %v", err)
}
```

`pairs` 是 `storage` 库提供的参数包，提供了能用在各个 API 接口的强类型参数，风格统一为 `pairs.WithXXX`。

从本地读取文件并上传到 QingStor 对象存储可以这样：

```go
_, src, _ := coreutils.Open("fs:///path")
_, dst, _ := coreutils.Open("qingstor://hmac:test_access_key:test_secret_key@https:qingstor.com:443/test_bucket_name")

r, err := src.Read("test_file")
if err != nil {
    log.Fatalf("read from src: %v", err)
}
defer r.Close()

err = dst.Write("test_key", r, pairs.WithSize(1024))
if err != nil {
	log.Fatalf("read from src: %v", err)
}
```

在 Storager 初始化完毕后，就不再需要关心业务无关的底层存储细节，可以轻松的开发出需要持久化数据的无供应商锁定应用。

## 诞生

接下来聊一聊 `storage` 库的由来。

时间倒转到 2018 年初，我们对象存储的周边工具遇到了挑战：有个私有云用户需要迁移数十 TB 的数据到对象存储。当时可用的工具只有 python 写成的 qsctl，所有状态都存储在内存中，一旦出现任务中断就需要从头开始，用户意见很大。为此，我在一次内部会议上提出我们需要一个全新的工具，这个工具会专注于长时间的数据迁移操作，支持断点续传，支持持久化任务状态。由于原本的 qscamel 1.0 设计目标与之接近，所以沿用 qscamel 项目名，开发出了 [qscamel 2.0](https://xuanwo.io/2018/09/05/qscamel-intro/)。

在 qscamel 2.0 中，我设计出了这样一套接口：

```go
// Base is the interface that both Source and Destination should implement.
type Base interface {
	// Name will return the endpoint's name.
	Name(ctx context.Context) (name string)

	// Stat will get the metadata.
	Stat(ctx context.Context, p string) (o *model.SingleObject, err error)

	// Read will return a reader.
	Read(ctx context.Context, p string) (r io.Reader, err error)
	// ReadRange will read content with range [offset, offset+size)
	ReadRange(ctx context.Context, p string, offset, size int64) (r io.Reader, err error)
}

// Destination is the interface for destination endpoint.
type Destination interface {
	Base

	// Delete will use endpoint to delete the path.
	Delete(ctx context.Context, p string) (err error)
	// Deletable will return whether current endpoint supports delete.
	Deletable() bool

	// Fetch will use endpoint to fetch the url.
	Fetch(ctx context.Context, path, url string) (err error)
	// Fetchable will return whether current endpoint supports fetch.
	Fetchable() bool

	// InitPart will inti a multipart upload.
	InitPart(ctx context.Context, p string, size int64) (uploadID string, partSize int64, partNumbers int, err error)
	// UploadPart will upload a part.
	UploadPart(ctx context.Context, o *model.PartialObject, r io.Reader) (err error)
	// Partable will return whether current endpoint supports multipart upload.
	Partable() bool

	// Write will read data from the reader and write to endpoint.
	Write(ctx context.Context, path string, size int64, r io.Reader) (err error)
	// Writable will return whether current endpoint supports write.
	Writable() bool
}

// Source is the interface for source endpoint.
type Source interface {
	Base

	// List will list from the job.
	List(ctx context.Context, j *model.DirectoryObject, fn func(model.Object)) (err error)

	// Reach will return an accessible url.
	Reach(ctx context.Context, p string) (url string, err error)
	// Reachable will return whether current endpoint supports reach.
	Reachable() bool
}
```

这套接口是面向迁移任务设计的，虽然不是非常优雅，但是工作的很好，一直沿用至今。qscamel 基于这套接口提供了本地文件系统，QingStor 对象存储，阿里云 OSS，Google Cloud Storage，七牛对象存储，S3，又拍云，腾讯云对象存储等多家主流存储服务的支持。

qscamel 2.0 中是我第一次尝试统一存储层的接口，受限于个人的能力和时间的要求，选择的方案是只实现任务要求操作的部分 API。这套接口完全没有复用的价值，它离开特定业务场景就失去了生命力。在之后的很长一段时间里面，我常常会想到这套接口——有没有可能提供一个抽象的统一的现代的存储层呢？

在 [Go 模板元编程及其在 qsctl 中的实践](https://xuanwo.io/2019/11/10/go-template-meta-coding-in-qsctl2/) 中我介绍了一部分 qsctl 2 中所做的工作，当时刻意忽略了存储层的部分。实际上，如果没有一个统一的存储层，我们是无法抽象出一个好的任务框架的，以初始化分段为例：

```json
{
    "SegmentInit": {
        "description": "init a segment upload",
        "input": [
          "PartSize",
          "Path",
          "Storage"
        ],
        "output": [
          "SegmentID"
        ]
  	}
}
```

这里的 `Storage` 实际上就是由 storage 库提供的抽象，上层任务不需要关心这个 `Storage` 底层到底是文件存储还是 QingStor 对象存储，抑或是 S3。这层抽象将 `fs->qingstor`，`qingstor->fs` 简化为了 `src->dst`，减少了大量的重复任务。

在 qsctl 2 开发的初期其实并没有考虑要做一个通用的存储层，当时是直接写死的本地存储和对象存储。但是开发进入到后期，我们遇到了两个问题。一是单元测试不好做，大量的单测都依赖于本地存储和对象存储的行为；二是有大量重复的任务，比如从本地复制到对象存储，从对象存储复制到本地，里面大部分逻辑都是相似但无法直接复用代码的。为此，我重新审视了统一存储层接口的想法，距离我上次尝试已经过去了一年多，我变强了，头发也变得更少了，是时候再试试了。

## 区别

> 漩涡啊，你怎么又造轮子了？
>
> 我认为造轮子分两种：一种是学东西，另一种是拿来用。在市场上已经有类似库的情况下造轮子，要么就是想出名，要么就是别的轮子不太圆，两种想法我都有。

Golang 社区中类似的库有如下几个：[Afero](https://github.com/spf13/afero)，[afs](https://github.com/viant/afs)，[vfs](https://github.com/C2FO/vfs)，此外再加上与 POSIX file API 做对比。

### Afero

Afero 目标更接近于成为 `os` 和 `ioutil` 包的补充，尽可能的提供类似体验，并支持更多便利的函数。

为各个底层的文件系统提供相似的函数：

```go
Chmod(name string, mode os.FileMode) : error
Chtimes(name string, atime time.Time, mtime time.Time) : error
Create(name string) : File, error
Mkdir(name string, perm os.FileMode) : error
MkdirAll(path string, perm os.FileMode) : error
Name() : string
Open(name string) : File, error
OpenFile(name string, flag int, perm os.FileMode) : File, error
Remove(name string) : error
RemoveAll(path string) : error
Rename(oldname, newname string) : error
Stat(name string) : os.FileInfo, error
```

暴露出与原生库相似的接口：

```go
io.Closer
io.Reader
io.ReaderAt
io.Seeker
io.Writer
io.WriterAt

Name() : string
Readdir(count int) : []os.FileInfo, error
Readdirnames(n int) : []string, error
Stat() : os.FileInfo, error
Sync() : error
Truncate(size int64) : error
WriteString(s string) : ret int, err error
```

提供更多的帮助函数：

```go
DirExists(path string) (bool, error)
Exists(path string) (bool, error)
FileContainsBytes(filename string, subslice []byte) (bool, error)
GetTempDir(subPath string) string
IsDir(path string) (bool, error)
IsEmpty(path string) (bool, error)
ReadDir(dirname string) ([]os.FileInfo, error)
ReadFile(filename string) ([]byte, error)
SafeWriteReader(path string, r io.Reader) (err error)
TempDir(dir, prefix string) (name string, err error)
TempFile(dir, prefix string) (f File, err error)
Walk(root string, walkFn filepath.WalkFunc) error
WriteFile(filename string, data []byte, perm os.FileMode) error
WriteReader(path string, r io.Reader) (err error)
```

我认为 Afero 的目标不是一个统一的存储层，而是一个统一的文件系统操作集。同时，受限于它的接口设计，它很难对接好 S3 这样的对象存储服务。

## afs

AFS 的目标跟我非常接近了：abstract file storage，从提供的 API 可见一斑：

```go
List(ctx context.Context, URL string, options ...Option) ([]Object, error)
Walk(ctx context.Context, URL string, handler OnVisit, options ...Option) error
Download(ctx context.Context, object Object, options ...Option) (io.ReadCloser, error)
DownloadWithURL(ctx context.Context, URL string, options ...Option) (io.ReadCloser, error)
Upload(ctx context.Context, URL string, mode os.FileMode, reader io.Reader, options ...Option) error
Create(ctx context.Context, URL string, mode os.FileMode, isContainer bool, options ...Option) error
Delete(ctx context.Context, URL string, options ...Option) error
```

但是在具体的实现上，我跟他的想法有很多不一致的地方：

- 统一的存储层应该支持 Bucket/Namespace/Container 的操作
- 统一的存储层不应该加入太多的高级功能，比如 Modifier，Matcher 和 Batch
- 统一的存储层应该抛弃本地优先的思想，将 FileMode 作为本地存储的 metadata 之一而不是规范之一

所以 afs 很好，但仍然不是我想要的。

## vfs

vfs 与 afs 的思路是相似的：*vfs provides a pluggable, extensible, and opinionated set of file system functionality for Go across a number of file system types such as os, S3, and GCS*

但是不要 vfs 的原因与 afs 是相似的，他们提供了这样的接口：

```go
// CopyToLocation will copy the current file to the provided location.
CopyToLocation(location Location) (File, error)

// CopyToFile will copy the current file to the provided file instance.
CopyToFile(file File) error
```

想必这样的设计有他们内部业务的考量，但是作为一个通用的存储层，我们不需要实现跨存储服务的 Copy 和 Move，它们应当构建在存储层之上。

### POSIX File API

设计存储层当然绕不过 `POSIX File API`，下面是 storage 库对 `POSIX File API` 的对比情况：

| API       | 介绍                                                | storage    |
| --------- | --------------------------------------------------- | ---------- |
| getcwd    | get current working directory                       | N          |
| mkdir     | create a directory                                  | N          |
| rmdir     | delete a directory                                  | Y: Delete  |
| chdir     | change working directory                            | N          |
| link      | make a new name for a file                          | N          |
| unlink    | delete a name and possibly the file it refers to    | N          |
| rename    | change the name or location of a file               | Y: Move    |
| stat      | get file status                                     | Y: Stat    |
| chmod     | change permissions of a file                        | N          |
| chown     | change ownership of a file                          | N          |
| utime     | change access and/or modification times of an inode | N          |
| opendir   | open a directory                                    | N          |
| readdir   | read directory entry                                | Y: ListDir |
| closedir  | close a directory                                   | N          |
| rewinddir | reset directory stream                              | N          |
| access    | check user's permissions for a file                 | Y: Stat    |
| open      | open and possibly create a file or device           | N          |
| creat     | open and possibly create a file or device           | N          |
| close     | close a file descriptor                             | N          |
| read      | read from a file descriptor                         | Y: Read    |
| write     | write to a file descriptor                          | Y: Write   |
| fcntl     | manipulate file descriptor                          | N          |
| fstat     | get file status                                     | Y: Stat    |
| lseek     | reposition read/write file offset                   | N          |
| dup       | duplicate a file descriptor                         | N          |
| dup2      | duplicate a file descriptor                         | N          |
| pipe      | create pipe                                         | N          |
| mkfifo    | make a FIFO special file (a named pipe)             | N          |
| umask     | set file creation mask                              | N          |
| fdopen    | associate a stream with an existing file descriptor | N          |
| fileno    | return file descriptor of stream                    | N          |

其中：

- storage 不支持切换工作路径，Storager 的 WorkDir 参数需要在初始化的时候指定，因此不需要 `getcwd` 和 `chdir`
- storage 中文件夹的概念得到了相对的弱化，大多数存储服务中不提供对文件夹的操作，本地文件系统则会在 `Write` 调用是自动创建，因此去掉了 `mkdir`
- storage 没有链接文件的概念，因此没有 `link` 和 `unlink`
- 在 storage 中，权限，所有权，创建/修改时间等属性都被视作元数据，因此会放到统一的元数据操作 API 中，不再需要 `chmod`，`chown`，`utime` 等 API
- storage 对外屏蔽了内部的读写细节，不再暴露文件描述符，因此外部程序不再需要显式的打开和关闭文件，它们只需要处理数据，不再需要 `opendir`，`closedir`，`rewinddir`，`open`，`close`，`fcntl`，`dup`，`dup2`，`fdopen`，`fileno` 等一系列 API
- 在 storage 中，`create` 等价于 `Write` 一个 0 字节的文件，因此不再需要独立的 `create` 接口
- storage 支持在 `Read` 和 `Write` 的时候传递 Offset，因此不再需要 `lseek` 接口
- 一些操作系统相关的操作 storage 均不予支持，包括 `pipe`，`mkfifo`，`umask`

## 设计

前面聊过了历史， 也聊过了竞品，下面该讲讲我心目中的存储层了。

一个好的面向应用的抽象存储层该是什么样子呢？

- 忽略无关细节：应用不需要关注打开关闭文件描述符这些底层细节
- 去除历史包袱：不需要提供管道这种现代应用很少用到的功能
- 众存储平等：避免本地存储优先思想，API 接口不依赖已有的 File 和 FileMode 等结构
- 少即是多：提供机制而不是策略，给用户写高级功能的能力，而不是直接提供类似 Matcher 这样的功能
- 专注于单一存储层：跨存储层的操作交给上层应用实现

在开始写 storage 的时候，我拍脑袋定了三个目标：

- Production ready：这个库需要靠谱，要稳定，要有单元测试，不能随意的引入破坏性变更，不能随意的修改函数及其参数的语意，要开发者友好
- High performance：（尽可能的）高性能，一方面是运行效率高，另一方面是开发效率。接口不要太慢，关键路径上不要有过多的封装；接口设计要友好，避免引入过多的新概念，让开发者能快速上手，快速使用
- Vendor lock free：要做一个真正的统一存储层，要尽可能屏蔽各个存储服务业务无关的细节，减少用户迁移存储时的阻力

除了 High performance 目前还没有实际的 Benchmark 外，其他两个目标都算是完成了一大半，下面简单介绍一下。

### 初始化

初始化是使用任何服务的第一步，作为一个通用存储层当然也需要相关的设计，在提案 [3. Support service init via config string](https://github.com/Xuanwo/storage/blob/master/docs/design/3-support-service-init-via-config-string.md) 中我提出了一套基于字符串的配置方式：

```
<type>://<config>
             +
             |
             v
<credential>@<endpoint>/<namespace>?<options>
     +            +                 +
     |            +---------+       +----------------------+
     v                      v                              v
<protocol>:<data>   <protocol>:<data>         <key>:<value>[&<key>:<value>]
```

比如 QingStor 是：

```
qingstor://hmac:<access_key_id>:<secret_access_key>@https:qingstor.com:443/<bucket_name>/<prefix>?zone=pek3b
```

而初始化本地文件系统是：

```
fs:///<work_dir>
```

不同服务的配置串会在文档中制定。

实际的初始化体验形如：

```go
srv, store, err := coreutils.Open("qingstor://hmac:test_access_key:test_secret_key@https:qingstor.com:443/test_bucket_name")
if err != nil {
    log.Fatalf("service init failed: %v", err)
}
```

### 接口设计

大多数存储服务都会有两级甚至更多层次，我将他们分为两层，一层负责实际的存储操作，叫做 Storager，另一层负责处理 Namespace 管理。对大多数对象存储服务来说，就是 Bucket 的管理，特别的，本地文件系统没有实现 Servier 接口。

```go
type Servicer interface {
	// String will implement Stringer.
	String() string

	// List will list all storager instances under this service.
	List(pairs ...*types.Pair) (err error)
	// Get will get a valid storager instance for service.
	Get(name string, pairs ...*types.Pair) (Storager, error)
	// Create will create a new storager instance.
	Create(name string, pairs ...*types.Pair) (Storager, error)
	// Delete will delete a storager instance.
	Delete(name string, pairs ...*types.Pair) (err error)
}
```

Storager 负责所有实际的存储操作，经过各个版本的演化，现在相对稳定的接口形态是这样的：

```go
type Storager interface {
	String() string

	Init(pairs ...*types.Pair) (err error)
	Metadata() (m metadata.Storage, err error)
	ListDir(path string, pairs ...*types.Pair) (err error)
	Read(path string, pairs ...*types.Pair) (r io.ReadCloser, err error)
	Write(path string, r io.Reader, pairs ...*types.Pair) (err error)
	Stat(path string, pairs ...*types.Pair) (o *types.Object, err error)
	Delete(path string, pairs ...*types.Pair) (err error)
}
```

此外，在提案 [1. Unify storager behavior](https://github.com/Xuanwo/storage/blob/master/docs/design/1-unify-storager-behavior.md) 中，我给出了支持更多高级操作的方案：将这些操作拆分为其他的 interface，并在实际使用的时候进行转换。相关的技术考量在提案中都已经描述过，这里就不赘述了。在 Storager 之外，存储服务还能够支持复制（Copier），移动（Mover），获取公开访问链接（Reacher），获取数据统计（Statistician），分段上传（Segmenter）等功能。

一个经常出现分歧的点在于 ListDir 这样的操作中如何返回 item，之前的方案是传递一个递归参数，但是在提案 [2. Use callback in List operations](https://github.com/Xuanwo/storage/blob/master/docs/design/2-use-callback-in-list-operations.md) 中，我决定使用 callback 的方式：

```go
dirFunc := func(object *types.Object) {
    printf("dir %s", object.Name)
}
fileFunc := func(object *types.Object) {
    printf("file %s", object.Name)
}

err := store.ListDir("prefix", types.WithDirFunc(dirFunc), types.WithFileFunc(fileFunc))
if err != nil {
    return err
}
```

有一个没有被文档化的设计是接口中几乎每个函数都有的 `types.Pair`，这个设计的比较早，在 v0.1.0 中就已经引入，至今变化不大。`Pair` 是一个简单的 K-V 结构体：

```go
type Pair struct {
	Key   string
	Value interface{}
}
```

在 `types/pairs` 包中，通过 `pairs.json` 来规定所有可用的 Pair：

```json
{
    "file_func": "types.ObjectFunc"
}
```

并通过代码生成的方式将对应的构造器生成出来：

```go
// WithFileFunc will apply file_func value to Options
func WithFileFunc(v types.ObjectFunc) *types.Pair {
	return &types.Pair{
		Key:   FileFunc,
		Value: v,
	}
}
```

然后在每个服务下，都会有 `meta.json`，比如 [qingstor meta](https://github.com/Xuanwo/storage/blob/master/services/qingstor/meta.json) 来描述每个方法都支持哪些参数，以及哪些参数是必须的，并生成对应的解析函数和结构体。

以 ListDir 为例：

```go
ch := make(chan *types.Object, 1)
defer close(ch)

err := store.ListDir("prefix", pairs.WithFileFunc(func(*types.Object){
    ch <- o
}))
if err != nil {
    log.Printf("storager listdir failed: %v", err)
}
```

## 开发计划

作为一个通用的存储层，如果只支持个别几个服务是很可笑的。因此接下来的一个重要是对接尽可能多的存储服务，这样才能提供这个存储抽象层的自身价值，另一方面也能够通过不同存储服务的不同设计，不同接入方式来验证我的设计合理性和扩展性 。在 v0.4.0 到 v0.5.0 中间，storage 初步支持了 [Azure Blob storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)，[Google Cloud Storage](https://cloud.google.com/storage/)，[Aliyun Object Storage](https://www.aliyun.com/product/oss)，[Amazon S3](https://aws.amazon.com/s3/)。接下来的版本中，storage 会支持 [Tencent Cloud Object Storage](https://cloud.tencent.com/product/cos)，[qiniu kodo](https://www.qiniu.com/products/kodo) 和 [UPYUN Storage Service](https://www.upyun.com/products/file-storage)，并为所有的服务都加上单元测试并补充完整功能。

此外，storage 还要统一存储层返回的错误，使得上层调用者能够轻松的处理来自存储层的错误。在实现 qingstor 支持的时候做过一些尝试，但是并不完整，接下来会在目前的已经实现的存储服务中去验证这个思路。

作为一个服务的重要组成部份，storage 将在 Public API 中加入 context 并支持 OpenTracing。

文档非常重要，目前 storage 只有实现相关的文档，接下来会逐步加入更多的样例和使用说明文档，帮助开发者更快的上手。

其他的代码重构不再展开，欢迎大家来 [Issues 区](https://github.com/Xuanwo/storage/issues) 反馈意见。

## 体会

- 在开发 storage 库的过程中，我尝试着把一些重大的架构决策都以 Proposal 的方式记录下来，算是某种形式的架构决策记录（ADR）。除了写的时候经常能发现自己拍脑袋遗漏掉的点之外，更大的作用是在事后能知道自己当初为什么要做这样的决策，帮助后来者更好的理解设计意图，这样才能够做出更好的决策。
- 想知道自己的接口好不好用，最好的方式还是用到真实的项目中去，小 Demo 很难反映出这个接口的扩展性和可复用性。
- 项目未成形之前不要跟别人讨论，贯彻自己的思路。想不明白的事情可以先实现最简化的路径，然后写个小项目验证一下。
- 在 CI 中引入单元测试，代码覆盖率和质量控制能够提高重构的自信心，对于 Golang 项目来说，可以用 Travis CI + Codecov + GolangCI。
- 知易行难，开始做的时候才会知道看起来简单的东西想做好真的很难。

