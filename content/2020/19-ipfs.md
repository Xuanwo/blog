---
categories: Code
date: 2020-12-12T01:00:00Z
title: "通过 IPFS 分发文件"
tags:
- Distributed System
- File System
- IPFS
---

从今天开始我的博客会使用 [IPFS](https://ipfs.io/) 来分发文中涉及到的所有附件，目前已经上线了 [Paper Reading](https://xuanwo.io/series/paper-reading/) 系列中的所有论文，访问方式如下：

- <ipns://paper.xuanwo.io>  *要求浏览器安装了 [IPFS Companion](https://github.com/ipfs-shipyard/ipfs-companion) 插件*
- <https://ipfs.io/ipns/paper.xuanwo.io> *使用 IPFS 官方的 Gateway，无需特定配置*

此外，之前的文章均已追加对应的下载链接，直接使用即可。

---

## How It Works?

### User Side

#### From ipns://paper.xuanwo.io

`ipns` 是 IPFS 自行声明的一个协议号，[IPFS Companion](https://github.com/ipfs-shipyard/ipfs-companion) 会识别这个地址并使用本地节点或 `Public Gateway` 以提供服务：

- `ipns://paper.xuanwo.io` => `https://ipfs.io/ipns/paper.xuanwo.io`
- `ipfs://abcdef` => `https://ipfs.io/ipfs/abcdef`

#### From paper.xuanwo.io

当 IPFS Gateway 收到形如 `/ipns/paper.xuanwo.io` 这样的请求时，它会通过 [DNSLink](https://dnslink.io/) 机制来寻找对应的内容：

```bash
:) dog _dnslink.paper.xuanwo.io TXT
TXT _dnslink.paper.xuanwo.io. 59s   "dnslink=/ipns/k51qzi5uqu5dg8jr2lu573gsljj5orng0nexbs093zbwy3dwbbgdk8sk3js591"
```

于是 IPFS Gateway 会将该请求转换为对应的实际请求： `/ipns/k51qzi5uqu5dg8jr2lu573gsljj5orng0nexbs093zbwy3dwbbgdk8sk3js591`。

#### From /ipns/k51...

`IPNS`，全称 `InterPlanetary Name System`， 是 IPFS 引入的域名机制，能够将特定的内容与一个 `IPNS ID` 绑定，使得用户能够动态的 *修改* 内容：修改 `IPNS ID` 绑定的内容而不是内容本身。

通过 `go-ipfs` 命令行工具能够查看 `IPNS ID` 对应的内容 ID：

```bash
:) ipfs name resolve /ipns/k51qzi5uqu5dg8jr2lu573gsljj5orng0nexbs093zbwy3dwbbgdk8sk3js591
/ipfs/QmQ9nkebfvHjGYq3xQiuyV1LxZbPkTUVmXPSEcoDDX2QfD
```

IPFS Gateway 同样也会执行类似的 resolve 操作，因此 Gateway 最终会去访问 `/ipfs/QmQ9nkebfvHjGYq3xQiuyV1LxZbPkTUVmXPSEcoDDX2QfD`。

当然后续还涉及到其他的细节就不展开了，可以参考 <https://docs.ipfs.io/>。

### Provider Side

### From files to CID

当在本地执行 `ipfs add xxx` 时，ipfs 会使用特定的算法计算出一个基于内容的 CID (Content IDentifier)。CID 本身是自描述的，具体的 Specs 可以参考 [CID (Content IDentifier) Specification](https://github.com/multiformats/cid)。在 IPFS 的网络上，CID 就唯一标识了一个文件，如果文件的内容发生了任何变动，CID 都会因此发生变化。

以 [Andrew: a distributed personal computing environment.pdf](https://ipfs.io/ipns/paper.xuanwo.io/Andrew:%20a%20distributed%20personal%20computing%20environment.pdf) 为例，它的 CID 是： `QmQ9nkebfvHjGYq3xQiuyV1LxZbPkTUVmXPSEcoDDX2QfD`，那就可以通过 <https://ipfs.io/ipfs/QmQ9nkebfvHjGYq3xQiuyV1LxZbPkTUVmXPSEcoDDX2QfD> 访问该文件，提供该文件的节点是任何拥有相同 CID 的节点。

### From CID to IPNS

为了能够让用户以相同的 ID 访问不断在更新的文件，维护者需要将 CID 绑定到 IPNS ID 上。IPNS 是一个基于非对称加密的系统，一对公私密钥对应一个唯一的 IPNS ID，只有持有私钥的节点能够更新该 IPNS ID 对应的 CID。

```bash
ipfs name publish --key=<key-id> <CID>
```

后面的流程就能跟用户侧连起来啦。