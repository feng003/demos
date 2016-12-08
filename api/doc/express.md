[官方文档](http://www.expressjs.com.cn/)

> 问题一：使用生成器安装express的时候  express command not found解决方法

    npm install express-generator -g

    express -h

    express myapp

    cd myapp  && npm install

> 问题二： 启动应用

    进入项目目录（microblog）

    mac或者linux
        DEBUG=microblog(目录名称) npm start
    win
         set DEBUG=microblog & npm start

> 问题三： 换模板引擎

    npm install ejs --save


> 问题四：Error: Can't set headers after they are sent.怎么解决？

    重复发送 header请求

[参考文档](http://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent)

> 问题五：Error: listen EADDRINUSE

    端口被占用了，找一下进程或者换下端口。


> 问题六：加载json文件报错   json文件里面不能写注释 导致报错

config.json

config.js  //文件可以加注释

[参考文档](http://www.zhihu.com/question/25552847/answer/31216325)

> 问题七： mongodb 不同的版本配置方式不同
