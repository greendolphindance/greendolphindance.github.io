hexo.extend.helper.register('getWordCount', function (content) {
    // 在这里调用 hexo-wordcount 插件提供的方法获取字数
    // 请替换 'wordcount' 为实际注册插件时的名称
    var wordcount = hexo.extend.helper.get('wordcount').bind(hexo);
    return wordcount(content);
});
