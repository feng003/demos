/**
 * 可读数据流  产生数据
 * Created by zhang on 2016/7/22.
 */
var Readable = require('stream').Readable;
var rs = new Readable;

var fs = require('fs');
var readableStream = fs.createReadStream('readme.md');
var data = '';

readableStream.setEncoding('utf8');
readableStream.on('data',function(chunk){
    data +=chunk;
});

readableStream.on('end',function(){
    console.log(data);
});
//rs.push('beep');
//rs.push('boop \n');
//rs.push(null);
//
//rs.pipe(process.stdout); //一个指向标准输出流(stdout)的 可写的流(Writable Stream)。

