> http

    http.STATUS_CODES 全部标准HTTP响应状态码的集合和简短描述。
    http.STATUS_CODES[404] === 'Not Found'

    http.createServer([requestListener])  返回一个新的web服务器对象
    参数 requestListener 是一个函数,它将会自动加入到 'request' 事件的监听队列

    server.listen(port, [hostname], [backlog], [callback])   开始在指定的主机名和端口接收连接。如果省略主机名，服务器会接收指向任意IPv4地址的链接（INADDR_ANY）

> request 请求

    request.url
    request.method
    header:  http请求的所有http头信息
    request.params (get post)

    request.ip    获得http请求的ip地址
    request.files 获取上传的文件

> response 响应

    response.writeHead()
    response.write()
    response.end()

    response.redirect() 网址重定向
    response.sendFile() 发送文件
    response.render()   渲染网页模板
    
> require('url');

    'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'

    protocol: 请求协议，小写  http https
    host: URL主机名已全部转换成小写, 包括端口信息  user:pass@host.com:8080
    auth: URL中身份验证信息部分 user:pass
    port: 主机的端口号部分  8080
    pathname: URL的路径部分,位于主机名之后请求查询之前, including the initial slash if present.  '/p/a/t/h'
    search:   URL 的“查询字符串”部分，包括开头的问号。 '?query=string'
    path:     pathname 和 search 连在一起。 '/p/a/t/h?query=string'
    query:    查询字符串中的参数部分（问号后面部分字符串），或者使用 querystring.parse() 解析后返回的对象。
    hash:     URL 的 “#” 后面部分（包括 # 符号）

> url.parse(urlStr, [parseQueryString], [slashesDenoteHost])  输入 URL 字符串，返回一个对象。

    url.resolve('http://example.com/', '/one')
    // 'http://example.com/one'
    
    url.resolve('http://example.com/one/', 'two')
    // 'http://example.com/one/two'
    
    url.resolve('http://example.com/one', '/two')
    // 'http://example.com/two'

> url.format(urlObj)   输入一个 URL 对象，返回格式化后的 URL 字符串。

> url.resolve(from, to)
