/**
 * Created by zhang on 2016/12/16.
 */

var net = require('net');

var server = net.createServer(function(socket){
    socket.on('data',function(data){
        socket.write('hello');
    })

    socket.on('end',function(){
        console.log('end');
    });

    socket.write('welcome socket');
    socket.pipe(socket);
});

server.listen(8800,function(){
    console.log('server bound');
})
//    .close(function(){
//    console.log('server close');
//});