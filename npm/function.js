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
const compose = require('compose-function'); //TODO
const curry = require('curry');//TODO
const once = require('once');

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

function greet (name, cb) {
    if (!name) cb('Hello anonymous')
    cb('Hello ' + name)
}

function log (msg) {
    console.log(msg)
}

// this will print 'Hello anonymous' but the logical error will be missed
greet(null, once(msg))

// once.strict will print 'Hello anonymous' and throw an error when the callback will be called the second time
greet(null, once.strict(msg))