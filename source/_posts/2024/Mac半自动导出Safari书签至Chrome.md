---
title: Mac半自动导出Safari书签至Chrome
date: 2024-02-19 00:50:13
updated: 2024-02-19 00:50:13
categories:
- 折腾
tags:
- 工具
---

# 缘由

我在Mac中使用两个浏览器，Safari和Chrome。日常用Safari，需要使用网页检查器的时候用Chrome。但是有时候Safari不是很好使（比如看Angela Yu的网课的时候，总是卡死），就会换到Chrome。所以我对浏览器间的书签和密码同步有一定需求。经过搜索，我发现密码同步可以用一个叫“iCloud密码”的Chrome插件。但是书签同步并没有很好的方案。有一些第三方软件似乎可以做到，但是很多人说同步之后造成了书签大混乱，我就不太敢用。

找来找去发现了[这个帖子](https://blog.csdn.net/lluuaanngg/article/details/136088824)。ta的脚本挺不错的，但是需要手动操作两步：保存Safari书签时点一下保存、导入到Chrome时选择文件并导入。有点麻烦。我就想能不能再自动一点。经过我的试验，后一步是无法自动的，所以决定着手优化前一步。

# 导出Safari书签

我希望将书签的html文件保存到默认目录，也就是“下载”文件夹。所以保存时并不需要修改文件路径。因此，这个事情的步骤大概是：打开Safari，点击文件-导出-书签，点击保存按钮。具体代码如下：

```
-- 启动Safari
tell application "Safari"
	activate
	--delay 2 -- 等待Safari启动，如果老电脑老版本启动过慢导致来不及自动化，请取消注释并调整延迟时间，下面chrome同理
end tell

-- 使用System Events模拟点击菜单项导出书签
tell application "System Events"
	tell process "Safari"
		click menu item "书签…" of menu "导出" of menu item "导出" of menu "文件" of menu bar item "文件" of menu bar 1
		delay 1
		
		-- 模拟按下回车键，执行保存操作
		keystroke return
	end tell
end tell

-- 等待保存书签文件
delay 3 -- 可以根据需要调整等待时间
```

# 删除书签文件

然后就是导入Chrome了，前面已经说了，这部分没法自动化。再然后，我想要删除生成的html文件，于是又加了一步：

```
-- 弹出对话框，询问是否删除文件
set userChoice to button returned of (display dialog "是否删除已保存的书签文件？" buttons {"取消", "删除"} default button "删除" with icon caution)

-- 根据用户选择来删除文件
if userChoice is "删除" then
	do shell script "rm -f /Users/{我的用户名}/Downloads/Safari浏览器书签.html"
end if
```

这个脚本的完整内容如下：

```
-- MacBook Pro 16-inch, 2019
-- macOS Sonoma 14.2.1 (23C71)
-- V1.0 魔改版
-- 2024年2月19日
-- 启动Safari
tell application "Safari"
	activate
	--delay 2 -- 等待Safari启动，如果老电脑老版本启动过慢导致来不及自动化，请取消注释并调整延迟时间，下面chrome同理
end tell

-- 使用System Events模拟点击菜单项导出书签
tell application "System Events"
	tell process "Safari"
		click menu item "书签…" of menu "导出" of menu item "导出" of menu "文件" of menu bar item "文件" of menu bar 1
		delay 1
		
		-- 模拟按下回车键，执行保存操作
		keystroke return
	end tell
end tell

-- 等待保存书签文件
delay 3 -- 可以根据需要调整等待时间

-- 启动Chrome
tell application "Google Chrome"
	activate
end tell

-- 使用System Events模拟点击菜单项导入书签
tell application "System Events"
	tell process "Google Chrome"
		click menu item "导入书签和设置…" of menu 1 of menu bar item "Chrome" of menu bar 1
		delay 2 -- 等待导入对话框出现
		-- 用户可能需要手动完成导入过程，因为AppleScript不能直接操作导入对话框
	end tell
end tell

-- 弹出对话框，询问是否删除文件
set userChoice to button returned of (display dialog "是否删除已保存的书签文件？" buttons {"取消", "删除"} default button "删除" with icon caution)

-- 根据用户选择来删除文件
if userChoice is "删除" then
	do shell script "rm -f /Users/chumiaochen/Downloads/Safari浏览器书签.html"
end if
```

# 添加快捷键

每次都要点开脚本文件执行，太麻烦了。所以设置了一个快捷键。方法是创建一个快捷指令，把脚本粘贴进去，然后在快捷指令的右边栏点击“添加键盘快捷键“，再按下你需要的快捷键即可。我设置的是Option+Command+S。

其实我更希望弄一个类似于iPhone上“自动化”一样的东西，让它每周执行一次，但是我在Mac上没有找到自动化。

# 缺点

这个办法是没办法的办法，每次需要手动执行（虽然有快捷键），导入也需要手动操作。很烦！