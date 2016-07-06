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
