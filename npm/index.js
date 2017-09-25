/**
 * Created by User on 2017/9/25.
 */

const hasOwnProperty = require('has-own-property');
const missingDeepKeys = require('missing-deep-keys');

var obj = {'a':'123'};

var rs = hasOwnProperty(obj,'a');
var res = hasOwnProperty(obj,'b');
// console.log(rs);
// console.log(res);

const o1 = {a: {b: 2},b:3,d:4,c:5,e:6}; // Base object
const o2 = {c: 1, b: 2,e: 5}; // Comparison object
const result = missingDeepKeys(o1, o2,true);
// Prints keys present in o1 but missing in o2
console.log(result); // => [ 'a', 'a.b', 'd']