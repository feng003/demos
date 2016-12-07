/**
 * Created by zhang on 2016/12/6.
 */

'use strict';

const h = require('./mHello');
const fs = require('fs');

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
    let name = stat.ino+'.txt';
    if(err){
        console.log(err);
    }else{
        //console.log(stat);
        if(stat.isFile() && stat.size > 1000){
            fs.readFile(fileName,function(err,buffer){
                if(err) throw err;
                fs.writeFile(name,buffer,function(err){
                    if(err) throw err;
                    console.log('write success');
                })
            });
        }
    }
});