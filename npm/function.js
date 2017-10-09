/**
 * Created by User on 2017/10/9.
 */

const fs = require('fs');
const request = require('request');

const isGenerator = require('is-generator');
const isGeneratorFn = require('is-generator').fn;
const pify = require('pify'); //TODO
const isPromise = require('is-promise');
const sleep = require('sleep-promise');
const promiseAllProps = require('promise-all-props');

function* test(){
    var a = 1;
    yield a*2;
    yield a+3;
}

console.log(isGenerator(test()));
console.log(isGeneratorFn(test));

// Promisify a single function
pify(fs.readFile)('readme.md', 'utf8').then(data => {
    // console.log(JSON.parse(data).name);
    // console.log(data);
    //=> 'pify'
});

pify(request, {multiArgs: true})('https://baidu.com').then(result => {
    const [httpResponse, body] = result;
    // console.log(httpResponse);
});

let trace = value=>{
    console.log(value);
    return value;
};

sleep(5000)
    .then(()=>"hello")
    .then(trace)
    .then(sleep(1000))
    .then(()=>'promise')
    .then(trace)
    .then(sleep(2000))
    .then(()=>'s')
    .then(trace);

promiseAllProps({
    foo: Promise.resolve('foo'),
    bar: Promise.resolve('bar')
}).then(function(result) {
    console.log(result.foo, result.bar);
});