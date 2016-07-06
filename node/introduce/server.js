var http = require('http');
var url   = require('url');

//function start(route,handle){
//    function onRequest(req,res){
//    //    var str = JSON.stringify(req);
//    //    console.log('1'+str);
//        var postData = '';
//        var pathname = url.parse(req.url).pathname;
//        console.log("Request for "  + pathname +  " received.");
//        //console.log("Request received.");
//        //var content = route(handle,pathname);
//        //var content = route(handle,pathname,res);
//        req.setEncoding('utf8');
//        //注册了“data”事件的监听器
//        req.addListener('data',function(postDataChunk){
//            postData += postDataChunk;
//            console.log("Received POST data chunk '"+      postDataChunk +  "'.");
//        });
//        req.addListener('end',function(){
//            route(handle, pathname, res, postData);
//        });
//    }
//    http.createServer(onRequest).listen(8800);
//    console.log('Server has started.');
//}

function start(route, handle)
{
    function onRequest(request, response)
    {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for "  + pathname +  " received.");
        route(handle, pathname, response, request);
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;
