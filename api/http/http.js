/**
 * Created by zhang on 2016/7/20.
 */
var http = require("http");
var fs   = require("fs");
var url  = require('url');
var querystring = require('querystring');


http.createServer(function(req,res){
    //fs.readFile('index.html',function readData(err,data){
        var pathname = url.parse(req.url).pathname;
        //var query = querystring.parse(url.parse(req.url).query);
        var query = url.parse(req.url,true).query;
        console.log(query);
        console.log(pathname);
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.end("hello world");
        console.log(req.method);
    //})
    //console.log(res);
    //fs.createReadStream(`${__dirname}/index.html`).pipe(res);
}).listen(8080);
console.log('Server running');