var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

// console.log(EventEmitter);
// console.log(event);
// on 绑定事件函数
event.on("some",function(){
    console.log('some_event occured.');
});

event.on("some",function(){
    console.log('other_event occured.');
});

// emit 触发一个事件
setTimeout(function(){
    event.emit('some');
},1000);
