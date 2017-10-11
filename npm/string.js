/**
 * Created by User on 2017/10/10.
 */

const decamelize = require('decamelize');
const pad   = require('pad-left');
const toCamelCase = require('to-camel-case');
const toSpaceCase = require('to-space-case');
const toNoCase = require('to-no-case');
const toCapitalCase = require('to-capital-case');
const toConstantCase = require('to-constant-case');
const snake = require('to-snake-case');
const toDotCase = require('to-dot-case');
const toPascalCase = require('to-pascal-case');
const toSentenceCase = require('to-sentence-case');
const toTitleCase = require('to-title-case');

console.log(decamelize('unicornRainbow'));
console.log(pad( '35', 4, '0'));
console.log(toCamelCase('hello-sdf_sss'));//helloSdfSss
console.log(toCapitalCase('space case'));//Space Case
console.log(toConstantCase('dot.case')); //DOT_CASE
console.log(toDotCase('camelCase'));  //camel.case
console.log(toPascalCase('dot.case'));//DotCase
console.log(toSentenceCase('the catcher in the rye'));//The catcher in the rye
console.log(toTitleCase('the catcher in the rye'));// The Catcher in the Rye