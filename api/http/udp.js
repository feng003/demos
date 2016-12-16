/**
 * server
 * Created by zhang on 2016/12/16.
 */

var dgram = require('dgram');

var server = dgram.createSocket('udp4');

server.on('message',function(msg,info){
    console.log("server got: " + msg + "from " + info.address + ":" + info.port);
});

server.on('listening',function(){
    var address = server.address();
    console.log('server listening ' + address.address + ":" + address.port);
});

server.bind('41234');
