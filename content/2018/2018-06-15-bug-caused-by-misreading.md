---
categories: Develop
date: 2018-06-15T18:00:00Z
tags:
- Golang
series: "Learn From Bug"
title: 文档误读导致的 BUG
url: /2018/06/15/bug-caused-by-misreading/
---

之前听说过开发人员[读错 Intel 的文档](https://www.theregister.co.uk/2018/05/09/intel_amd_kernel_privilege_escalation_flaws/)导致出现了严重 [BUG](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-8897)，但是只是当成玩笑看待，但是等到这种事情发生在自己身上，还影响到了项目在用户生产环境的上线进度的时候，就不是那么好笑了。

> 本文取材自真实事件的复盘，项目相关信息已经去敏。

<!--more-->

## 经过

项目服务上线完毕，但是在上线后的测试中发现后端出现大量 504 错误。通过跟踪日志得知报错问题是后端数据库查询超时，在确定问题稳定复现之后，首先排除了服务器抖动，上线操作失误等问题，将原因锁定在了代码的层面。进一步的，还发现这个问题与后端的某个异步任务组件有关：只要开启该组件，错误就会出现；只要关闭，错误就会消失。该组件最近实施过一次较大的重构，在对代码进行二次 Review 之后，我们发现了可能出问题的点：重构时为了提升性能，组件内部会开多个 Goroutine 并发查询数据库，在业务首次启动时可能会对数据库造成特别大的压力。将并发改成 for 循环之后情况有所好转但是还是会有查询超时，没有修复到位。再次检查该组件中涉及到的数据库操作相关代码，发现有些 Query 操作返回的 row 没有手动做 Close 。在增加手动 Close 的代码后，超时问题消失。

## 溯源

第二天我再回过来看这段代码，发现导致这个错误的根源是我对一段文档的误读：

```go
// Close closes the Rows, preventing further enumeration. If Next is called
// and returns false and there are no further result sets,
// the Rows are closed automatically and it will suffice to check the
// result of Err. Close is idempotent and does not affect the result of Err.
func (rs *Rows) Close() error {
	return rs.close(nil)
}
```

文档中的描述是：如果 Next 被调用，并返回了 false 而且没有更多结果的时候，rows 将会自动 close。但是我实际上写出来的代码是这样的：

```go
value := sql.NullInt64{}
row, err := builder.Select(db.Func("COUNT", "?")).
	From(table).Where(cond).Query()
if err != nil {
	log.Errorf(ctx, "MySQL error for %v.", err)
	return
}
if row.Next() {
	err = row.Scan(&value)
	if err != nil {
		log.Errorf(ctx, "MySQL scan error for %v.", err)
		return
	}
	if value.Valid {
		n = int64(value.Int64)
	}
}
```

区别在于我将这段文档理解成了：如果调用了 Next，而且没有更多结果的时候，rows 将会自动 close。实际上，Next 在返回 false 的时候后，其对应的 rows 才会 close。我们可以看一下 upperdb Rows 结构体的 Next 函数实现：

```go
// Next prepares the next result row for reading with the Scan method. It
// returns true on success, or false if there is no next result row or an error
// happened while preparing it. Err should be consulted to distinguish between
// the two cases.
//
// Every call to Scan, even the first one, must be preceded by a call to Next.
func (rs *Rows) Next() bool {
	var doClose, ok bool
	withLock(rs.closemu.RLocker(), func() {
		doClose, ok = rs.nextLocked()
	})
	if doClose {
		rs.Close()
	}
	return ok
}

func (rs *Rows) nextLocked() (doClose, ok bool) {
	if rs.closed {
		return false, false
	}

	// Lock the driver connection before calling the driver interface
	// rowsi to prevent a Tx from rolling back the connection at the same time.
	rs.dc.Lock()
	defer rs.dc.Unlock()

	if rs.lastcols == nil {
		rs.lastcols = make([]driver.Value, len(rs.rowsi.Columns()))
	}

	rs.lasterr = rs.rowsi.Next(rs.lastcols)
	if rs.lasterr != nil {
		// Close the connection if there is a driver error.
		if rs.lasterr != io.EOF {
			return true, false
		}
		nextResultSet, ok := rs.rowsi.(driver.RowsNextResultSet)
		if !ok {
			return true, false
		}
		// The driver is at the end of the current result set.
		// Test to see if there is another result set after the current one.
		// Only close Rows if there is no further result sets to read.
		if !nextResultSet.HasNextResultSet() {
			doClose = true
		}
		return doClose, false
	}
	return false, true
}
```

可以看到 Next 只有在 `nextLocked` 返回的 `doClose` 为 `true` 时才会主动调用 `rs.Close()`，而按照 `nextLocked` 中的逻辑，如果有值的话，会返回 `false, true`。也就是说，当 Next 返回 `true` 的时候，是不会去 Close rows 的。分析到这里，昨晚上线翻车的原因就很明显了，大量的 count query 的 rows 没有被 close 导致链接无法释放，从而新的请求无法执行以至于超时了。

## 动态

- 好不容易调整回来的作息被这次上线打回去了，现在很蓝瘦
- 用户环境上一次线就欠别人一顿饭，多上几次我要破产了。。。
- [GEB](https://www.amazon.cn/dp/B00L1VVUTC) 虽然看不懂，但是我感觉很有意思
- [qscamel](https://docs.qingcloud.com/qingstor/developer_tools/qscamel.html) 在经历了多个大用户的捶打之后终于正式发布了，有机会要写一个系列的文章讲讲自己在开发 qscamel 的时候都学到了啥
- 好久没有发文章了，找个由头水一篇
- 博客在 Linode 上跑了两个月之后，还是乖乖的回到了 gh-pages 的怀抱，真香
- 话说动态这个章节有人看么，如果不讨喜的我考虑一下去掉 = =

