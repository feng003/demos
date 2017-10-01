/**
 * Created by User on 2017/9/28.
 */

const isSort  = require('is-sorted');
const first   = require('array-first');
const last    = require('array-last');
const flatten = require('arr-flatten');//TODO
const dedupe  = require('dedupe');
const range = require('array-range');
const diff  = require('arr-diff');
const fill  = require('filled-array');
const mapArray = require('map-array');
const inArray = require('in-array');
const remove = require('unordered-array-remove');
const swap = require('array-swap');
const mirr = require('mirrarray'); //TODO

let arr = [3, 1, 2, 2, 5, 1, 3];
let a = [2,3];

console.log(isSort(arr));

console.log(isSort([3, 2, 1], function (a, b) { return b - a }));

console.log(first(arr,2));

console.log(last(['a', 'b', 'c', 'd', 'e', 'f'], 3));

console.log(flatten(['a', ['b', ['c']], 'd', ['e']]));

var b = dedupe(arr);
console.log(b);

console.log(range(1, 4));
console.log(range(5));
console.log(Array.apply(null, new Array(5)));

console.log(diff(arr,a));

console.log(fill('x', 3));

console.log(mapArray(arr,function(key,val){return key+"."+val; }));

console.log(inArray(arr,'3'));

console.log(remove(arr,'3'));
console.log(arr);

console.log(arr.swap(1,3));
console.log(arr);

console.log(mirr(arr));

