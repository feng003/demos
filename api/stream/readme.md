> stream 通过事件通信，readable writable drain data end close error

处理方式：1、同步 2、stream方式（每次只读取数据的一小块，每当系统读入一小块数据，就会触发一个事件）

1. 可读数据流
2. 可写数据流
3. 双向数据流 tcp scokets zlib crypto

> 可读数据流    流动态 暂停态

> 可写数据流 write.js

    client http requests
    server http responses
    fs write streams
    zlib streams
    crypto streams
    tcp sockets
    child process stdin
    process.stdoutm,process.stderr

#### 方法  write()   cork() uncork() setDefaultEncoding()  end()

#### 事件  drain  finish  pipe  unpipe  error

> http  app.js  使用 stream 接口 实现网络数据的读写

> fs 文件复制 copy.js

    node copy.js file1.md file2.md