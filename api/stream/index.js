/**
 * Created by zhang on 2016/7/21.
 */
var http = require('http');
var fs   = require('fs');
var zlib = require('zlib');

var stream = require('stream');
var Stream = stream.Stream;
var ws = new Stream;
ws.writable = true;

ws.write = function(data){
    console.log("input=" + data);
};

ws.end = function(data){
    console.log('bye');
};

process.stdin.pipe(ws);

var server = http.createServer(function(req,res){
    //fs.readFile(__dirname + '/readme.md',function(err,data){
    //    res.end(data);
    //});
    //var stream = fs.createReadStream(__dirname + '/readme.md');
    //stream.pipe(res);

    //fs.createReadStream('./readme.md')
    //.pipe(zlib.createGzip())
    //.pipe(fs.createWriteStream('readme.gz'));


});

server.listen(8000);
