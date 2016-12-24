/**
 * Created by zhang on 2016/12/22.
 */

var http = require("http");

var crypto = requires('crypto');

var bytes = 1024;

http.createServer(function(req,res){

    //CSRF
    var token = req.session._csrf || (req.session._csrf = generateRandom(24));

    var _csrf = req.body._csrf;
    if(token != _csrf){

    }else{

    }

    var received = 0;
    var len = req.headers['content-length'] ? parseInt(req.headers['content-length'],10) : null;

    if(len && len > bytes){
        res.writeHead(413);
        res.end();
        return;
    }

    req.on('data',function(chunk){
        received += chunk.length;
        if(received > bytes){
            req.destroy();
        }
    });
    handle(req,res);
}).listen(8089);


//CSRF

var generateRandom = function(len){
    return crypto.randomBytes(Math.ceil(len*3/4))
                .toString('base64')
                .slice(0,len);
};

var token = req.session._csrf || (req.session._csrf = generateRandom(24));

