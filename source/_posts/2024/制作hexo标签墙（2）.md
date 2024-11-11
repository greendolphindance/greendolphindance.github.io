---
title: 制作hexo标签墙（2）
date: 2024-01-26 20:14:06
updated: 2024-02-08 19:15:17
categories:
- 折腾
tags:
- 博客
---

返璞归真了！不弄[这个链接](https://greendolphindance.com/2023/12/22/制作Hexo标签墙/)里制作的标签墙了，打算弄一个简单一点的，把各个标签排列起来，根据标签内文章数量的多少设置字体大小。

一开始在tags文件夹下的index.md修改，没反应，只好改在tag.ejs里修改。代码如下：

```html
<div class="tags-page">
    <% for (var tag of tagsArray) { %>
        <% var postCount=tag.length; %>
            <span style="font-size: <%= 12 + postCount * 2 %>px;">
                <a href="<%= url_for('/tags/' + tag.name + '/') %>">
                    <%= tag.name %>
                        <small>(<%= postCount %>)</small>
                </a>
            </span>
            <% } %>
</div>
```

# 修改

在欧元老师的建议下，取了个对数，缩小了不同标签的大小差。调试了数次，最终代码如下：

```html
<div class="tags-page">
    <% for (var tag of tagsArray) { %>
        <% var postCount=tag.length; %>
            <span style="font-size: <%= 12 + Math.log(postCount + 1) * 5 %>px;">
                <a href="<%= url_for('/tags/' + tag.name + '/') %>">
                    <%= tag.name %>
                        <small>(<%= postCount %>)</small>
                </a>
            </span>
            <% } %>
</div>
```