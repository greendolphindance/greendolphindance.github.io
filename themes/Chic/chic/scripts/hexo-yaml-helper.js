const yaml = require('js-yaml');
const fs = require('fs');

hexo.extend.helper.register('getYaml', function (path) {
    const content = fs.readFileSync(path, 'utf8');
    return yaml.load(content);
});
