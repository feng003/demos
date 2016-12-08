/**
 * Created by zhang on 2016/12/6.
 */

'use strict';

const h = require('./mHello');
const fs = require('fs');
const events = require('events');
console.log(events);

let s = "node";
h(s);

if(typeof (window) === 'undefined'){
    console.log('node');
    console.log(global.console);
}else{
    console.log('browser');
}
let fileName = "./README.md";

fs.stat(fileName,function(err,stat){
    let destName = stat.ino+'.txt';
    if(err){
        console.log(err);
    }else{
        //console.log(stat);
        if(stat.isFile() && stat.size > 1000){
            //TODO 1文件操作
            //fs.readFile(fileName,function(err,buffer){
            //    if(err) throw err;
            //    fs.writeFile(destName,buffer,function(err){
            //        if(err) throw err;
            //        console.log('write success');
            //    })
            //});
            //TODO 2 流操作
            var rs = fs.createReadStream(fileName);
            var ws = fs.createWriteStream(destName);
            rs.pipe(ws);
        }
    }
});