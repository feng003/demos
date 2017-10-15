/**
 * Created by User on 2017/10/12.
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const tmp = require('tmp');
const filesize = require('file-size');
const du = require('du');
const fs = require('mz/fs');

// mkdirp('/var/local/tmp/foo/bar/baz', function (err) {
//     if (err) console.error(err)
//     else console.log('pow!')
// });

// var tmpobj = tmp.fileSync();
// console.log('File: ', tmpobj.name);
// console.log('Filedescriptor: ', tmpobj.fd);

console.log(filesize(186457865).to('MB', 'si'));
console.log(filesize(8).calculate());

du('/var/local/tmp/',function(err,size){
    if(err) throw err;
    console.log('this size is ' + size);
});

fs.exists('/var/local/tmp/').then(function (exists) {
    if (exists){
        console.log(exists);
    } // do something
});
