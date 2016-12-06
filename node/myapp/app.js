var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var path = require('path');

var net = require('net');
var chatServer = net.createServer();

// app.get('/',function(req,res){
//
//     res.send('<h1>hello world</h1>')
// });
//
// app.listen(3000,function(){
//     console.log('listening on 3000');
// })

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    if(msg == '222')
    {
        chatServer.on('connection',function(c){
            c.write('Hi'+msg+' !\n');
            c.end();
        })
    }
    io.emit('chat message', msg);
  });
});

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});
