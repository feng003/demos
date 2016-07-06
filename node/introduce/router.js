
//function route(handle , pathname , res,postData)
//{
//    console.log('request for ' + pathname);
//    if(typeof handle[pathname] === 'function')
//    {
//        // handle[pathname]();
//       // return handle[pathname]();
//	      handle[pathname](res,postData);
//    }else{
//        console.log('no request handler found for ' + pathname);
//       // return  "404 Not found";
//	    res.writeHead(404,  {"Content-Type":  "text/plain"});
//        res.write("404 Not found");
//        res.end();
//    }
//}

function route(handle, pathname, response, request)
{
    console.log("About to route a request for "  + pathname);
    if  (typeof handle[pathname]  ===  'function')
    {
        handle[pathname](response, request);
    }  else  {
        console.log("No request handler found for "  + pathname);
        response.writeHead(404,  {"Content-Type":  "text/html"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;
