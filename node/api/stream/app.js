/**
 * Created by zhang on 2016/7/22.
 */

var http = require('http');

var server = http.createServer(function(req,res){
    var body = "";
    //设定字符串编码
    req.setEncoding('utf8');
    //data事件 读取或写入一块数据
    req.on('data',function(chunk){
        body += chunk;
    });

    req.on('end',function(){
        try{
            var data = JSON.parse(body);
        } catch(er){
            res.statusCode = 400;
            return res.end('errors: ' + er.message);
        }
        res.write(typeof data);
        res.end();
    });
});

server.listen(1337);
