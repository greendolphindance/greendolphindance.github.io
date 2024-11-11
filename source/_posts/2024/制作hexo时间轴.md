---
title: 制作hexo时间轴
date: 2024-02-16 22:15:31
updated: 2024-02-16 22:15:31
categories:
- 折腾
tags:
- 博客
---
在[wang7peng](https://github.com/wang7peng)老师的建议下添加了一个时间轴（我命名为“动态”）页面，效果[如下](https://greendolphindance.com/timeline/)，不知道和他想象中的效果是否相符。

我计划在这个时间轴里记录如下三部分内容：blog_post、personal_status和blog_renovation。第一项用于记录文章发布，第二项用于记录一些个人动态或者心情啥的（类似于朋友圈），第三项用来记录给博客搞装修的情况。由于也想记录第二项和第三项，所以数据只好手动输入了。

制作这个时间轴需要以下几个步骤：新建页面、准备数据、编写模板文件、设定样式。

# 新建页面

没什么好说的，就是新建一个名为“timeline”的页面，和添加其他自定义页面的方法一致。这边的教程以我的主题为例。首先在终端定位到博客目录下，运行：

```
hexo new page timeline
```

然后打开/source/timeline文件夹下的index.md文件，在FrontMatter里添加一行：

```
layout: timeline
```

layout后面的内容要与之后创建的模板文件的名称对应。

然后在主题文件夹下的_config.yml里，相应的地方（我这是“nav:”下方）添加：

```yaml
动态: /timeline
```

其中“动态”是我设定的页面名称。

# 准备数据

这一步的目的是建立一个文档，里面存放时间轴内需要显示的所有内容。ChatGPT提供的第一种方案是使用JSON格式的文件，但是我始终没有成功。明明把文件放在了/source/_data目录下，却一直没有被调用。搞来搞去GPT说，可以用一个js文件存储数据，但我仍然失败，原因不明。最后，我想起[制作hexo标签墙](https://greendolphindance.com/2023/12/22/制作Hexo标签墙/)时，存储数据用的是一个yml文件，于是调教了一番GPT，最终成功。

在/source/_data中创建timeline.yml文档，并输入需要显示的数据：

```yaml
timeline:
  - date: "2024-02-16"
    type: blog_post
    description: "发布了《制作hexo时间轴》"
    link: "https://greendolphindance.com/2024/02/16/制作hexo时间轴/"
  - date: "2024-02-16"
    type: blog_renovation
    description: 添加了“动态（timeline）”页面
  - date: "2024-02-15"
    type: personal_status
    description: 过完年从老家回来了，好累啊！
```

其中，我在ejs模板文件中给blog_post类型添加了description和link字段（下详），以便读者点击文本内容跳转到相应文章。blog_renovation和personal_status则只有description字段。

以后有新内容时，在最上方添加即可。

# 编写模板文件

在/themes/Chic/layout下新建timeline.ejs文档（再次强调，这里的文件名需要与index.md中layout后面的内容相同）。这里有个坑，就是我这个主题，/layout下面还有个/page目录，我一开始把文档新建在这个目录下了，结果没办法调用。

timeline.ejs文档内容如下，还挺直观的，就不过多解释了：

```html
<!DOCTYPE html>
<html>

<head>
    <title>
        <%= page.title %>
    </title>
</head>

<body>
    <div class="container">
        <div class="post-wrap">
            <h2 class="post-title">
                <%= page.title %>
            </h2>
            <div class="timeline">
                <% const timelineData=getYaml('source/_data/timeline.yml'); %>
                    <% if (timelineData.timeline && timelineData.timeline.length> 0) { %>
                        <% timelineData.timeline.forEach(function(item) { %>
                            <div class="timeline-item">
                                <div class="timeline-date">
                                    <%= item.date %>
                                </div>
                                <div class="timeline-content">
                                    <% if (item.type==='blog_post' ) { %>
                                        <% if (item.link) { %>
                                            <p>
                                                <a href="<%= item.link %>">
                                                    <%= item.description %>
                                                </a>
                                            </p>
                                            <% } else { %>
                                                <p>
                                                    <%= item.description %>
                                                </p>
                                                <% } %>
                                                    <% } else if (item.type==='personal_status' ) { %>
                                                        <p>
                                                            <%= item.description %>
                                                        </p>
                                                        <% } else if (item.type==='blog_renovation' ) { %>
                                                            <p>
                                                                <%= item.description %>
                                                            </p>
                                                            <% } %>
                                </div>
                            </div>
                            <% }); %>
                                <% } else { %>
                                    <p>暂无内容</p>
                                    <% } %>
            </div>
        </div>
    </div>
</body>

</html>
```

# 设定样式

最后一步就是设定时间轴的样式。我希望文字内容的左边有一条竖线，竖线上面有一些圆点，分别与不同的文字项目对齐。这条线和这些点为我博客的主题色，即#2b96bd色。我还做了一些比如调整行间距（line-height）的设置，GPT也做了一些贡献。完整代码如下：

```css
.timeline {
    margin: 0 auto;
    padding: 20px;
    position: relative; /* 使得伪元素定位相对于 .timeline 的位置 */
}

.timeline:before {
    content: ''; /* 添加一个伪元素用于绘制时间线 */
    position: absolute; /* 使得伪元素相对于 .timeline 定位 */
    top: 0; /* 从顶部开始 */
    bottom: 0; /* 撑满整个 .timeline */
    left: 10px; /* 使得线条与 .timeline-item 的左边距一致 */
    width: 2px; /* 线条宽度 */
    background-color: #2a96bd; /* 线条颜色 */
}

.timeline-item {
    position: relative; /* 使得 .timeline-content 相对于 .timeline-item 定位 */
    border-left: 2px solid transparent; /* 透明的左边框用于绘制线条 */
    padding-left: 20px; /* 增加左边距，使得标题不会和线条重合 */
    margin-bottom: 40px; /* 放大两个不同项之间的间距 */
}

.timeline-item:before {
    content: ''; /* 添加一个伪元素用于绘制蓝色点 */
    position: absolute; /* 使得伪元素相对于 .timeline-item 定位 */
    top: 10px; /* 距离 .timeline-item 顶部位置 */
    left: -16px; /* 将蓝色点定位到线条的左边缘 */
    width: 10px; /* 点的宽度 */
    height: 10px; /* 点的高度 */
    background-color: #2a96bd; /* 点的颜色 */
    border-radius: 50%; /* 将点设置为圆形 */
}

.timeline-date {
    font-weight: bold;
    margin-bottom: 5px;
    line-height: 1em;
}

.timeline-content {
    margin-left: 10px;
    font-size: 14px; /* 设置描述字体大小 */
    line-height: 1.5em;
}
```

什么伪元素之类的，我还没学过，看不懂啥意思，先就这样吧！