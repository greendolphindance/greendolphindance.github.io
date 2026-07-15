// 标签云随机打乱顺序（原内联于 layout/tag.ejs）

// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle the tags array randomly
var tagsContainer = document.getElementById('tag-cloud');
var tags = Array.from(tagsContainer.children);
shuffleArray(tags);
tags.forEach(tag => tagsContainer.appendChild(tag));
