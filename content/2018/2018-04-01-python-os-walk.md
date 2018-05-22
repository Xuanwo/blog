---
categories: Develop
date: 2018-04-01T10:07:00Z
tags:
- Python
series: "Learn from BUG"
title: Python os walk 的坑
toc: true
url: /2018/04/01/python-os-walk/
---

用户反馈使用在 windows 下使用 [qsctl](https://github.com/yunify/qsctl) 上传文件的时候会中断并抛出 `UnicodeDecodeError` 异常，经过一番调查之后发现居然是 `os.walk` 的坑。

<!--more-->

## 定位

接到用户的反馈之后，首先尝试进行了复现，最后成功的找到了一个能复现该问题的 case:

```bash
>>> # create a file with bad name and sync with qsctl 1.7.0 on python 2.7.13:
>>> touch $(echo -e "\x8b\x8bThis")
>>> qsctl sync ./ qs://xxxxxx
```

抛出来的异常如下：

```python
Traceback (most recent call last):
  File "/home/xuanwo/.pyenv/versions/2.7.13/bin/qsctl", line 27, in <module>
    sys.exit(main())
  File "/home/xuanwo/.pyenv/versions/2.7.13/bin/qsctl", line 24, in main
    return qingstor.qsctl.driver.main()
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/site-packages/qingstor/qsctl/driver.py", line 100, in main
    command.main(args[2:])
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/site-packages/qingstor/qsctl/commands/base.py", line 276, in main
    return cls.send_request()
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/site-packages/qingstor/qsctl/commands/transfer.py", line 546, in send_request
    cls.upload_files()
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/site-packages/qingstor/qsctl/commands/transfer.py", line 165, in upload_files
    for rt, dirs, files in os.walk(source_path):
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/os.py", line 286, in walk
    if isdir(join(top, name)):
  File "/home/xuanwo/.pyenv/versions/2.7.13/lib/python2.7/posixpath.py", line 71, in join
    path +=  b
UnicodeDecodeError: 'ascii' codec can't decode byte 0x8b in position 0: ordinal not in range(128)
```

之前写过的一篇关于 Python 字符串的[文章](https://xuanwo.org/2017/01/22/encoding-in-python/) 曾经分析过类似的问题，Python 2 在进行字符串比较、拼接、替换时，会进行隐式的类型转换。通过查看 `posixpath.py` 的源码，可以定位到报错的地方：

```python
def join(a, *p):
    """Join two or more pathname components, inserting '/' as needed.
    If any component is an absolute path, all previous path components
    will be discarded.  An empty last part will result in a path that
    ends with a separator."""
    path = a
    for b in p:
        if b.startswith('/'):
            path = b
        elif path == '' or path.endswith('/'):
            path +=  b # This is line 71.
        else:
            path += '/' + b
    return path
```

在 Python 2 下，str 与 unicode 相加，str 会做一次 decode() 转换为 unicode 再相加。也就是说此处报错是因为 path 和 b 的类型不一致导致出现了本不该出现的一次 decode()。顺着代码继续分析，path 和 b 是上层传入的 top 和 name，而这一层的调用是在 os 包的内部进行的。也就是说，os.walk 在处理过程中并没有严格遵循保持类型一致的不成文约定，而是在传入 unicode 的情况下，出现了 str 类型。知道了问题出在 `os.walk`，接下来再看看 `os.walk` 的实现就能明白问题的所在了：

```python
def walk(top, func, arg):
  islink, join, isdir = path.islink, path.join, path.isdir

  # We may not have read permission for top, in which case we can't
  # get a list of the files the directory contains.  os.path.walk
  # always suppressed the exception then, rather than blow up for a
  # minor reason when (say) a thousand readable directories are still
  # left to visit.  That logic is copied here.
  try:
      # Note that listdir and error are globals in this module due
      # to earlier import-*.
      names = listdir(top)
  except error, err:
      if onerror is not None:
          onerror(err)
      return

  dirs, nondirs = [], []
  for name in names:
      if isdir(join(top, name)):
          dirs.append(name)
      else:
          nondirs.append(name)

  if topdown:
      yield top, dirs, nondirs
  for name in dirs:
      new_path = join(top, name)
      if followlinks or not islink(new_path):
          for x in walk(new_path, topdown, onerror, followlinks):
              yield x
  if not topdown:
      yield top, dirs, nondirs
```

等到读完 `os.walk` 的实现我们就能明白，`os.walk` 也是被迫背锅的，那个奇怪的 str 是由 `os.listdir` 返回的。但是 `os.listdir` 的实现是系统相关的，`os.walk` 理应屏蔽掉编码的细节，为用户提供一个行为一致的接口。

## 修复

定位到问题之后，修复起来就变得简单了。检查一下 listdir 的返回值，如果类型是 str，我们就试着去做一次 decode。如果报错了的话，我们需要通过 onerror 来处理这个情况然后把这个文件从结果中去掉以保证同步可以继续进行。
最后通过这两个 commit 对这个问题进行了修复：

- [Handle UnicodeDecodeError while use os.walk](https://github.com/yunify/qsctl/commit/f071667b12f8172451a9e7d63dcdd44f9348bf22)
- [Handle illegal characters in a better way](https://github.com/yunify/qsctl/commit/840a97ef8954fbe35659cfc6d457f461dcf2b77d)

## 总结

- 接口是开发者与用户的神圣契约，我们要尽量避免不一致的行为。
- 上层接口要尽可能屏蔽下层的细节，不要把本该自己处理的问题扔给用户处理。
- Python 2 快点死掉吧 = =

## 动态

- 正如开头所说的，这篇文章是 “Learn From BUG” 系列的第一篇，之后我会不定期的整理和分享一些自己平时遇到的 BUG 解决思路。一方面是为了自己能够从 BUG 中学到更多，另一方面是希望能够帮助到被类似 BUG 困扰的人们。
- 随着再一次的心血来潮，我在 Linode 买了台机器部署并且把 Blog 迁移了过去，去掉了减速 CDN，实测速度比之前快上了不少。
- 《比宇宙更遥远的地方》完结撒花了，我现在唯一的感触就是这次的圣地巡礼可能有点贵 = =
