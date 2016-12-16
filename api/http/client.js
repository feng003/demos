/**
 * client
 * Created by zhang on 2016/12/16.
 */
var dgram = require('dgram');

var message = new Buffer('hello client node ');

var client = dgram.createSocket('udp4');

client.send(message,0,message.length,41234,'localhost',function(err,bytes){
    console.log(bytes);
    client.close();
});
