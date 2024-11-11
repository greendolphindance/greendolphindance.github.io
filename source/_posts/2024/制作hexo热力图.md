---
title: 制作hexo热力图
date: 2024-01-22 21:21:33
updated: 2024-07-17 22:01:21
categories:
- 折腾
tags:
- 博客
---
又是cyx！告诉了我[有个人的博客](https://blog.douchi.space/hugo-blog-heatmap/#gsc.tab=0)做了热力图。我一开始没想做，因为我博文更新没那么勤，热力图做出来恐怕不会好看。但是到了晚上，我的折腾之心开始蠢蠢欲动！于是喊GPT帮我做。当天晚上debug到凌晨四点，还是没能做出来。今天跟cyx喝了个咖啡，回来继续捣鼓，居然成了！

# 完整代码
话不多说，放一下我的完整代码，这是在profile.ejs文件里的，因为我想把热力图放在主页的标题上方。

```html
<div class="container profile-container">
    <div class="intro">
        <div class="avatar">
            <a href="<%- url_for(theme.nav.Posts) %>"><img src="<%- url_for(theme.avatar) %>"></a>
        </div>
        <div id="heatmap-container"></div>

        <script src="https://d3js.org/d3.v5.min.js"></script>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                function getDateBefore(days) {
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - days);
                    var year = currentDate.getFullYear();
                    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    var day = String(currentDate.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            <%
                    function convertWordCount(wordCountString) {
                        if (!wordCountString) {
                            return 0;
                        }

                        // Convert to string and check if the word count string contains 'k'
                        var lowerCaseString = String(wordCountString).toLowerCase();

                        if (lowerCaseString.includes('k')) {
                            return parseFloat(lowerCaseString) * 1000;
                        } else {
                            return parseFloat(lowerCaseString);
                        }
                    }
                    %>

var data = [
    <% site.posts.each(function (post) { %>
                        {
                            date: "<%= post.date.format('YYYY-MM-DD') %>",
                            word_count: <%= convertWordCount(getWordCount(post.content)) %>,
                    link: "<%= url_for(post.path) %>"
        },
    <% }); %>
];


            var margin = { top: 20, right: 20, bottom: 20, left: 20 };
            var containerWidth = 600;
            var cellSize = Math.min((containerWidth - margin.left - margin.right) / 45, (containerWidth - margin.top - margin.bottom) / 8);
            var width = cellSize * 45;
            var height = cellSize * 8;

            var svg = d3
                .select("#heatmap-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleBand().range([width, 0]).padding(0.1);
            var yScale = d3.scaleBand().range([height, 0]).padding(0.1);

            var exponent = 0.3; // Adjust the exponent as needed
            var colorScale = d3.scaleSequential(d3.interpolate("lightblue", "#2d96bd"))
                .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

            xScale.domain(d3.range(45));
            yScale.domain(d3.range(8));

            // 在渲染每个格子时设置渐变色的值
            var cells = svg.selectAll(".cell")
                .data(d3.cross(d3.range(8), d3.range(45)))
                .enter().append("a")
                .attr("href", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.link : "#"; // 设置链接，如果没有链接就是 "#"，即当前页面
                })
                .append("rect")
                .attr("class", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return "cell" + (correspondingData && correspondingData.word_count > 0 ? " blue" : "");
                })


                .attr("x", function (d) { return xScale(d[1]); })
                .attr("y", function (d) { return yScale(d[0]); })
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? colorScale(Math.pow(correspondingData.word_count, exponent)) : "#ccc";
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("data-word_count", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.word_count : null;
                })
                .on("click", function (event, d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    if (correspondingData && correspondingData.link) {
                        window.location.href = correspondingData.link;
                    }
                });


            function updateCellStyles() {
                var isDarkTheme = document.body.classList.contains("dark-theme");
                cells.style("stroke", isDarkTheme ? "#292a2d" : "#fff")
                    .style("stroke-width", "1px");
            }

            updateCellStyles();

            document.body.addEventListener("themechange", function () {
                updateCellStyles();
            });
        });
        </script>

        <style>
            @media (max-width: 767px) {
                #heatmap-container {
                    display: none;
                }
            }

            /* 在桌面端时隐藏 .avatar */
            @media (min-width: 768px) {
                .avatar {
                    display: none;
                }
            }

            .cell {
                stroke: #fff !important;
                stroke-width: 1px;
                fill: #ccc;
                cursor: default;
                /* 添加这一行 */
            }

            .dark-theme .cell {
                stroke: #292a2d !important;
                stroke-width: 1px;
                fill: #a9a9b3;
                cursor: default;
                /* 添加这一行 */
            }

            .blue {
                cursor: pointer;
            }

            .dark-theme .blue {
                cursor: pointer;
            }
        </style>


        <div class="nickname"><%- theme.nickname %></div>
        <div class="description"><%- markdown(theme.description) %></div>
        <div class="links">
            <% if (theme.links !==undefined) { %>
                <% for (var key in theme.links){ %>
                    <a class="link-item" title="<%- key %>" href="<%= theme.links[key] %>">
                        <% if(theme.links_text_enable) { %>
                            <%= key %>
                                <% } %>
                                    <% if(theme.links_icon_enable){ %>
                                        <i class="iconfont icon-<%- key.toLowerCase() %>"></i>
                                        <% } %>
                    </a>
                    <% } %>
                        <% } %>
        </div>
    </div>
</div>
```

# 思路

那个博主用的是echart库，我捣鼓了半天也未能成功，于是改用GPT推荐的D3库。然后我不想添加热力图标题、月份和星期等等文字内容，以适应我博客的极简风格，所以就没有加入这些东西，只设置了8*45=360个格子，展示我约一年来发博的情况。没有文章的时候为灰色，有文章的时候根据文章的字数显示为渐变的蓝色，最深为#2d96bd色，最浅为lightblue色。

此外，由于手机上显示的状况不佳，我希望在屏幕宽度为768像素以下时，不显示热力图，而显示我的照片：

```css
@media (max-width: 767px) {
    #heatmap-container {
        display: none;
    }
}

/* 在桌面端时隐藏 .avatar */
@media (min-width: 768px) {
    .avatar {
        display: none;
    }
}
```

关于数据的抓取，我是用如下代码实现的：

```javascript
var data = [
    <% page.posts.each(function (post) { %>
        {
            date: "<%= post.date.format('YYYY-MM-DD') %>",
            word_count: <%= convertWordCount(getWordCount(post.content)) %>,
            link: "<%= url_for(post.path) %>"
        },
    <% }); %>
];
```

其中，getWordCount函数是hexo-wordcount插件里带的，如果想复刻我的代码，需要先安装这个插件。

其实一开始就想能够自动抓取了，但是一直不成功，于是改成了手动输入。但是又太麻烦，就又开始捣鼓自动抓取的事情。但无论怎么弄都成功不了，GPT也找不出问题。于是求助我男朋友。他发现了两个错误：（1）我抓取的字数格式是形如2.8k的，而需要的数据是形如2800的。（2）我在代码的有些地方用了words，在另一些地方用了word_count（估计是我开了很多新窗口让GPT给了我很多次代码，然后搞混了）。改正这两个错误后，热力图就正常显示了。（在此感谢！）

还有一些细节：设置了点击跳转的逻辑后，我发现鼠标放在灰色的格子上时，也会变成手指的样式。我希望它在且仅在蓝色的格子上时才变成手指。代码里有一些是做这个事情的:

```css
.blue {
    cursor: pointer;
}

.dark-theme .blue {
    cursor: pointer;
}
```
我部署上去后，在夜间模式是没效果的，所以加了后一段。但是我感觉按道理应该没必要加的？

以下这段代码是用来设置格子边框的样式的：

```css
.cell {
    stroke: #fff !important;
    stroke-width: 1px;
    fill: #ccc;
    cursor: default;
    /* 添加这一行 */
}

.dark-theme .cell {
    stroke: #292a2d !important;
    stroke-width: 1px;
    fill: #a9a9b3;
    cursor: default;
    /* 添加这一行 */
}
```

因为在夜间模式的时候，格子边框起初也是白色，看起来很丑。这个也弄了很久，要么就是日间模式和夜间模式的框全变白，要么就全变黑。最后不记得是怎么解决的了。

热力图做好后，发现由于一篇文章的字数太多，其他文章的蓝色就变得很浅，而且只有微妙的区别。于是叫GPT修改代码：

```javascript
document.addEventListener("DOMContentLoaded", function () {
    // ... (previous code)

    var exponent = 0.3; // Adjust the exponent as needed
    var colorScale = d3.scaleSequential(d3.interpolate("lightblue", "#2d96bd"))
        .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

    // ... (remaining code)

    var cells = svg.selectAll(".cell")
        .data(d3.cross(d3.range(8), d3.range(45)))
        .enter().append("a")
        // ... (remaining code)
        .style("fill", function (d) {
            var currentDate = getDateBefore(d[0] * 45 + d[1]);
            var correspondingData = data.find(entry => entry.date === currentDate);
            return correspondingData ? colorScale(Math.pow(correspondingData.word_count, exponent)) : "#ccc";
        })
        // ... (remaining code)
});
```

我也看不懂，反正能跑。

至于D3相关代码，我是一点也不懂，就不妄加评论了。

就这样吧，想到什么再写！

# 微调（2024-1-27）
稍微调整了一下，把exponent改成了0.6，把lightblue改成了#add8e6。修改后的完整代码如下：

```html
<div class="container profile-container">
    <div class="intro">
        <div class="avatar">
            <a href="<%- url_for(theme.nav.Posts) %>"><img src="<%- url_for(theme.avatar) %>"></a>
        </div>
        <div id="heatmap-container"></div>

        <script src="https://d3js.org/d3.v5.min.js"></script>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                function getDateBefore(days) {
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - days);
                    var year = currentDate.getFullYear();
                    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    var day = String(currentDate.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            <%
                    function convertWordCount(wordCountString) {
                        if (!wordCountString) {
                            return 0;
                        }

                        // Convert to string and check if the word count string contains 'k'
                        var lowerCaseString = String(wordCountString).toLowerCase();

                        if (lowerCaseString.includes('k')) {
                            return parseFloat(lowerCaseString) * 1000;
                        } else {
                            return parseFloat(lowerCaseString);
                        }
                    }
                    %>

var data = [
    <% site.posts.each(function (post) { %>
                        {
                            date: "<%= post.date.format('YYYY-MM-DD') %>",
                            word_count: <%= convertWordCount(getWordCount(post.content)) %>,
                    link: "<%= url_for(post.path) %>"
        },
    <% }); %>
];


            var margin = { top: 20, right: 20, bottom: 20, left: 20 };
            var containerWidth = 600;
            var cellSize = Math.min((containerWidth - margin.left - margin.right) / 45, (containerWidth - margin.top - margin.bottom) / 8);
            var width = cellSize * 45;
            var height = cellSize * 8;

            var svg = d3
                .select("#heatmap-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleBand().range([width, 0]).padding(0.1);
            var yScale = d3.scaleBand().range([height, 0]).padding(0.1);

            var exponent = 0.6; // Adjust the exponent as needed
            var colorScale = d3.scaleSequential(d3.interpolate("#add8e6", "#2d96bd"))
                .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

            xScale.domain(d3.range(45));
            yScale.domain(d3.range(8));

            // 在渲染每个格子时设置渐变色的值
            var cells = svg.selectAll(".cell")
                .data(d3.cross(d3.range(8), d3.range(45)))
                .enter().append("a")
                .attr("href", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.link : "#"; // 设置链接，如果没有链接就是 "#"，即当前页面
                })
                .append("rect")
                .attr("class", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return "cell" + (correspondingData && correspondingData.word_count > 0 ? " blue" : "");
                })


                .attr("x", function (d) { return xScale(d[1]); })
                .attr("y", function (d) { return yScale(d[0]); })
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? colorScale(Math.pow(correspondingData.word_count, exponent)) : "#ccc";
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("data-word_count", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.word_count : null;
                })
                .on("click", function (event, d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    if (correspondingData && correspondingData.link) {
                        window.location.href = correspondingData.link;
                    }
                });


            function updateCellStyles() {
                var isDarkTheme = document.body.classList.contains("dark-theme");
                cells.style("stroke", isDarkTheme ? "#292a2d" : "#fff")
                    .style("stroke-width", "1px");
            }

            updateCellStyles();

            document.body.addEventListener("themechange", function () {
                updateCellStyles();
            });
        });
        </script>

        <style>
            @media (max-width: 767px) {
                #heatmap-container {
                    display: none;
                }
            }

            /* 在桌面端时隐藏 .avatar */
            @media (min-width: 768px) {
                .avatar {
                    display: none;
                }
            }

            .cell {
                stroke: #fff !important;
                stroke-width: 1px;
                fill: #ccc;
                cursor: default;
                /* 添加这一行 */
            }

            .dark-theme .cell {
                stroke: #292a2d !important;
                stroke-width: 1px;
                fill: #a9a9b3;
                cursor: default;
                /* 添加这一行 */
            }

            .blue {
                cursor: pointer;
            }

            .dark-theme .blue {
                cursor: pointer;
            }
        </style>


        <div class="nickname"><%- theme.nickname %></div>
        <div class="description"><%- markdown(theme.description) %></div>
        <div class="links">
            <% if (theme.links !==undefined) { %>
                <% for (var key in theme.links){ %>
                    <a class="link-item" title="<%- key %>" href="<%= theme.links[key] %>">
                        <% if(theme.links_text_enable) { %>
                            <%= key %>
                                <% } %>
                                    <% if(theme.links_icon_enable){ %>
                                        <i class="iconfont icon-<%- key.toLowerCase() %>"></i>
                                        <% } %>
                    </a>
                    <% } %>
                        <% } %>
        </div>
    </div>
</div>
```

# 鼠标悬停在格子上时，显示文章标题和日期

因为原有的显示模式太不直观了，不知道哪个格子代表哪一天，又不想做成表格的形式，于是出此下策。效果如图：

<img width="600" alt="效果图" src="https://github.com/greendolphindance/greendolphindance.github.io/assets/87912044/c5df99b3-5e79-4ce8-adb3-46a25d672065">

修改后的代码如下：

```html
<div class="container profile-container">
    <div class="intro">
        <div class="avatar">
            <a href="<%- url_for(theme.nav.Posts) %>"><img src="<%- url_for(theme.avatar) %>"></a>
        </div>
        <div id="heatmap-container">
            <div id="tooltip"></div>
        </div>


        <script src="https://d3js.org/d3.v5.min.js"></script>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                function getDateBefore(days) {
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - days);
                    var year = currentDate.getFullYear();
                    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    var day = String(currentDate.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            <%
                    function convertWordCount(wordCountString) {
                        if (!wordCountString) {
                            return 0;
                        }

                        // Convert to string and check if the word count string contains 'k'
                        var lowerCaseString = String(wordCountString).toLowerCase();

                        if (lowerCaseString.includes('k')) {
                            return parseFloat(lowerCaseString) * 1000;
                        } else {
                            return parseFloat(lowerCaseString);
                        }
                    }
                    %>

var data = [
    <% site.posts.each(function (post) { %>
                        {
                            date: "<%= post.date.format('YYYY-MM-DD') %>",
                            word_count: <%= convertWordCount(getWordCount(post.content)) %>,
                    link: "<%= url_for(post.path) %>",
                    title: "<%= post.title %>"
        },
    <% }); %>
];


            var margin = { top: 20, right: 20, bottom: 20, left: 20 };
            var containerWidth = 600;
            var cellSize = Math.min((containerWidth - margin.left - margin.right) / 45, (containerWidth - margin.top - margin.bottom) / 8);
            var width = cellSize * 45;
            var height = cellSize * 8;

            var svg = d3
                .select("#heatmap-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleBand().range([width, 0]).padding(0.1);
            var yScale = d3.scaleBand().range([height, 0]).padding(0.1);

            var exponent = 0.3; // Adjust the exponent as needed
            var colorScale = d3.scaleSequential(d3.interpolate("lightblue", "#2d96bd"))
                .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

            xScale.domain(d3.range(45));
            yScale.domain(d3.range(8));

            // 在渲染每个格子时设置渐变色的值
            var cells = svg.selectAll(".cell")
                .data(d3.cross(d3.range(8), d3.range(45)))
                .enter().append("a")
                .attr("href", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.link : "#";
                })
                .append("rect")
                .attr("class", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return "cell" + (correspondingData && correspondingData.word_count > 0 ? " blue" : "");
                })
                .attr("x", function (d) { return xScale(d[1]); })
                .attr("y", function (d) { return yScale(d[0]); })
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? colorScale(Math.pow(correspondingData.word_count, exponent)) : "#ccc";
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("data-word_count", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.word_count : null;
                })
                .attr("title", function (d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? currentDate + "\n" + correspondingData.title : "";
                })
                .on("click", function (event, d) {
                    var currentDate = getDateBefore(d[0] * 45 + d[1]);
                    var correspondingData = data.find(entry => entry.date === currentDate);

                    if (correspondingData && correspondingData.link) {
                        // 点击直接跳转
                        window.location.href = correspondingData.link;
                    }
                })
                .on("mouseover", function (event, d) {
                    var title = d3.select(this).attr("title");
                    if (title) {
                        var tooltip = d3.select("#tooltip");
                        // 显示日期和标题
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 1);
                        var tooltipContent = title;
                        tooltip.html(tooltipContent);

                        // 获取蓝色格子的位置
                        var cellBoundingBox = this.getBoundingClientRect();

                        // 计算 tooltip 的位置，使其中心线与蓝色格子的中心线对齐
                        var tooltipWidth = tooltip.node().offsetWidth;
                        var xPosition = cellBoundingBox.left + cellBoundingBox.width / 2;
                        var yPosition = cellBoundingBox.top;
                        tooltip.style("left", xPosition + "px")
                            .style("top", yPosition + "px");
                    }
                })

                .on("mouseout", function (event, d) {
                    // 隐藏 tooltip
                    var tooltip = d3.select("#tooltip");
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0)
                        .on("end", function () {
                            // 清除 tooltip 内容
                            tooltip.html("");
                        });
                });

            function updateCellStyles() {
                var isDarkTheme = document.body.classList.contains("dark-theme");
                cells.style("stroke", isDarkTheme ? "#292a2d" : "#fff")
                    .style("stroke-width", "1px");
            }

            updateCellStyles();

            document.body.addEventListener("themechange", function () {
                updateCellStyles();
            });
        });


        </script>

        <style>
            @media (max-width: 767px) {
                #heatmap-container {
                    display: none;
                }
            }

            /* 在桌面端时隐藏 .avatar */
            @media (min-width: 768px) {
                .avatar {
                    display: none;
                }
            }

            .cell {
                stroke: #fff !important;
                stroke-width: 1px;
                fill: #ccc;
                cursor: default;
                /* 添加这一行 */
            }

            .dark-theme .cell {
                stroke: #292a2d !important;
                stroke-width: 1px;
                fill: #a9a9b3;
                cursor: default;
                /* 添加这一行 */
            }

            .blue {
                cursor: pointer;
            }

            .dark-theme .blue {
                cursor: pointer;
            }

            #tooltip {
                position: absolute;
                background-color: white;
                border: 1px solid #a9a9b3;
                padding: 3px;
                /* 调整文字与边框的间距 */
                opacity: 0;
                font-size: 10px;
                /* 调整字体大小 */
                transform: translate(-50%, -100%);
                /* 将框定位到正上方居中 */
                line-height: 1;
            }

            .dark-theme #tooltip {
                background-color: #292a2d;
            }
        </style>

        <div id="tooltip"></div>

        <div class="nickname"><%- theme.nickname %></div>
        <div class="description"><%- markdown(theme.description) %></div>
        <div class="links">
            <% if (theme.links !==undefined) { %>
                <% for (var key in theme.links){ %>
                    <a class="link-item" title="<%- key %>" href="<%= theme.links[key] %>">
                        <% if(theme.links_text_enable) { %>
                            <%= key %>
                                <% } %>
                                    <% if(theme.links_icon_enable){ %>
                                        <i class="iconfont icon-<%- key.toLowerCase() %>"></i>
                                        <% } %>
                    </a>
                    <% } %>
                        <% } %>
        </div>
    </div>
</div>
```

# 2024-7-17调整

这次主要调整了以下几个方面：

- 夜间模式时，本来设定无文章的格子颜色为#a9a9b3，但不知为何没有生效。这次用了更细的选择器，使得颜色变为这个。
- 相应地，有文章格子的蓝色也调整为更深（保持渐变），否则会很不协调。

修改了profile.ejs和script.js的内容。修改后者是因为，调整了这两项后，点击切换主题按钮，蓝色并没有变深或变浅，而是要刷新一下才会变化。所以需要定义一个themechange事件并监听它，每当这个事件被触发时，更新格子颜色。这就需要追溯到原本js文件里的toggleTheme函数，在函数执行时，添加一个themechange事件。

## 修改后的profile.ejs

```html
<link rel="stylesheet" href="../fonts/iconfont2/iconfont.css">
<div class="container profile-container">
    <div class="intro">
        <div class="avatar">
            <a href="<%- url_for(theme.nav.Posts) %>"><img src="<%- url_for(theme.avatar) %>"></a>
        </div>
        <div id="heatmap-container">
            <div id="tooltip"></div>
        </div>


        <script src="https://d3js.org/d3.v5.min.js"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                function getDateBefore(days) {
                    var currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() - days);
                    var year = currentDate.getFullYear();
                    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                    var day = String(currentDate.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
        
                <%
                    function convertWordCount(wordCountString) {
                        if (!wordCountString) {
                            return 0;
                        }

                        var lowerCaseString = String(wordCountString).toLowerCase();

                        if (lowerCaseString.includes('k')) {
                            return parseFloat(lowerCaseString) * 1000;
                        } else {
                            return parseFloat(lowerCaseString);
                        }
                    }
                    %>
        
                var data = [
                <% site.posts.each(function (post) { %>
                        {
                            date: "<%= post.date.format('YYYY-MM-DD') %>",
                            word_count: <%= convertWordCount(getWordCount(post.content)) %>,
                    link: "<%= url_for(post.path) %>",
                    title: "<%= post.title %>"
                    },
                <% }); %>
                ];

            var margin = { top: 20, right: 20, bottom: 20, left: 20 };
            var containerWidth = 600;
            var cellSize = Math.min((containerWidth - margin.left - margin.right) / 45, (containerWidth - margin.top - margin.bottom) / 7);
            var width = cellSize * 45;
            var height = cellSize * 7;

            var svg = d3
                .select("#heatmap-container")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleBand().range([0, width]).padding(0.1);
            var yScale = d3.scaleBand().range([0, height]).padding(0.1);

            var exponent = 0.35;
            var colorScale = d3.scaleSequential(d3.interpolate("lightblue", "#2d96bd"))
                .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

            var darkColorScale = d3.scaleSequential(d3.interpolate("#4bafce", "#1a6d8a"))
                .domain([1, Math.pow(d3.max(data, function (d) { return d.word_count; }), exponent)]);

            xScale.domain(d3.range(44, -1, -1));
            yScale.domain(d3.range(6, -1, -1));

            var cells = svg.selectAll(".cell")
                .data(d3.cross(d3.range(7), d3.range(45)).reverse())
                .enter().append("a")
                .attr("href", function (d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.link : "#";
                })
                .append("rect")
                .attr("class", function (d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return "cell" + (correspondingData && correspondingData.word_count > 0 ? " blue" : "");
                })
                .attr("x", function (d) { return xScale(d[1]); })
                .attr("y", function (d) { return yScale(d[0]); })
                .attr("width", cellSize)
                .attr("height", cellSize)
                .style("fill", function (d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    var isDarkTheme = document.body.classList.contains("dark-theme");
                    return correspondingData ? (isDarkTheme ? darkColorScale(Math.pow(correspondingData.word_count, exponent)) : colorScale(Math.pow(correspondingData.word_count, exponent))) : "#ccc";
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("data-word_count", function (d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? correspondingData.word_count : null;
                })
                .attr("title", function (d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);
                    return correspondingData ? currentDate + "\n" + correspondingData.title : "";
                })

                .on("click", function (event, d) {
                    var currentDate = getDateBefore(d[1] * 7 + d[0]);
                    var correspondingData = data.find(entry => entry.date === currentDate);

                    if (correspondingData && correspondingData.link) {
                        window.location.href = correspondingData.link;
                    }
                })
                .on("mouseover", function (event, d) {
                    var title = d3.select(this).attr("title");
                    if (title) {
                        var tooltip = d3.select("#tooltip");
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 0.9);
                        var tooltipContent = title;
                        tooltip.html(tooltipContent);

                        var cellBoundingBox = this.getBoundingClientRect();

                        var tooltipWidth = tooltip.node().offsetWidth;
                        var xPosition = cellBoundingBox.left + cellBoundingBox.width / 2;
                        var yPosition = cellBoundingBox.top;
                        tooltip.style("left", xPosition + "px")
                            .style("top", yPosition + "px");
                    }
                })

                .on("mouseout", function (event, d) {
                    var tooltip = d3.select("#tooltip");
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0)
                        .on("end", function () {
                            tooltip.html("");
                        });
                });

            function updateCellStyles() {
                var isDarkTheme = document.body.classList.contains("dark-theme");
                cells.style("stroke", isDarkTheme ? "#292a2d" : "#fff")
                    .style("stroke-width", "1px")
                    .style("fill", function (d) {
                        var currentDate = getDateBefore(d[1] * 7 + d[0]);
                        var correspondingData = data.find(entry => entry.date === currentDate);
                        return correspondingData ? (isDarkTheme ? darkColorScale(Math.pow(correspondingData.word_count, exponent)) : colorScale(Math.pow(correspondingData.word_count, exponent))) : "#ccc";
                    });
            }

            updateCellStyles();

            document.body.addEventListener("themechange", function () {
                updateCellStyles();
            });
            });
        </script>

        <style>
            @media (max-width: 767px) {
                #heatmap-container {
                    display: none;
                }
            }

            /* 在桌面端时隐藏 .avatar */
            @media (min-width: 768px) {
                .avatar {
                    display: none;
                }
            }

            .cell {
                stroke: #fff !important;
                stroke-width: 1px;
                fill: #ccc;
                cursor: default;
                /* 添加这一行 */
            }

            .dark-theme .cell {
                stroke: #292a2d !important;
                stroke-width: 1px;
                cursor: default;
                /* 添加这一行 */
            }

            .dark-theme .cell:not(.blue) {
                fill: #a9a9b3 !important;
            }

            .blue {
                cursor: pointer;
            }

            .dark-theme .blue {
                cursor: pointer;
            }

            #tooltip {
                position: absolute;
                background-color: white;
                border: 1px solid #a9a9b3;
                padding: 3px;
                /* 调整文字与边框的间距 */
                opacity: 0;
                font-size: 10px;
                /* 调整字体大小 */
                transform: translate(-50%, -100%);
                /* 将框定位到正上方居中 */
                line-height: 1;
            }

            .dark-theme #tooltip {
                background-color: #292a2d;
            }
        </style>

        <div class="nickname"><%- theme.nickname %></div>
        <div class="description"><%- markdown(theme.description) %></div>
        <div class="links">
            <% if (theme.links !==undefined) { %>
                <% for (var key in theme.links){ %>
                    <a class="link-item" title="<%- key %>" href="<%= theme.links[key] %>">
                        <% if(theme.links_text_enable) { %>
                            <%= key %>
                                <% } %>
                                    <% if(theme.links_icon_enable){ %>
                                        <i class="iconfont icon-<%- key.toLowerCase() %>"></i>
                                        <% } %>
                    </a>
                    <% } %>
                        <% } %>
        </div>
    </div>
</div>
```

## 修改前后的script.js

### 修改前

```javascript
// declaraction of document.ready() function.
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;
    d.ready = function (f) {
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);
        if (fn.push(f) > 1) return;
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    setTimeout(arguments.callee, 0);
                }
            })();
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState))
                    clearInterval(t), run();
            }, 0);
    };
})();


document.ready(
    // toggleTheme function.
    // this script shouldn't be changed.
    () => {
        var _Blog = window._Blog || {};
        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        const isDark = currentTheme === 'dark';
        const pagebody = document.getElementsByTagName('body')[0]
        if (isDark) {
            document.getElementById("switch_default").checked = true;
            // mobile
            document.getElementById("mobile-toggle-theme").innerText = "· Dark"
        } else {
            document.getElementById("switch_default").checked = false;
            // mobile
            document.getElementById("mobile-toggle-theme").innerText = "· Light"
        }
        _Blog.toggleTheme = function () {
            if (isDark) {
                pagebody.classList.add('dark-theme');
                // mobile
                document.getElementById("mobile-toggle-theme").innerText = "· Dark"
            } else {
                pagebody.classList.remove('dark-theme');
                // mobile
                document.getElementById("mobile-toggle-theme").innerText = "· Light"
            }
            document.getElementsByClassName('toggleBtn')[0].addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme');
                } else {
                    pagebody.classList.add('dark-theme');
                }
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light',)
            })
            // moblie
            document.getElementById('mobile-toggle-theme').addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme');
                    // mobile
                    document.getElementById("mobile-toggle-theme").innerText = "· Light"

                } else {
                    pagebody.classList.add('dark-theme');
                    // mobile
                    document.getElementById("mobile-toggle-theme").innerText = "· Dark"
                }
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light',)
            })
        };
        _Blog.toggleTheme();
        // ready function.
    }
);
```

### 修改后

```javascript
// declaraction of document.ready() function.
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () {
        for (var i = 0; i < fn.length; i++) fn[i]();
    };
    var d = document;
    d.ready = function (f) {
        if (!ie && !wk && d.addEventListener)
            return d.addEventListener('DOMContentLoaded', f, false);
        if (fn.push(f) > 1) return;
        if (ie)
            (function () {
                try {
                    d.documentElement.doScroll('left');
                    run();
                } catch (err) {
                    setTimeout(arguments.callee, 0);
                }
            })();
        else if (wk)
            var t = setInterval(function () {
                if (/^(loaded|complete)$/.test(d.readyState))
                    clearInterval(t), run();
            }, 0);
    };
})();

document.ready(
    // toggleTheme function.
    // this script shouldn't be changed.
    () => {
        var _Blog = window._Blog || {};
        const currentTheme = window.localStorage && window.localStorage.getItem('theme');
        const isDark = currentTheme === 'dark';
        const pagebody = document.getElementsByTagName('body')[0]
        if (isDark) {
            document.getElementById("switch_default").checked = true;
            // mobile
            document.getElementById("mobile-toggle-theme").innerText = "· Dark"
        } else {
            document.getElementById("switch_default").checked = false;
            // mobile
            document.getElementById("mobile-toggle-theme").innerText = "· Light"
        }
        _Blog.toggleTheme = function () {
            if (isDark) {
                pagebody.classList.add('dark-theme');
                // mobile
                document.getElementById("mobile-toggle-theme").innerText = "· Dark"
            } else {
                pagebody.classList.remove('dark-theme');
                // mobile
                document.getElementById("mobile-toggle-theme").innerText = "· Light"
            }
            document.getElementsByClassName('toggleBtn')[0].addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme');
                    // Dispatch the custom 'themechange' event
                    var event = new Event('themechange');
                    document.body.dispatchEvent(event);
                } else {
                    pagebody.classList.add('dark-theme');
                    // Dispatch the custom 'themechange' event
                    var event = new Event('themechange');
                    document.body.dispatchEvent(event);
                }
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light',)
            })
            // moblie
            document.getElementById('mobile-toggle-theme').addEventListener('click', () => {
                if (pagebody.classList.contains('dark-theme')) {
                    pagebody.classList.remove('dark-theme');
                    // mobile
                    document.getElementById("mobile-toggle-theme").innerText = "· Light"
                    // Dispatch the custom 'themechange' event
                    var event = new Event('themechange');
                    document.body.dispatchEvent(event);
                } else {
                    pagebody.classList.add('dark-theme');
                    // mobile
                    document.getElementById("mobile-toggle-theme").innerText = "· Dark"
                    // Dispatch the custom 'themechange' event
                    var event = new Event('themechange');
                    document.body.dispatchEvent(event);
                }
                window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light',)
            })
        };
        _Blog.toggleTheme();
        // ready function.
    }
);

```