/**
 * Created by zhang on 2016/7/20.
 */

var http = require("http");
http.createServer(function(req,res){
    var content = "";
    req.on('data',function(chunk){
        content += chunk;
    });

    req.on('end',function(){
        res.writeHead(200,{"Content-Type":"text/plain"});
        res.write("You sent" + content);
        res.end;
    })
}).listen(8080);