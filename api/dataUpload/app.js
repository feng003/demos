/**
 * Created by zhang on 2016/12/22.
 */

var http = require("http");

var querystring = require('querystring');

var formidable = require('formidable');

//var xml2js = require('xml2js');

http.createServer(function(req,res){
    if(hasBody(req)){
        if(mime(req) === 'multipart/form-data'){
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
                req.body = fields;
                req.files = files;
                handle(req,res);
            })
        }

    }else{
        handle(req,res);
    }
}).listen(8089);
console.log('Server running');

var hasBody = function(req){
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};

var mime = function(req){
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
};

var handle = function(req,res){
    if(mime(req) === 'application/x-www-form-urlencoded')
    {
        var buffers = [];
        req.on('data',function(chunk){
            buffers.push(chunk);
        });
        req.on('end',function(){
            req.rawBody = Buffer.concat(buffers).toString();
        });
        req.body = querystring.parse(req.rawBody);
    }
    if(mime(req) === 'application/json'){
        try{
            req.body = JSON.parse(req.rawBody);
        }catch(e){
            res.writeHead(400);
            res.end('Invalid JSON');
            return;
        }
    }
    if(mime(req) === 'application/xml'){
        xml2js.parseString(req.rawBody,function(err,xml){
            if(err){
                res.writeHead(400);
                res.end('Invalid xml');
                return;
            }
            req.body = xml;
        })
    }
    console.log(req.body);
    //todo(req,res);
};
