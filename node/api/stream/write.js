/**
 * Created by zhang on 2016/7/22.
 */

var fs = require('fs');
var readableStream = fs.createReadStream('./file1.md');
var writeableStream = fs.createWriteStream('./file2.md');

readableStream.setEncoding('utf8');
readableStream.on('data',function(chunk){
    writeableStream.write(chunk);
});

