---
categories: Code
date: 2019-03-10T04:00:00Z
tags:
- Golang
- Python
- gRPC
- Anybox
title: 通过 gRPC 传递 Request ID
url: /2019/03/10/request-id-in-grpc/
---

分布式追踪是 [Anybox](https://www.qingcloud.com/products/anybox/) 项目中的重要一环，其中在每个请求的入口处设置一个 Request ID 是分布式追踪的第一步。这篇文章主要介绍如何利用 gRPC 的 Metadata 与 Interceptor 功能来实现 Request ID 在不同服务间的生成与传递。

<!--more-->


## 介绍

### Tracing

关于 Tracing 的介绍，可以看朋友 P 写的 [OpenTracing 详解](https://pjw.io/articles/2018/05/08/opentracing-explanations/#section-3)，看完之后就能大概明白为什么需要设置并传递 Request ID。

### Metadata

Metadata 可以理解为一个 HTTP 请求的 Header（它的底层实现就是 HTTP/2 的 Header），用户可以通过访问和修改每个 gRPC Call 的 Metadata 来传递额外的信息：比如认证信息，比如本文中提到的 Request ID。

### Interceptor

Interceptor 有点类似于我们平时常用的 HTTP Middleware，不同的是它可以用在 Client 端和 Server 端。比如在收到请求之后输出日志，在请求出现错误的时候输出错误信息，比如获取请求中设置的 Request ID。

## 实现

Anybox 后端主要使用 Golang 和 Python 开发，因此本文主要介绍这两种语言的使用方式，其他语言的使用方式应该与之类似。

### Golang

```golang
// UnaryInvoker is called by UnaryClientInterceptor to complete RPCs.
type UnaryInvoker func(ctx context.Context, method string, req, reply interface{}, cc *ClientConn, opts ...CallOption) error

// UnaryClientInterceptor intercepts the execution of a unary RPC on the client. invoker is the handler to complete the RPC
// and it is the responsibility of the interceptor to call it.
// This is an EXPERIMENTAL API.
type UnaryClientInterceptor func(ctx context.Context, method string, req, reply interface{}, cc *ClientConn, invoker UnaryInvoker, opts ...CallOption) error

// UnaryHandler defines the handler invoked by UnaryServerInterceptor to complete the normal
// execution of a unary RPC. If a UnaryHandler returns an error, it should be produced by the
// status package, or else gRPC will use codes.Unknown as the status code and err.Error() as
// the status message of the RPC.
type UnaryHandler func(ctx context.Context, req interface{}) (interface{}, error)

// UnaryServerInterceptor provides a hook to intercept the execution of a unary RPC on the server. info
// contains all the information of this RPC the interceptor can operate on. And handler is the wrapper
// of the service method implementation. It is the responsibility of the interceptor to invoke handler
// to complete the RPC.
type UnaryServerInterceptor func(ctx context.Context, req interface{}, info *UnaryServerInfo, handler UnaryHandler) (resp interface{}, err error)
```

Golang 的实现是把 Metadata 塞在了 context 里面，只需要使用 `metadata.FromOutgoingContext(ctx)` 和 `metadata.FromIncomingContext(ctx)` 就能够访问本次请求的 Metadata。概念清楚之后代码应该非常好写了：

```golang
func RequestIDClientInterceptor() grpc.UnaryClientInterceptor {
	return func(
		ctx context.Context,
		method string, req, resp interface{},
		cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption,
	) (err error) {
		md, ok := metadata.FromOutgoingContext(ctx)
		if !ok {
			md = metadata.Pairs()
		}

		value := ctx.Value(trace.RequestID)
		if requestID, ok := value.(string); ok && requestID != "" {
			md[string(trace.RequestID)] = []string{requestID}
		}
		return invoker(metadata.NewOutgoingContext(ctx, md), method, req, resp, cc, opts...)
	}
}

func RequestIDServerInterceptor() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler,
	) (resp interface{}, err error) {
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			md = metadata.Pairs()
		}
		// Set request ID for context.
		requestIDs := md[string(trace.RequestID)]
		if len(requestIDs) >= 1 {
			ctx = context.WithValue(ctx, trace.RequestID, requestIDs[0])
			return handler(ctx, req)
		}

		// Generate request ID and set context if not exists.
		requestID := id.NewHex32()
		ctx = context.WithValue(ctx, trace.RequestID, requestID)
		return handler(ctx, req)
	}
}
```

### Python

> Python 这边相对更蛋疼一些，注释写得不是非常清晰，给的使用样例也十分的晦涩难懂，看了好一会儿源码才明白怎么用。

Python 想要实现一个 Client Interceptor 的话需要继承 `grpc.UnaryUnaryClientInterceptor` 并实现 `intercept_unary_unary` 方法。

```python
class UnaryUnaryClientInterceptor(six.with_metaclass(abc.ABCMeta)):
    """Affords intercepting unary-unary invocations.

    This is an EXPERIMENTAL API.
    """

    @abc.abstractmethod
    def intercept_unary_unary(self, continuation, client_call_details, request):
        """Intercepts a unary-unary invocation asynchronously.

        Args:
          continuation: A function that proceeds with the invocation by
            executing the next interceptor in chain or invoking the
            actual RPC on the underlying Channel. It is the interceptor's
            responsibility to call it if it decides to move the RPC forward.
            The interceptor can use
            `response_future = continuation(client_call_details, request)`
            to continue with the RPC. `continuation` returns an object that is
            both a Call for the RPC and a Future. In the event of RPC
            completion, the return Call-Future's result value will be
            the response message of the RPC. Should the event terminate
            with non-OK status, the returned Call-Future's exception value
            will be an RpcError.
          client_call_details: A ClientCallDetails object describing the
            outgoing RPC.
          request: The request value for the RPC.

        Returns:
            An object that is both a Call for the RPC and a Future.
            In the event of RPC completion, the return Call-Future's
            result value will be the response message of the RPC.
            Should the event terminate with non-OK status, the returned
            Call-Future's exception value will be an RpcError.
        """
        raise NotImplementedError()
```

`client_call_details.metadata` 是一个 list，里面的每一个 item 都是由 `(key, value)` 组成的元组。


```python
class _ClientCallDetails(
    collections.namedtuple(
        '_ClientCallDetails',
        ('method', 'timeout', 'metadata', 'credentials', 'wait_for_ready')),
    grpc.ClientCallDetails):
    pass


class RequestIDClientInterceptor(grpc.UnaryUnaryClientInterceptor):

    def intercept_unary_unary(self, continuation, client_call_details, request):
        rid = the_function_to_generate_request_id()
        logger.info(f"Sending RPC request, Method: {client_call_details.method}, Request ID: {rid}.")

        # Add request into client call details, aka, metadata.
        metadata = []
        if client_call_details.metadata is not None:
            metadata = list(client_call_details.metadata)
        metadata.append(("request_id", rid))

        client_call_details = _ClientCallDetails(
            client_call_details.method, client_call_details.timeout, metadata,
            client_call_details.credentials, client_call_details.wait_for_ready)
        return continuation(client_call_details, request)
```

在初始化 Channel 的时候在实例化一下即可：


```python
channel = insecure_channel(f"{host}:{port}")
channel = intercept_channel(channel, RequestIDClientInterceptor())
```

## 参考资料

- [OpenTracing 详解](https://pjw.io/articles/2018/05/08/opentracing-explanations/)
- [grpc-metadata](https://github.com/grpc/grpc-go/blob/master/Documentation/grpc-metadata.md)
- [gRPC Python Interceptor Examples](https://github.com/grpc/grpc/tree/master/examples/python/interceptors)
