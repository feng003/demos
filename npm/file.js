/**
 * Created by User on 2017/10/12.
 */

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const tmp = require('tmp');

// mkdirp('/var/local/tmp/foo/bar/baz', function (err) {
//     if (err) console.error(err)
//     else console.log('pow!')
// });

var tmpobj = tmp.fileSync();
console.log('File: ', tmpobj.name);
console.log('Filedescriptor: ', tmpobj.fd);
