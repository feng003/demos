/**
 * Created by zhang on 2016/12/2.
 */

var net = require('net');
const HOST = '127.0.0.1';
const PORT = 3030;

net.createServer(function(sock){

    console.log('CONNECT:'+sock.remoteAddress + ":" + sock.remotePort);

    sock.on('data',function(data){
        console.log('DATA: ' + sock.remoteAddress + ":" + data);
        sock.write("You said" + data + "" );
    });

    sock.on('close',function(data){
        console.log('CLOSED: ' + sock.remoteAddress + ":" +sock.remotePort);
    });
}).listen(PORT,HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
