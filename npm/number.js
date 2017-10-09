/**
 * Created by User on 2017/10/9.
 */

const isNum = require('is_number');
const kindOf = require('kind-of');

console.log(isNum(10.1));

function* test(){
    var a = 1;
    yield a*2;
    yield a+3;
}

let g = test();

console.log(g);
console.log(kindOf(test));
console.log(g.next());
console.log(g.next());

console.log(kindOf('undefined'));
console.log(kindOf(undefined));

