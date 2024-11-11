---
title: 最近下载的小玩意：Raycast
date: 2024-02-09 11:11:24
updated: 2024-02-09 11:11:24
categories:
- 折腾
tags:
- 工具
---

关于启动器，我很久以前用过Alfred，因为有点丑，又换回了原生Spotlight，一直用到昨天。那么为什么昨天突然又想折腾第三方启动器了呢？其实是机缘巧合。男朋友买了新电脑，我凭借着过去的经验让他装个Wox（另一个第三方启动器），然后突然想起一些Wox有的功能Spotlight没有，而我又确实需要，比如在搜索框输入“ddg+空格”就可以直接在Duckduckgo上搜索东西等。结果，就因为这么简单的理由，我就下载了Raycast。

下载之前在Raycast和HapiGo之间犹豫了一小会，最后想着先下Raycast试一下，不好用的话再换HapiGo。但是事后发现Raycast就够好用了。对HapiGo感到抱歉！

# 开始使用

下载Raycast后，立刻试了一试，结果发现这什么啊？只能搜APP，文件搜不了。然后仔细研读教程，才发现搜索文件是底下的一个二级（？）搜索，需要输入“Search Files”并点击回车才能进入继续搜索文件。

<img width="600" alt="search files" src="https://greendolphindance.github.io/picx-images-hosting/image.5j9pkjv1eiv4.webp">

那也太麻烦了吧！仔细研究了一下设置，发现可以设置别名，也可以设置快捷键。于是把别名设成了“f”：

<img width="600" alt="search files别名" src="https://greendolphindance.github.io/picx-images-hosting/image.5z7k3u90hts0.webp">

这下方便多了。其实也想设个快捷键，但是我很不擅长记快捷键，尤其是那几个功能键该按哪个。我每次想强制退出应用（option+cmd+esc），都要排列组合数次……所以还是单记一个“f”要好些。但我之后为窗口管理和剪贴板历史设置了快捷键，因为我之前所用的应用已经让我形成了肌肉记忆（下详）。

# 快速链接

也就是快速搜索Duckduckgo等网站的功能。默认是有Duckduckgo和Google，我又加了一个Bing，免得哪天梯子挂了。

<img width="600" alt="快速链接" src="https://greendolphindance.github.io/picx-images-hosting/image.5rm80aaynxmo.webp">

难受的是，我好像没找到在哪里更换图标，所以搜索Bing的时候搜索栏里会出现图上的搜索图标，而不是Bing的Logo。但这只是个小问题。

# 替代其他的应用

Raycast还集成了很多其他APP的功能，比如窗口管理（Magnet、Rectangle）和剪贴板历史（Maccy等）。我都尝试一遍后，就把多余的APP都删除了。

## 替代Rectangle

窗口管理软件，我之前用的是开源的Rectangle。结果Raycast自带一个这个功能，还能直接一键导入Rectangle的快捷键……那我为什么不用呢。

<img width="600" alt="Raycast导入Rectangle快捷键" src="https://greendolphindance.github.io/picx-images-hosting/image.6332yaduqz5s.webp">

除此之外，Magnet和Spectacle的快捷键也可以直接导入。

我感觉Raycast用起来比Rectangle稍慢一丢丢，但差异并不明显。本着APP越少越好的原则，我就删除了后者。

## 替代Maccy

以前推荐过[Maccy](https://greendolphindance.com/2023/11/16/最近下载的小玩意：Input-Source-Pro、Maccy/#Maccy)，是我发现的Mac上功能精简且比较好看的剪贴板应用。当然我现在仍然推荐，只是用不到了，因为Raycast也有相同的功能。

我把快捷键设置成了shift+cmd+c，和之前Maccy的快捷键保持一致，这样体验比较连续。Raycast的剪贴版历史不仅可以识别文字、图片、链接等，甚至还可以识别颜色的HEX值。值对应的颜色会直接在剪贴板历史界面中显示出来，而且还支持以不同的颜色格式复制：

<img width="600" alt="复制不同格式的颜色" src="https://greendolphindance.github.io/picx-images-hosting/image.43gb5fcsnekg.webp">

好恨自己为什么没有早发现这个APP！之前折腾博客的时候，博客上有好几种灰色，我记下了一个的代码又忘记另一个，只能每次点检查元素然后在CSS样式里翻找，很狼狈。

## 替代Spotlight

这似乎是废话了。但是一进这个APP，它就有替换Spotlight的教程（其实就是把Spotlight的快捷键关掉，再把Raycast的快捷键设成cmd+空格），足以体现该APP的野心。

# 插件商店

Raycast强大的一点就是用户可以自行编写插件。当然我啥也不会，我就用用别人写的。我试用了商店里的很多插件，并决定留下这几款：

- Apple Mail：顾名思义，管理Mac上邮件应用的插件，内含多项功能。我为常用的“Check For New Mail”和“Mark All As Read”功能设置了别名。
- Apple Notes：同样顾名思义。可以快速新建或搜索备忘录。
- Apple Reminders：顾名思义。功能与Apple Notes类似。
- Color Picker：取色插件。
- Count：字数统计。
- Download Video：下载YouTube视频。
- Downloads Manager：管理下载内容。我为“Open Latest Download”和“Show Latest Download”设置了别名。
- Kill Process：顾名思义。
- Lorem Ipsum：Lorem Ipsum生成器。
- Paste as Plain Text：顾名思义。我设置快捷键为shift+cmd+v，和呼出剪贴版历史的快捷键对应，这样也不算太难记。
- QR Code Generator：顾名思义。
- Quit Applications：顾名思义。
- Random Data Generator：生成随机数据，选择很多，不仅有常用的数字、浮点数、日期、字符串等，还有很多其他的，甚至包括随机生成一个猫或狗的品种等等……谁会用到？
- Remove Background From Image：抠图插件，需要[remove.bg](https://www.remove.bg/zh)的API。
- Safari：管理Safari的插件，我用得比较多的是搜索收藏夹。
- Show IP Address：顾名思义。
- Speedtest：测网速的。
- System Monitor：显示CPU、内存、电池和网络情况。
- URL Shortener：顾名思义。

# 无法替代的应用

## Shorttr

虽然Raycast插件商店里有截图插件，但现有的Raycast截图插件无法进行长截图（Scrolling Capture）。

## Bob
Raycast需要订阅（每月$8）才能使用翻译功能，我没有试过，50块买断的Bob比它性价比实在高太多了。

# PRO
我个人是觉得没必要开会员。会员功能就只有无限剪贴板历史（谁会用到？）、AI（用GPT4甚至还要再加$8每月）、翻译（Bob足够好使）和云同步（并没有多台Mac），好像都没有必要。

要我是开发者，我就把插件商店划到会员功能里面，我不赚钱谁赚钱（不是）。开发者还是比我有良心多了！