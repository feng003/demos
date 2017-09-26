/**
 * Created by User on 2017/9/25.
 */

const hasOwnProperty = require('has-own-property');
const missingDeepKeys = require('missing-deep-keys');
const staticProps = require('static-props');
const sortedObject = require('sorted-object');
const isEmptyObject = require('is-empty-object');

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

class Point2d{
    constructor(x,y,label){
        const color='red';
        const norm = ()=> x*x+y*y;

        staticProps(this)({label,color,norm})

        const enumerable = true
        staticProps(this)({x,y},enumerable)
    }
}

staticProps(Point2d)({dim:2});
const norm = (x,y)=>x*x*y*y;
const p = new Point2d(1,2,"A");
staticProps(Point2d)({norm:()=>norm});
p.label = "b";
p.color = 'black';
console.log(p);
console.log(p.label);
console.log(p.color);
console.log(p.norm);


var input = { c: 3, b: 2, a: 1 };
var input = { hello: 3, Hi: 2, HELLO: 1, hi: 4 };
var output = sortedObject(input);
console.log(output);

console.log(isEmptyObject([]));
console.log(isEmptyObject({}));
console.log(isEmptyObject(input));




