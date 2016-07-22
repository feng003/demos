/**
 * fs
 * Created by zhang on 2016/7/22.
 */

var fs = require('fs');
console.log(process.argv[2] , '->',process.argv[3]);

var readStream = fs.createReadStream(process.argv[2]);   // 读取数据流
var writeStream = fs.createWriteStream(process.argv[3]); // 写入数据流

readStream.on('data',function(chunk){
    writeStream.write(chunk);
});

readStream.on('end',function(){
    writeStream.end();
});

readStream.on('error',function(err){
    console.log('ERROR',err);
});

writeStream.on('error',function(err){
    console.log('ERROR',err);
});



