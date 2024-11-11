---
title: Category页面过长博文名省略
date: 2024-05-15 21:41:31
updated: 2024-05-15 21:41:31
categories:
- 折腾
tags:
- 博客
---

在[《博客搭建小记》](http://greendolphindance.com/2023/10/07/博客搭建小记/)中，我曾记录过参考[这个教程](https://myoontyee.github.io/article/9ff0cec8.html)实现Category页面过长博文名省略的过程。但是今天发现了问题：在单个Category的子页面中，省略效果是正常的；但在所有Category的父页面中，过长的博文名没有省略。我原来的代码如下：

```html
<style>
    li {
        height: 24.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media screen and (max-width: 767px) {
        li {
            width: 240px;
        }
    }

    @media screen and (min-width: 768px) {
        li {
            width: 60vw;
        }
    }
</style>
```

问题很明显。由于桌面端父页面中，文章列表是分为两列的，所以这时的li的宽度就会超过60vw。这样一来，博文名就不能省略。

于是修改代码。

# /layout/_page/category.ejs

这部分控制的是子页面的显示，所以是无需修改的。但相对于教程，我还是将width修改为80vw，以适应不同设备的屏幕大小：

```html
<style>
    li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80vw;
        /* 设置宽度为视口宽度的80% */
    }
</style>
```

# /layout/category.ejs

这部分我的修改如下：

## 1. 给li起一个类名

我起的名字是item-title。虽然很简单但还是放一下代码：

```html
<li class="item-title"><%- post_item.title %></li>
```

## 2. 设置item-title的默认样式

默认样式指的是宽度超过992px时的样式，宽度更小时的样式之后会分别设置。代码：

```css
 .item-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 270px;
}
```

## 3. 分别设置不同宽度范围下的item-title宽度

我分了两种情况，代码如下：

```css
@media (max-width: 992px) {
    .item-title {
        width: 250px;
    }
}

@media (max-width: 768px) {
    .item-title {
        width: 230px;
    }
}
```

完整的CSS代码如下：

```html
<style>
    .item-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 270px;
    }

    @media (max-width: 992px) {
        .item-title {
            width: 250px;
        }
    }

    @media (max-width: 768px) {
        .item-title {
            width: 230px;
        }
    }
</style>
```

# 碎碎念

虽然这个解决方法看似很简单，但其中包含着我无数的错误尝试。一开始的思路是想要设定li的宽度为card-item宽度的80%，但是由于不能越级上访（？），只能将其设置为其直接父元素宽度的80%，这样就不对，每个标题都被省略，变得很短。

然后GPT让我用javascript来弄这个宽度，但我调试了很久也不行，不知道是哪里出了问题。

最后只好用蠢办法，在不同的情况下设定不同的绝对宽度。