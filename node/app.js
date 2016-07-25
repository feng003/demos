/**
 * Created by zhang on 2016/7/25.
 */

    //一个模块想要对外暴露变量（函数也是变量），可以用module.exports = variable;，一个模块要引用其他模块暴露的变量，用var ref = require('module_name');就拿到了引用模块的变量。

var hello = require('./hello');
console.log(hello);

hello.hello();
