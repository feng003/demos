> 构建web应用

1.1 请求方法

    function(request,response){
        console.log(request.method);
    }
    
1.2 路径解析 
    
    var url = require('url');
    var pathname = url.parse(req.url).pathname;

    GET /path?foo=bar HTTP/1.1
    request.url
    http://user:pass@host.com:8080/p/a/t/h?query=string#hash
    
    /controller/action/a/b/c
    
1.3 查询字符串  

    var querystring = require('querystring');
    var query = querystring.parse(url.parse(req.url).query);
    
1.4 cookie

    
1.5 session


> 数据上传

2.1 表单数据

    默认表单提交，请求头中的 content-type字段值为 application/x-www-form-urlencoded
    
2.2 其他格式

    json 类型的值为  application/json
    xml 类型的值为 application/xml
    
> 路由

1 文件路径型

2 MVC 

3 RESTful

> 中间件  对于单个中间件而言，它足够简单，职责单一。 Connect

> 页面渲染

1. 内容响应  mime 

        Content-Encoding:gzip
        Content-Length:2000
        Content-Type:text/javascript;charset=utf-8
        Content-Disposition:attachment:filename="filename.txt"

2. 视图渲染

    var html = render(view,data);
    res.end(html);
    
3. 模板 拼接字符串

    语法解析
    处理表达式
    生成待执行的语句
    与数据一起执行，生成最终字符串

    Hello<%= username%>
    

> introduce api

5. [fs](http://nodeapi.ucdok.com/api/fs.html) 与文件系统交互。

6. [path](./path) 处理文件路径。

7. [process](./process)

8. [buffer](http://nodeapi.ucdok.com/api/buffer.html)

9. [events](http://nodeapi.ucdok.com/api/events.html)

10. [stream](http://nodeapi.ucdok.com/api/stream.html)

11. [child_process](http://nodeapi.ucdok.com/api/child_process.html) 新建子进程。

12. [http](http://nodeapi.ucdok.com/api/http.html) 提供HTTP服务器功能。

13. assert

14. cluster

15. OS

16. net

17. express

18. koa

19. [url](http://nodeapi.ucdok.com/api/url.html) 解析URL。

[Query String](http://nodeapi.ucdok.com/#/api/querystring.html) 解析URL的查询字符串。

[util]() 提供一系列实用小工具。

[crypto]() 提供加密和解密功能，基本上是对OpenSSL的包装。

[Promise]()




