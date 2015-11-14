title: 文本转换神器——Pandoc
date: 2015-11-14 14:29:18
tags: [Soft]
categories: Opinion
toc: true
---
# 介绍

Pandoc是一个用haskell编写的文本转换工具，小巧迅速且支持格式广泛，堪称文本转换应用的瑞士军刀。

<!-- more -->

# 支持格式

## 输入
- [markdown](http://daringfireball.net/projects/markdown/)
- [reStructuredText](http://docutils.sourceforge.net/docs/ref/rst/introduction.html)
- [textile](http://redcloth.org/textile)
- [HTML](http://www.w3.org/TR/html40/)
- [DocBook](http://www.docbook.org/)
- [LaTeX](http://www.latex-project.org/)
- [MediaWiki markup](http://www.mediawiki.org/wiki/Help:Formatting)
- [TWiki markup](http://twiki.org/cgi-bin/view/TWiki/TextFormattingRules)
- [OPML](http://dev.opml.org/spec2.html)
- Emacs [Org-Mode](http://orgmode.org)
- [Txt2Tags](http://txt2tags.org/)
- Microsoft Word [docx](http://www.microsoft.com/interop/openup/openxml/default.aspx)
- LibreOffice [ODT](http://en.wikipedia.org/wiki/OpenDocument)
- [EPUB](http://en.wikipedia.org/wiki/EPUB)
- [Haddock markup](http://www.haskell.org/haddock/doc/html/ch03s08.html)

## 输出
-   HTML格式: XHTML, HTML5, 和 HTML slide shows using
    [Slidy](http://www.w3.org/Talks/Tools/Slidy),
    [reveal.js](http://lab.hakim.se/reveal-js/),
    [Slideous](http://goessner.net/articles/slideous/),
    [S5](http://meyerweb.com/eric/tools/s5/), 或
    [DZSlides](http://paulrouget.com/dzslides/).
-   字处理格式: Microsoft Word
    [docx](http://www.microsoft.com/interop/openup/openxml/default.aspx),
    OpenOffice/LibreOffice
    [ODT](http://en.wikipedia.org/wiki/OpenDocument), [OpenDocument
    XML](http://opendocument.xml.org/)
-   电子书: [EPUB](http://en.wikipedia.org/wiki/EPUB) version 2或3,
    [FictionBook2](http://www.fictionbook.org/index.php/Eng:XML_Schema_Fictionbook_2.1)
-   文档格式: [DocBook](http://www.docbook.org/), [GNU
    TexInfo](http://www.gnu.org/software/texinfo/), [Groff
    man](http://www.gnu.org/software/groff/groff.html) pages, [Haddock
    markup](http://www.haskell.org/haddock/doc/html/ch03s08.html)
-   页面布局格式: [InDesign
    ICML](https://www.adobe.com/content/dam/Adobe/en/devnet/indesign/cs55-docs/IDML/idml-specification.pdf)
-   大纲格式: [OPML](http://dev.opml.org/spec2.html)
-   TeX 格式: [LaTeX](http://www.latex-project.org/),
    [ConTeXt](http://www.pragma-ade.nl/), LaTeX Beamer slides
-   [PDF](http://en.wikipedia.org/wiki/Portable_Document_Format) via
    LaTeX
-   轻量级标记格式:
    [Markdown](http://daringfireball.net/projects/markdown/) (including
    [CommonMark](http://commonmark.org)),
    [reStructuredText](http://docutils.sourceforge.net/docs/ref/rst/introduction.html),
    [AsciiDoc](http://www.methods.co.nz/asciidoc/), [MediaWiki
    markup](http://www.mediawiki.org/wiki/Help:Formatting), [DokuWiki
    markup](https://www.dokuwiki.org/wiki:syntax), Emacs
    [Org-Mode](http://orgmode.org),
    [Textile](http://redcloth.org/textile)
-   自定义格式: custom writers can be written in
    [lua](http://www.lua.org).

# 安装

## 安装Pandoc
在[此页面](https://github.com/jgm/pandoc/releases)上寻找对应平台的二进制安装包

*Windows平台需要将Pandoc加入Path目录才能在cmd环境中调用*

## 安装Tex支持（可选，用于编译Tex并输出PDF）

- Windows平台建议[MiKTeX](http://miktex.org/)
- MacOS平台建议[BasicTeX](http://www.tug.org/mactex/morepackages.html)并使用`tlmgr`工具安装需要的包
- Linux平台建议[Tex Live](http://www.tug.org/texlive/)

# 使用

*你可以使用在线的[DEMO](http://pandoc.org/try/)*


```
pandoc x.html -o x.md
pandoc -f html -t markdown http://www.fsf.org
```

- `-f`参数用于指定源文件格式
- `-t`参数用于指定输出文件格式
- `-o`参数用于指定输出文件

*如果不使用`-f`和`-t`参数，pandoc将会根据输入文件以及`-o`指定的输出文件格式来确定转换的格式类型*


# 引用资源

- [Pandoc官网 *需要梯子* ](http://pandoc.org/)
- [Pandoc User Guide](http://pandoc.org/README.html)
- [黑魔法利器pandoc](http://yanping.me/cn/blog/2012/03/13/pandoc/)
- [Markdown写作进阶：Pandoc入门浅谈](http://www.yangzhiping.com/tech/pandoc.html)

# 更新日志

- 2015年11月14日 完成初步使用