// 同步读取文件
var fs = require('fs');

var data = fs.readFileSync('../readme.md','utf8');
console.log(data);
console.log('end.');
