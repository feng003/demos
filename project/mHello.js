/**
 * Created by zhang on 2016/12/7.
 */

'use strict';

var s = 'hello';
function h(name){
    console.log(s +" "+ name + "!");
}

//把h作为模块的输出 暴露出去
module.exports = h;
