var fs = require('fs');
var path = require('path');

console.log(__dirname);
console.log(__filename);
console.log(path);
console.log(path.dirname(__filename));
//fs.readFile('../readme.md','utf-8',function(err,data){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(data);
//    }
//});
console.log('end.');
