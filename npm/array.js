/**
 * Created by User on 2017/9/28.
 */

const isSort  = require('is-sorted');
const first   = require('array-first');
const last    = require('array-last');
const flatten = require('arr-flatten');

let arr = [3, 1, 2];

console.log(isSort(arr));

console.log(isSort([3, 2, 1], function (a, b) { return b - a }));

console.log(first(arr,2));

console.log(last(['a', 'b', 'c', 'd', 'e', 'f'], 3));