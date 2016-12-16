/**
 * Created by zhang on 2016/12/12.
 * websocket
 */
"use strict";
const app = new Koa();

// koa app的listen()方法返回http.Server:
let server = app.listen(3000);

const webSocket = require('ws');

const webSocketServer = webSocket.Server;

const wss = new webSocketServer({
    server: server
});

wss.on('connection',function(ws){
    console.log(`[SERVER] connection()`);
    ws.on('message',function(message){
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO:${message}`,(err)=>{
            if(err){
                console.log(`[SERVER] error: ${err}`);
            }
        })
    })
});

console.log('app started at port 3300');