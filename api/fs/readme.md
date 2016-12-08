> fs filesystem

    readFileSync()
    writeFileSync()
    exists()
    mkdir() writeFile() readFile()
    mkdirSync()  writeFileSync() readFileSync()
    readDir()
    stat()    //判断正在处理的到底是一个文件，还是一个目录
    watchfile() unwatchfile()  //监听一个文件
    createReadStream()   //用于打开大型的文本文件，创建一个读取操作的数据流
    createWriteStream()  //创建一个写入数据流对象

events

    var EventEmitter = require('events').EventEmitter;

    var event = new EventEmitter();

> emitter.emit(event, [arg1], [arg2], [...])  使用提供的参数按顺序执行指定事件的 listener,若事件有 listeners 则返回 true 否则返回 false。

    console.log(EventEmitter);

    { [Function: EventEmitter]
      EventEmitter: [Circular],
      usingDomains: false,
      defaultMaxListeners: 10,
      init: [Function],
      listenerCount: [Function] }

      console.log(event);

      EventEmitter {
      domain: null,
      _events: {},
      _eventsCount: 0,
      _maxListeners: undefined }
