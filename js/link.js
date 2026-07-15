// 友链随机排序（原内联于 layout/link.ejs）

function shuffleLinks() {
    var friendLinks = document.getElementById('friend-links');
    var links = Array.from(friendLinks.children);
    links.sort(() => Math.random() - 0.5);
    for (var i = 0; i < links.length; i++) {
        friendLinks.appendChild(links[i]);
    }
}

// 初始页面加载时打乱一次顺序
shuffleLinks();

// 每隔10分钟打乱一次顺序
setInterval(function () {
    shuffleLinks();
}, 600000); // 10分钟 = 600000毫秒
