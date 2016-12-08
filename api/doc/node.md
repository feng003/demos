> require exports module

    var foo = require('./foo');
    var data = require('./data.json');

    //导出模块 公有方法和属性
    exprots.foo = function(){};

    //module 替换当前模块的导出对象
    module.exports = function(){};

> api

####  fs file Syetem


    fs.stat 、fs.chmod 、fs.chown

    fs.readFile 、fs.readdir、fs.writeFile、fs.mkdir

    fs.open、fs.read、fs.write、fs.close
