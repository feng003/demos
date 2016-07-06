// http 模块
var http    = require('http');
// createServer 函数 返回一个对象
http.createServer(function(req,res){
    console.log("Request received.");
    res.writeHead(200,{"Content-Type":'text/plain'});
    res.write("Hello node");
    res.end();
}).listen(8888);

console.log("Server has started.");

//在JavaScript中，一个函数可以作为另一个函数接收一个参数。我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。

//向 createServer 函数传递了一个匿名函数。
