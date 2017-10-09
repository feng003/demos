/**
 * Created by User on 2017/10/9.
 */

const isGenerator = require('is-generator');
const isGeneratorFn = require('is-generator').fn;


function* test(){
    var a = 1;
    yield a*2;
    yield a+3;
}

console.log(isGenerator(test()));
console.log(isGeneratorFn(test));