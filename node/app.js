/**
 * Created by zhang on 2016/7/25.
 */

    //一个模块想要对外暴露变量（函数也是变量），可以用module.exports = variable;，一个模块要引用其他模块暴露的变量，用var ref = require('module_name');就拿到了引用模块的变量。
var fs = require('fs');
var hello = require('./hello');
var http = require('http');

hello.hello();

if(typeof(window) === 'undefined'){
    console.log('nodejs');
}else{
    console.log('browes');
}

var data = JSON.stringify(http,censor(http));
fs.writeFile('http.txt',data,function(err){
    if(err){
        console.log(err);
    }else{
        console.log('ok');
    }
});

function censor(censor) {
    return (function() {
        var i = 0;
        return function(key, value)
        {
            if (i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
                return '[Circular]';

            ++i; // so we know we aren't using the original object anymore

            return value;
        }
    })(censor);
}

//fs.readFile('readme.md',function(err,data){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(data);
//        console.log(data.length + ' bytes');
//    }
//});