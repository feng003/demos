/**
 * Created by zhang on 2016/7/24.
 */
    var fs = require('fs');
    var path = require('path');

var paths = path.resolve('','readme.md');
console.log(paths);

var path1 = path.join('api','fs','index.js');
console.log(path1);

function exists(pth,mode){
    try{
        fs.accessSync(pth,mode);
        return true;
    } catch(e){
        console.log(e);
        return false;
    }
}

console.log(exists(path1,'0777'));
console.log(path.extname(paths));
console.log(path.dirname(paths));
console.log(path.basename(paths,'.md'));

console.log(process.env.PATH.split(path.delimiter)); //linux
console.log(process.env.PATH);  //win