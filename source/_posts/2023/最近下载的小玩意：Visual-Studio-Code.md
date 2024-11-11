---
title: '最近下载的小玩意：Visual Studio Code'
date: 2023-10-24 14:15:45
categories:
- 折腾
tags:
- 工具
---
<img width="100" alt="image" src="https://github.com/greendolphindance/greendolphindance.github.io/assets/87912044/4900959c-0d87-4978-a5c3-6d2e66b1ac5c">


平台：Windows、macOS、Linux

价格：¥0

下载地址：[官网](https://code.visualstudio.com)

---

终于，我还是用上了VS Code。这应该不算小玩意了吧……毕竟功能还挺多的。但是为了维持这个系列，还是叫它“小玩意”吧。

[上篇小玩意](https://greendolphindance.com/2023/10/17/最近下载的小玩意：Typewriter/)说没有用VS Code的理由是已经有了Sublime Text和XCode，不想再下一个写代码的应用，但是今天一想，我所有的东西都在VS Code里写不就行了吗？这样岂不是能够把工具更精简。于是配置好VS Code之后，就卸载了Typewriter、Sublime Text和Skim（用来搭配Sublime Text进行预览的）。XCode没删，因为莫名感觉之后还会用到（？）。

下面我分Markdown和LaTeX两方面来介绍VS Code的配置方法和使用体验。

# Markdown

## 配置

我参考的是[这个教程](https://zhuanlan.zhihu.com/p/56943330)。需要下载Markdown All in One和Markdown Preview Github Styling两个插件。下载好后，书写Markdown文档会有相应高亮，点击工作区右上角的这个图标：

<img width="19" alt="image" src="https://github.com/greendolphindance/greendolphindance.github.io/assets/87912044/a9272159-0c34-4151-8de4-4b08e9bf49fa">

可以显示预览。

## 和Typewriter对比
虽然[上篇小玩意](https://greendolphindance.com/2023/10/17/最近下载的小玩意：Typewriter/)里没写，但是我在使用过程中发现了Typewriter的一个最大缺点：工作区和预览的位置不同步。就是说，虽然预览区和工作区可以同步滚动，但是那个位置对应不是很精确，有时候工作区滚到的位置上的文字，在预览区甚至没有出现。所以我经常需要单独滚动预览区，以把位置对应好。VS Code在这一点上就做得好太多。

VS Code还有一个优势，就是预览的渲染速度非常快，甚至和Typora不相上下。后者是所见即所得，更需要快速的渲染，所以对于VS Code能做到Typora的速度，我是很惊奇的。就感觉好用心的一款产品啊……相比之下Typewriter就慢得多。

我在[上篇小玩意](https://greendolphindance.com/2023/10/17/最近下载的小玩意：Typewriter/)里介绍了Typewriter的一些缺点，接下来我会逐一列举VS Code在这些方面的表现。

首先，关于FrontMatter，VS Code显然不会出现任何错误，因为人家的预览里压根就不显示FrontMatter……其实我觉得还是显示了好一点，至少把标题写出来吧。

然后，关于Typewriter把代码里的注释显示成标题格式的bug。首先复习一下Typewriter里的显示：

<img width="1221" alt="image" src="https://github.com/greendolphindance/greendolphindance.github.io/assets/87912044/39bbcb60-06c2-42f1-a73f-e63cea15548c">

可以看到注释“# scripts loaded in the end of the body”在工作区里显示的格式和下方的标题“# 订阅”相同。

相反，VS Code仍然不会出现任何这样的问题，因为它的工作区压根就不会显示标题格式。它除了高亮以外啥也没有：

<img width="1310" alt="image" src="https://github.com/greendolphindance/greendolphindance.github.io/assets/87912044/38bd744b-f5b6-43cb-bf98-a9dab17839d8">

其实我觉得啥也没有挺好的，反正有高亮，而且格式啥的在预览区都会显示出来。不过这个见仁见智吧。

关于目录，首先似乎需要装一个叫Markdown Preview Enhanced的插件，然后预览区右上角会显示一个目录图标，点击就可以展开目录。虽然不能固定在边栏，不如Typewriter直观，但也还行。

# LaTeX

## 配置

参考的教程是[这个](https://zhuanlan.zhihu.com/p/166523064)。需要下载LaTeX Workshop这个插件。然后在JSON文件中加入配置代码。其中，我相较于教程做了一点修改，把自动编译改成了onSave。

## 和Sublime Text对比

一眼看去，二者最大的区别就是VS Code内置了预览功能，而Sublime Text的预览功能需要通过Skim等外部应用实现。这应该有利有弊，因为我看的教程里有教如果有需要的话，怎么从内部预览切换到外部预览。但看了一下，我大概用不到。

另一个区别在于目录。Sublime Text的目录是直接显示出来的，而VS Code要点击最左边那一栏的“TeX”图标才能看到目录，稍微麻烦一点，不过我可以忍。

此外，二者在语法检查上也有区别。在Sublime Text上，我使用了一个插件让我可以在内部使用Grammarly进行拼写检查。而在VS Code上，我根据[这个教程](https://zhuanlan.zhihu.com/p/139210056)下载并配置了LaTeX插件。

# 写代码
因为刚开始学前端，写代码的机会还不多，所以没法写出VS Code和其他编辑器（比如XCode）的对比。不过我上的网课是Angela Yu的，她是Mac电脑，但推荐使用的是VS Code而不是XCode，所以可能是有她的道理吧。