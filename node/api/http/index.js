/**
 * Created by zhang on 2016/7/20.
 */
var http = require("http");
var fs = require("fs");

http.createServer(function(req,res){
    //fs.readFile('index.html',function readData(err,data){
    //    res.writeHead(200,{"Content-Type":"text/plain"});
    //    res.end(data);
    //})
    console.log(req.header);
    fs.createReadStream(`${__dirname}/index.html`).pipe(res);
}).listen(8080);
console.log('Server running');