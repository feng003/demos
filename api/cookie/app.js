/**
 * Created by zhang on 2016/12/21.
 */

var http = require("http");

http.createServer(function(req,res){
    //console.log(res);
    req.cookies = parseCookie(req.headers.cookie);
    handle(req,res);
}).listen(8080);
console.log('Server running');

var parseCookie = function(cookie)
{
    var cookies = {};
    if(!cookie){
        return cookies;
    }
    var list = cookie.split('; ');
    console.log(list);
    for(var i = 0;i<list.length;i++){
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
};

var handle = function(req,res)
{
    if(!req.cookies.isVisit)
    {
        res.setHeader('Set-Cookie',[serialize('isVisit','1'),serialize('foo','bar')]);
        res.writeHead(200);
        res.end('welcome first to here');
    }else{
        res.writeHead(200);
        res.end('welcome');
    }
};

var serialize = function(name,val,opt)
{
    //var pairs = [name + '=' + encode(val)];
    var pairs = [name + '=' + val];
    opt = opt || {};
    if(opt.maxAge) pairs.push('Max-Age='+opt.maxAge);
    if(opt.domain) pairs.push('Domain='+opt.domain);
    if(opt.path) pairs.push('Path='+opt.path);
    if(opt.expires) pairs.push('Expires='+opt.expires.toUTCString());
    if(opt.httpOnly) pairs.push('HttpOnly');
    if(opt.secure) pairs.push('Secure');
    return pairs.join('; ');
};