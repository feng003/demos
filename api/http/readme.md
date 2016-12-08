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