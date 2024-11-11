---
title: 制作hexo标签墙
date: 2023-12-22 14:17:39
updated: 2024-01-02 13:15:07
categories:
- 折腾
tags:
- 博客
---

# 背景
今天闲来无事，想起cyx曾经发给过我的一个人的博客的[标签墙](https://mantyke.icu/tags-wall)。她是用Hugo搭的博客，研究了一下代码，感觉Hugo有一个特定的插件可以实现这个，但是Hexo没有。于是准备手搓一个。

这一过程当然得到了ChatGPT的很多帮助，或者说Javascript代码基本上都是它写的（我才刚学到用Javascript算小学数学题……）。我只是修改了一些CSS样式等等。过程如下。

# 步骤

## 1. 准备数据

首先，我创建了source/_data目录，并在其下创建了一个tag_groups.yml文件，用来定义标签及其分类。

```
标签1: 分类A
标签2: 分类B
标签3: 分类C
……
```

## 2. 修改tag.ejs

在我的主题模板文件 tag.ejs 中，我添加了以下代码来展示标签，并为每个标签添加了一个数据属性来存储其分类。

```html
<div class="tag-cloud-tags">
    <% sortedTags.forEach(function(tag) { %>
        <% var tagName=tag.name; %>
            <% var tagGroup=tagGroups[tagName] ? tagGroups[tagName] : '未分类' ; %>
                <a class="tag" href="<%- url_for(tag.path) %>"
                    data-tag-group="<%- tagGroup %>">
                    <%- tagName %><small>(<%- tag.length %>)</small>
                </a>
                <% }); %>
</div>

<% } else { %>
    <p>未找到标签分组数据。</p>
    <% } %>

        <div id="tag-background"></div>
        <div id="tag-group-name"></div>
 ```

## 3. CSS样式

为了使标签墙看起来更美观，我添加了一些基本的 CSS 样式，并为夜间模式定义了不同的颜色。

```css
:root {
    --tag-border-color: #ddd;
    /* 标签文本颜色 */
}

body.dark-theme {
    --tag-border-color: #a9a9b3;
    /* 夜间模式下的边框颜色 */
}

.tag {
    display: inline-block;
    margin: 0 10px;
    padding: 5px 10px;
    border: 1px solid var(--tag-border-color);
    transition: opacity 0.3s;
}

.tag:hover {
    cursor: pointer;
    opacity: 1;
    /* 鼠标悬停时，标签不会减淡 */
}

.dimmed {
    opacity: 0.3;
    /* 减淡显示的样式 */
}

#tag-group-name {
    display: none;
    /* 默认不显示 */
    position: fixed;
    left: 50%;
    bottom: 10%;
    /* 或根据需要调整 */
    transform: translateX(-50%);
    font-size: 3em;
    /* 大字号，根据需要调整 */
    z-index: 9999;
    /* 确保它在页面内容之上 */
    color: var(--tag-border-color);
    /* 使用同样的颜色 */
    padding: 0.5em 1em;
    /* 内边距，根据需要调整 */
    border-radius: 10px;
    /* 圆角边框 */
    transition: opacity 0.3s, bottom 0.3s;
    /* 平滑过渡效果 */
    opacity: 0;
    pointer-events: none;
    /* 确保鼠标事件可以透过它传递 */
}

@media (prefers-color-scheme: dark),
.dark-theme {
    #tag-group-name {
        color: var(--tag-text-color);
        /* 夜间模式的文本颜色 */
    }
}
```

## 4. JavaScript交互

最后，我通过 JavaScript 添加了交互效果，当鼠标悬停在标签上时，显示标签的分类，并减淡其他分类的标签。

```html
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var tags = document.querySelectorAll('.tag-cloud-tags a');
        var groupNameDisplay = document.getElementById('tag-group-name');

        tags.forEach(function (tag) {
            tag.addEventListener('mouseover', function () {
                var group = this.getAttribute('data-tag-group');
                groupNameDisplay.textContent = group; // 设置分类名称文本
                groupNameDisplay.style.display = 'block'; // 显示分类名称
                groupNameDisplay.style.opacity = 1; // 使其可见
                groupNameDisplay.style.bottom = '20%'; // 提高位置使其更可见

                tags.forEach(function (otherTag) {
                    if (otherTag.getAttribute('data-tag-group') !== group) {
                        otherTag.classList.add('dimmed');
                    }
                });
            });

            tag.addEventListener('mouseout', function () {
                groupNameDisplay.style.opacity = 0; // 使其透明
                groupNameDisplay.style.bottom = '10%'; // 降低位置
                groupNameDisplay.style.display = 'none'; // 再次隐藏

                tags.forEach(function (otherTag) {
                    otherTag.classList.remove('dimmed');
                });
            });
        });
    });
</script>
```

## 5. 小修改：移动端的点击效果

如果仅做此前的修改，会导致在移动端时，点击标签直接跳转了子页面，没有显示标签墙的突出选中分类的效果。因此，我希望实现移动端点击一次时突出显示选中分类、点击两次时才跳转至子页面。添加如下Javascript代码：

```html
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var tags = document.querySelectorAll('.tag-cloud-tags a');
        var groupNameDisplay = document.getElementById('tag-group-name');

        function handleTagInteraction(currentTag, isMouseOver) {
            var group = currentTag.getAttribute('data-tag-group');
            groupNameDisplay.textContent = group;
            groupNameDisplay.style.display = isMouseOver ? 'block' : 'none';

            tags.forEach(function (tag) {
                if (isMouseOver && tag.getAttribute('data-tag-group') !== group) {
                    tag.classList.add('dimmed');
                } else {
                    tag.classList.remove('dimmed');
                }
            });
        }

        tags.forEach(function (tag) {
            // 鼠标悬停效果
            tag.addEventListener('mouseover', function () {
                handleTagInteraction(this, true);
            });

            tag.addEventListener('mouseout', function () {
                handleTagInteraction(this, false);
            });

            // 移动端点击效果
            tag.addEventListener('touchend', function (event) {
                // 阻止默认的链接跳转
                event.preventDefault();

                // 切换激活状态
                if (!this.classList.contains('active')) {
                    // 移除之前激活的标签的激活状态
                    document.querySelector('.tag-cloud-tags a.active')?.classList.remove('active');

                    // 激活当前标签并应用效果
                    this.classList.add('active');
                    handleTagInteraction(this, true);
                } else {
                    // 如果已经激活，则允许链接跳转
                    window.location.href = this.href;
                }
            });
        });
    });
</script>
```
即可。

## 不知道什么修改

由于（1）排序逻辑突然挂了，（2）移动端不显示分类大字，我在GPT的指导下修改了一些代码。作为备份，我把修改后tag.ejs的完整代码放在下面（有些缩进是乱的，我懒得改了）：

```html
<%# this page will judge whether current page is 'tag.' url:'http://localhost:4000/tag/' return false.
    url:'http://localhost:4000/tags/test/' return true. if you enter 'tag' page by click link will show all tags.
    otherwise if you enter 'tags' by click post header link will show the single tag of this post. how to add a tag
    page: 1. hexo new page "tag" 2. cd source/tag/index.md 3. add layout pattern like this: --- title: '''tag''' date:
    2019-06-09 09:56:49 layout: tag --- %>

    <% if(is_tag()){ %>
        <%- partial('_page/tag', {pagination: config.tag, index: true}) %>
            <% }else{ %>
                <div class="container">
                    <div class="post-wrap tags">
                        <h2 class="post-title">-&nbsp;标签&nbsp;-</h2>
                        <% if (site.data.tag_groups) { %>
                            <% var tagGroups=site.data.tag_groups; %>
                                <% var tagsArray=[]; site.tags.each(function(tag) { tagsArray.push({ name: tag.name,
                                    path: tag.path, length: tag.length }); }); var sortedTags=tagsArray.sort(function(a,
                                    b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); }); %>

                                    <div class="tag-cloud-tags">
                                        <% sortedTags.forEach(function(tag) { %>
                                            <% var tagName=tag.name; %>
                                                <% var tagGroup=tagGroups[tagName] ? tagGroups[tagName] : '未分类' ; %>
                                                    <a class="tag" href="<%- url_for(tag.path) %>"
                                                        data-tag-group="<%- tagGroup %>">
                                                        <%- tagName %><small>(<%- tag.length %>)</small>
                                                    </a>
                                                    <% }); %>
                                    </div>


                                    <% } else { %>
                                        <p>未找到标签分组数据。</p>
                                        <% } %>
                                            <div id="tag-background"></div>
                                            <div id="tag-group-name"></div>
                    </div>
                    <% } %>

<style>
    :root {
        --tag-border-color: #ddd;
        --tag-text-color: #ddd;
        /* 标签文本颜色 */
    }

    body.dark-theme {
        --tag-border-color: #a9a9b3;
        /* 夜间模式下的边框颜色 */
        --tag-text-color: #a9a9b3;
    }

    .tag {
        display: inline-block;
        margin: 0 10px;
        padding: 5px 10px;
        border: 1px solid var(--tag-border-color);
        transition: opacity 0.3s;
    }

    .tag:hover {
        cursor: pointer;
        opacity: 1;
        /* 鼠标悬停时，标签不会减淡 */
    }

    .dimmed {
        opacity: 0.3;
        /* 减淡显示的样式 */
    }

    #tag-group-name {
        display: none;
        /* 默认不显示 */
        position: fixed;
        left: 50%;
        bottom: 10%;
        /* 或根据需要调整 */
        transform: translateX(-50%);
        font-size: 3em;
        /* 大字号，根据需要调整 */
        z-index: 9999;
        /* 确保它在页面内容之上 */
        color: var(--tag-border-color);
        /* 使用同样的颜色 */
        padding: 0.5em 1em;
        /* 内边距，根据需要调整 */
        border-radius: 10px;
        /* 圆角边框 */
        transition: opacity 0.3s, bottom 0.3s;
        /* 平滑过渡效果 */
        opacity: 0;
        pointer-events: none;
        /* 确保鼠标事件可以透过它传递 */
    }

    @media (prefers-color-scheme: dark),
    .dark-theme {
        #tag-group-name {
            color: var(--tag-text-color);
            /* 夜间模式的文本颜色 */
        }
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        var tags = document.querySelectorAll('.tag-cloud-tags a');
        var groupNameDisplay = document.getElementById('tag-group-name');

        tags.forEach(function (tag) {
            tag.addEventListener('mouseover', function () {
                var group = this.getAttribute('data-tag-group');
                groupNameDisplay.textContent = group; // 设置分类名称文本
                groupNameDisplay.style.display = 'block'; // 显示分类名称
                groupNameDisplay.style.opacity = 1; // 使其可见
                groupNameDisplay.style.bottom = '20%'; // 提高位置使其更可见

                tags.forEach(function (otherTag) {
                    if (otherTag.getAttribute('data-tag-group') !== group) {
                        otherTag.classList.add('dimmed');
                    }
                });
            });

            tag.addEventListener('mouseout', function () {
                groupNameDisplay.style.opacity = 0; // 使其透明
                groupNameDisplay.style.bottom = '10%'; // 降低位置
                groupNameDisplay.style.display = 'none'; // 再次隐藏

                tags.forEach(function (otherTag) {
                    otherTag.classList.remove('dimmed');
                });
            });
        });
    });

</script>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        var tags = document.querySelectorAll('.tag-cloud-tags a');
        var groupNameDisplay = document.getElementById('tag-group-name');
        var currentlySelectedTag = null;

        function applyDimEffect(tagToHighlight) {
            var group = tagToHighlight.getAttribute('data-tag-group');
            groupNameDisplay.textContent = group;
            groupNameDisplay.style.display = 'block';

            tags.forEach(function (tag) {
                if (tag !== tagToHighlight && tag.getAttribute('data-tag-group') !== group) {
                    tag.classList.add('dimmed');
                }
            });
        }

        function clearDimEffect() {
            groupNameDisplay.style.display = 'none';
            tags.forEach(function (tag) {
                tag.classList.remove('dimmed');
            });
        }

        tags.forEach(function (tag) {
            // 鼠标悬停效果（桌面端）
            tag.addEventListener('mouseover', function () {
                applyDimEffect(this);
            });

            tag.addEventListener('mouseout', clearDimEffect);

            // 移动端点击效果
            tag.addEventListener('click', function (event) {
                if (currentlySelectedTag !== this) {
                    // 阻止默认行为并应用减淡效果
                    event.preventDefault();
                    clearDimEffect();
                    applyDimEffect(this);
                    currentlySelectedTag = this;
                } else {
                    // 允许默认行为，跳转链接
                    currentlySelectedTag = null;
                }
            });
        });

        // 在移动端，点击页面其他部分移除减淡效果
        document.addEventListener('click', function (event) {
            if (event.target.closest('.tag-cloud-tags a') === null) {
                clearDimEffect();
                currentlySelectedTag = null;
            }
        });
    });
</script>
```

# 结语
希望这篇文章能帮到有同样需求的人。但是本人不会写代码，只是把GPT给我写的代码原样抄上来，所以不对任何可能出现的bug负责，也不知道该怎么调试……如果按照我的步骤来，但出现了bug，就请自己加油吧！