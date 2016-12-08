> 服务器端 可以接受网络请求、读写文件、处理二进制内容

1. global process
2. fs
3. stream and pipe
4. eventEmitter

> global process

            global.console;
            process.version;
            process.cwd();            
> fs

            open();
            readFile();
            readFileSync();
            writeFile();
            exists();
            mkdir();
            readdir();
            rmdir()
            stat(); 获取文件大小以及创建时间
            unlink();
            ftruncate(resource fd,len,callback);截取文件
            
        buffer and string 
            buffer=>string var text = data.toString('utf-8');
            string=>buffer var buf = new Buffer(text,'utf-8');
            
> stream and pipe。 stream对象都是EventEmitter的实例，常用的事件有：data、end、error、finish。 pipe() 把一个文件流和另一个文件流串起来，复制文件的过程。

            //读取流  写入流
            createReadStream(); 创建一个读取操作的数据流
            createWriteStream(); 创建一个写入数据流对象 write()写入数据，end()结束操作
            readable.pipe(writeable,{end;false});
            
             var rs = fs.createReadStream(fileName);
             rs.setEncoding('utf8');
             rs.on('data',function(chunk){data += chunk;});
             rs.on('end',function(data){console.log(data);});
             var ws = fs.createWriteStream(distName);
             
             //管道流
             rs.pipe(ws);
             //链式流
             fs.createReadStream('input.txt')
               .pipe(zlib.createGzip()) // 压缩(createGzip)和解压(createGunzip)文件
               .pipe(fs.createWriteStream('input.txt.gz'));
             
> eventEmitter  node 异步的I/O操作完成时会触发事件队列中的具体事件。主要原因是这些对象本质上是通过继承EventEmitter来实现事件的处理和回调。

            var events = require('events');
            var emitter = new events.EventEmitter();
            
            emitter.addListener(event,listener) 为指定事件添加一个监听器到监听器数组的尾部。
            emitter.on(event,listener) 为指定事件注册一个监听器
            emitter.listeners(event) 返回指定时间的监听器数组
            emitter.emit(event,[arg1],[arg2],[...]) 按参数的顺序执行每个监听器
            emitter.removeListener(event, listener) 在时间队列中剔除某一个事件
            emitter.removeAllListeners([event]) 删除整个事件队列，或多个事件
            
[node event](http://www.runoob.com/nodejs/nodejs-event.html)

[node EventEmitter](http://www.alloyteam.com/2015/08/eventemitter/?utm_source=tuicool&utm_medium=referral)

[node stream](https://github.com/substack/stream-handbook#pipe)
             
             
        
        