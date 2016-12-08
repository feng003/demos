/**
 * Created by zhang on 2016/7/18.
 */
var assert = require('assert');

function add(a,b){
    return a+b;
}

var expected = add(1,2);
//assert(expected === 2 ,'预期1加2 等于3');

assert.equal(expected,3,'预期1+2 等于3');
console.log('123');