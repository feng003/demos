/**
 * Created by User on 2017/10/10.
 */

const decamelize = require('decamelize');
const pad   = require('pad-left');
const toCamelCase = require('to-camel-case');
require('to-space-case');
require('to-no-case');

console.log(decamelize('unicornRainbow'));
console.log(pad( '35', 4, '0'));
console.log(toCamelCase('hello-sdf_sss'));