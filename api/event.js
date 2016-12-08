/**
 * Created by zhang on 2016/12/8.
 */

var events = require('events');
var eventEmitter = new events.EventEmitter();

// on(event,listener)
eventEmitter.on('sayWhat',function(name){
    console.log("I am " + name);
});

eventEmitter.on('sayWhat',function(name){
    console.log("I am " + name + ' what is your name');
});

//emit(event,[arg1],[arg2],[...])
eventEmitter.emit('sayWhat','node','js');

//error事件
//eventEmitter.emit('error');


