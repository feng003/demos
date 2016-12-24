/**
 * Created by zhang on 2016/12/21.
 */

var http = require("http");

http.createServer(function(req,res){

    var session = {};
    var key = 'session_id';
    var EXPIRES = 20*60*1000;
    var generate = function(){
        var session = {};
        session.id = (new Date()).getTime() + Math.random();
        session.cookie = {
            expire:(new Date()).getTime()+EXPIRES
        };
        session[session.id] = session;
        return session;
    };

    var id = '';
    console.log(session);
    if(!id){
        req.session = generate();
        console.log(req.session);
    }else{
        var session = session[id];
        if(session){
            if(session.cookie.expires > (new Date()).getTime()){
                session.cookie.expires = (new Date()).getTime()+EXPIRES;
                req.session = session;
            }else{
                delete session[id];
                req.session = generate();
            }
        }else{
            req.session = generate();
        }
    }
    handle(req,res);

    var writeHead = res.writeHead;
    res.writeHead = function(){
        var cookies = res.getHeader('Set-Cookie');
        var session = serialize(key,req.session.id);
        cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies,session];
        res.setHeader('Set-Cookie',cookies);
        return writeHead.apply(this,arguments);
    };
}).listen(8088);
console.log('Server running');

var handle = function(req,res){
    if(!req.session.isVisit)
    {
        req.session.isVisit = true;
        res.writeHead(200);
        res.end('welcome first to here');
    }else{
        res.writeHead(200);
        res.end('welcome');
    }
};



