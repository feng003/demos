/**
 * Created by zhang on 2016/12/14.
 */

console.log('init hello.js...');

module.exports = function (...rest) {
    var sum = 0;
    for (let n of rest) {
        sum += n;
    }
    return sum;
};