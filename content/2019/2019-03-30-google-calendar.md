---
categories: Code
date: 2019-03-30T01:00:00Z
tags:
- Google
- Chinese
- JavaScript
title: 在 Google 日历度过的欢乐时光
url: /2019/03/30/google-calendar/
---

前段时间终于下定决定入了 G Suite，花了点时间进行数据迁移，但是在操作日历的时候错误的把朋友们的生日提醒（每年重复）导入到了我的行程当中。为了将这些提醒删掉，我开始了一次 Google 日历的奇妙探险，找到了批量处理的方法，甚至还发现了一个 BUG。

<!--more-->

## Apps Script 是好文明

首先来明确一下需要解决的问题：删除个人日历中出现的大量形如 “XXX 的生日” 的行程。OK，问题确定之后，可以初步得到几种解决问题的思路：

- 手动删
- 现成的工具
- 基于 Google 日历 API 开发脚本

首先排除第一种，时间成本过高，而且都是机械操作，毫无乐趣可言。现成的工具有是有，但是你需要授权第三方访问你的全部行程，我实在是不想之后某天被人发现我宣称出差公干其实是去宾馆跟朋友们一起玩俄罗斯方块吃鸡（原帖：<https://bbs.nga.cn/read.php?tid=16784200>）。所以现成工具的方案也被排除了。

所以我又要造轮子了么？不，我们可以用 Apps Script！Apps Script 可以理解成自带 Google 绝大部分套件 SDK 组件的 JavaScript 运行环境，最棒的是它还是可以直接在线运行的。

研究一下日历的[文档](https://developers.google.com/apps-script/reference/calendar/)，可以知道需要用到的 API 只有 `getCalendarsByName`，`getEvents`，`getTitle` 和 `deleteEvent` 这些，剩下的都是些逻辑。

```javascript
function myFunction()
{
    var fromDate = new Date(2000,0,1,0,0,0); 
    var toDate = new Date(2999,0,1,0,0,0);
    var calendarName = 'Personal';

    var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
    var events = calendar.getEvents(fromDate, toDate, {search: "生日"});
    for(var i=0; i<events.length;i++){
      var ev = events[i];
      var title = ev.getTitle();
      if (title.indexOf("的生日") > -1) {
        ev.deleteEvent();
      }
    }
}
```

一顿操作之后，只需要点击 `Run` 就能运行啦，这时候切换到 Google 日历就能看到恼人的行程都已经被删掉了。

## Google 日历预言的世界末日

欢乐时光还没有结束！

看到自己的脚本成功运行后自然会想要验证一下，于是我通过修改 URL 的方式访问了 [2099/1/1](https://calendar.google.com/calendar/r/month/2099/1/1)。emmmmm，这是咋了，为啥界面全都是空的，Console 还有报错：

```javascript
Uncaught TypeError: Cannot read property 'Iu' of null
    at vEb (m=sy78,syou,xDNx2e,w…ypy,sypz,rBHmpf:404)
    at EU.HJ (m=sy78,syou,xDNx2e,w…ypy,sypz,rBHmpf:404)
    at CEb.h.kAa (m=sy78,syou,xDNx2e,w…ypy,sypz,rBHmpf:408)
    at R1.Oe (m=ltDFwf,syi2,FsScmc…symq,sy1,phtQPb:321)
    at m=base:727
    at xha (m=base:263)
    at Ei (m=base:261)
    at Ci.addCallback (m=base:260)
    at Gya (m=base:727)
    at m=base:726
```

本来想洗洗睡了的我瞬间来了精神，我很好奇！

通过二分的方法，我得到了临界点：[2051/2/10](https://calendar.google.com/calendar/r/day/2051/2/10) 。这个日子有什么特别的呢？为什么在它之前都是正常的，从它开始不管显示天，周还是月都无法正常显示呢？我瞬间有了几个猜想，不过需要一一验证。

第一个猜想是数据类型的限制。我做了一些简单的计算：

|数据类型|最大值|对应时间|
|--------|------|--------|
|int32|2147483647|`2038/1/19 11:14:7`|
|uint32|4294967295|`2106/2/7 14:28:16`|
|JavaScript 最大精确整数|9007199254740991|`285428751/11/12 7:36:31`|

无论哪一个都无法支持先前的猜想，所以问题肯定不是数据类型的问题。

第二个猜想是前端的 BUG。我稍微研究了一下 Google 日历混淆之后的代码：

```javascript
var vEb = function(a, b) {
        return [b.Iu ? a.T ? "\u95f0" : "\u958f" : "", CU[b.month], "\u6708"].join("")
}
```

这里有几个 Unicode 字符，转换一下：`\u95f0 -> 闰`，`\u958f -> 閏`，`\u6708 -> 月`。Wow，`vEb` 函数的作用就是判断当前月是不是闰月，根据用户的语言还会决定显示简体还是繁体。`a.T` 显然是在判断语言，不用考虑。`b.Iu` 更加关键一些，它会判断给定的日期（这里的 b？）是否是闰月。

接下来只要搞懂 b 是怎么来的，前面肯定有某一步返回的 b 是 null。但是面对 Google 混淆过的代码，想搞懂这个 b 是怎么来的谈何容易。我相信给我足够的时间，我能够缕清楚代码的脉络，最后得出一个结论，但是我现在更倾向于先换个思路，回头再来尝试。

下面从代码中跳出来思考，2051 年 2 月 10 日，这个日子到底有什么魔力呢？难道 Google 日历这么早就钦定了世界末日么？我开始试着在 Google 上搜索这个时间，结果还真的有发现。有一篇文章[ASP农历与公历互转类](http://www.mzwu.com/article.asp?id=1380)中居然出现完全一样的时间：

```
'公历转农历(查询日期范围1950-2-17至2051-2-10,格式yyyy-mm-dd)
' Response.Write NongGong.GongToNong("1984-12-10")
```

我下意识的将这个日子转换成了农历：`2050年 腊月 廿九 （辛未年 庚寅月 丙寅日）`，我好像明白了什么，但是需要更多的信息来做支撑。

## 农历编排及其转换

首先要重新认识一下农历：

> 农历，是现今东亚地区民间传统广泛使用的阴阳合历。古代相传为黄帝时代或者夏朝创制，又称黄历、夏历。中华民国成立后，由孙中山宣布采用西方格里历，而华夏传统历法则返称为旧历、传统历。中华人民共和国成立后，以格里历为“公历”，夏历改称“农历”。在汉语，西历也称阳历，因此农历常习惯上称为阴历，然而此历其实为阴阳合历。
> 农历是阴阳历：“阳”是地球环绕太阳公转，以冬至回归年为基准确定岁实，配合季节阳光分一岁为二十四节气；“阴”根据月球运行定朔望月。中国现存历书最早是西汉版本之《夏小正》，汉武帝时期制定之《太初历》已经有相当完善之历法规则，自此大都采用“夏正”，即以建寅月为正月；之后定朔定气规则又多次修改。现行农历版本是依据既定基本规则，运用现代天文学成果修订，完全依照天文数据计算得来，为一天文历法（astronomical calendar）。

画重点：**依据既定基本规则，运用现代天文学成果修订，完全依照天文数据计算得来，为一天文历法（astronomical calendar）**

那天文历法是什么呢？

> 天文历法（astronomical calendar）是以天文观测为准的历法，例如使用定气定朔的现代农历、宗教性的伊斯兰历及第二圣殿时的古犹太历。这种历法也称为是以观测为准的的历法，好处是完美而且永远准确，缺点是没有一定的公式，若要回推多久以前某一天的日期比较困难。 

与之相对应的是计算历法(arithmetic calendar)：

> 计算历法（arithmetic calendar）是以严格的数学公式计算的历法，例如现在的犹太历，也称为是以规则为准的历法，好处是容易计算特定时间是哪一天，不过和自然变化的精准性就比较差，即使历法本身非常的精准，也会因为地球自转及公转的略为变化，造成其精准性慢慢变差，因此一个计算历法使用的期间有限，可能只有数千年，之后就要用新的历法系统代替。

实际上关于农历的编排，我们国家甚至还制定了国家标准：[农历的编算和颁行](http://www.gb688.cn/bzgk/gb/newGbInfo?hcno=E107EA4DE9725EDF819F33C60A44B296)，标准号 `GB/T 33661-2017`。标准里面专门提到了计算模型和精度的问题：

> 5.1　太阳和月球的位置按IERS Conventions规定的模型计算。
>
> 5.2　朔和节气的北京时间计算精度应达到1秒。

---

农历的编排本身就需要依赖外部的天文数据，而从公历向农历的转换自然也需要外部数据的支持。所以 Google 不能显示 2051-2-10 之后时间的原因也就出来了：Google 只存储了到 2050 年的农历数据，过了 2050 年农历的最后一天，后续的农历在转换的时候就报错了。

问题解决啦，我的好奇心得到了满足，可以安心睡觉了~

## 后记

当然比我更有好奇心的读者们肯定还会想到为什么是 `2050年 腊月 廿九`，难道不应该是腊月三十嘛？这个就留作课后作业吧，相信你们肯定能搞明白的~

下面是日常的挑毛病环节：

- To Google 的国际化团队：`农历腊月`不能翻译成`农历十二月`
- To 国家市场监督管理总局：9102 年了，国家标准在线预览还要依赖 Flash 插件，怕不是思想不正确哟

顺便介绍一下 [Type is Beautiful](https://thetype.com/) 的[孔雀计划](https://thetype.com/2019/02/12498/)，中文的排版问题和本文反映出来的农历问题其根源是一样的：中国的传统文化要主动向外介绍推广，主动参与标准的置顶，需要整个行业的通力合作。中文排版和农历这样充满了美感的东西理应让更多人了解，而不是被掩盖在女德这种真正糟粕的阴影之下。

## 参考资料

- [农历 - 维基百科](https://zh.wikipedia.org/wiki/%E8%BE%B2%E6%9B%86)
- [历法 - 维基百科](https://zh.wikipedia.org/wiki/%E5%8E%86%E6%B3%95)
- [农历的编算和颁行](http://www.gb688.cn/bzgk/gb/newGbInfo?hcno=E107EA4DE9725EDF819F33C60A44B296)
