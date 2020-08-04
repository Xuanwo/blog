---
categories: Code
date: 2020-08-05T01:00:00Z
title: "go-locale: 想当然导致的 BUG 们"
series: "Learn From Bug"
tags:
- golang
- i18n
---

[go-locale](https://github.com/Xuanwo/go-locale) 是一个跨平台语言检测库，前段时间刚刚发布了 `v1.0.0`，开发的过程中出现了不少想当然导致的问题，本文做了一些整理。

## `locale` 没有黑魔法

早期版本的 `go-locale` 是这样做检测的：

- 检查 `LANG`，`LC_MESSAGES` 和 `LC_ALL` 环境变量
- 执行 `locale` 命令以获取输出

看起来很不错的逻辑在某个用户的环境中却总是拿不到 locale，在想办法构建出用户的环境之后才发现 `locale` 执行的结果是空的。最小的复现场景是这样的：

```bash
# unset LANG
# unset LC_*
> locale
LANG=
LC_CTYPE="POSIX"
LC_NUMERIC="POSIX"
LC_TIME="POSIX"
LC_COLLATE="POSIX"
LC_MONETARY="POSIX"
LC_MESSAGES=
LC_PAPER="POSIX"
LC_NAME="POSIX"
LC_ADDRESS="POSIX"
LC_TELEPHONE="POSIX"
LC_MEASUREMENT="POSIX"
LC_IDENTIFICATION="POSIX"
LC_ALL=
```

locale 执行的结果中 `LANG`，`LC_MESSAGES` 和 `LC_ALL` 都是空的！当时还挺难接受的，我本以为 locale 还会有什么神奇的黑魔法，但是看了代码之后才明白，世上没有什么魔法：

```c
/* We have to show the contents of the environments determining the
   locale.  */
static void
show_locale_vars (void)
{
  const char *lcall = getenv ("LC_ALL") ?: "";
  const char *lang = getenv ("LANG") ?: "";
  /* LANG has to be the first value.  */
  print_assignment ("LANG", lang, false);
  /* Now all categories in an unspecified order.  */
  for (size_t cat_no = 0; cat_no < NCATEGORIES; ++cat_no)
    if (cat_no != LC_ALL)
      {
        const char *name = category[cat_no].name;
        const char *val = getenv (name);
        if (lcall[0] != '\0' || val == NULL)
          print_assignment (name,
                            lcall[0] != '\0' ? lcall
                            : lang[0] != '\0' ? lang
                            : "POSIX",
                            true);
        else
          print_assignment (name, val, false);
      }
  /* The last is the LC_ALL value.  */
  print_assignment ("LC_ALL", lcall, false);
}
```

原来 locale 的结果也是从环境变量读到的。

在后续的版本中，go-locale 去掉了通过执行 locale 来检测语言的方案，增加了读取用户 `locale.conf` 支持。

## Windows 文档深似海

早期 go-locale 通过 Windows OLE 来检测用户使用的语言，借鉴了 [go-win64api](https://github.com/iamacarpet/go-win64api) 的实现，看起来大概长这样：

```go
func detectViaWin32OLE() (tag language.Tag, err error) {
	err = ole.CoInitialize(0)

	unknown, err := oleutil.CreateObject("WbemScripting.SWbemLocator")

	wmi, err := unknown.QueryInterface(ole.IID_IDispatch)

	serviceRaw, err := oleutil.CallMethod(wmi, "ConnectServer")
	service := serviceRaw.ToIDispatch()

	resultRaw, err := oleutil.CallMethod(service, "ExecQuery", "SELECT OSLanguage FROM Win32_OperatingSystem")
	result := resultRaw.ToIDispatch()

	itemRaw, err := oleutil.CallMethod(result, "ItemIndex", 0)
	item := itemRaw.ToIDispatch()

	languageCode, err := oleutil.GetProperty(item, "OSLanguage")

	tag, ok := osLanguageCode[uint32(languageCode.Val)]
}
```

为了能够正确的将微软的 language code 转换为 BCP 47 Tag，我还写了些代码抓取文档页面自动生成出了 `osLanguageCode` 这个 map：

```go
var osLanguageCode = map[uint32]string{
	0x0036: "af",             // Afrikaans - , supported from Release 7
	0x0436: "af-ZA",          // Afrikaans - South Africa, supported from Release B
	0x001C: "sq",             // Albanian - , supported from Release 7
	0x041C: "sq-AL",          // Albanian - Albania, supported from Release B
  ...
}
```

然而，我漏读了一些文档。

```
// ref: https://docs.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem
OSLanguage: Language version of the operating system installed.
```

正如 Issue [Windowns OLE detection seems inacurate #19](https://github.com/Xuanwo/go-locale/issues/19) 中所提到的，安装语言跟最后用户设定的语言可不一定是同一个。

正确的做法是从注册表中读取用户的配置：

```go
func detectViaRegistry() (langs []string, err error) {
	defer func() {
		if err != nil {
			err = &Error{"detect via registry", err}
		}
	}()

	key, err := registry.OpenKey(registry.CURRENT_USER, `Control Panel\International`, registry.QUERY_VALUE)
	if err != nil {
		return nil, err
	}
	defer key.Close()

	lang, _, err := key.GetStringValue("LocaleName")
	if err != nil {
		return nil, err
	}

	return []string{lang}, nil
}
```

*没想到这么多年过去了，我还是躲不开注册表*

## 总结

操作系统检查语言的坑比想象的还要多，未来 go-locale 还将支持 `js/wasm`，`android` 和 `ios` 等平台的检测，希望届时有机会再分享这些平台上检测语言会有什么样的坑～
