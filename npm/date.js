/**
 * Created by User on 2017/10/1.
 */

const prettyMs = require('pretty-ms');
const hirestime = require('hirestime');
const periods = require('periods'); //TODO
const fecha = require('fecha');
const timeRef = require('akamai-time-reference');
const timeago = require('timeago.js');

const getElapsed = hirestime();

console.log(1e6);
// console.log(hirestime);

setTimeout(_ => {
    //returns the elapsed seconds
    console.log(getElapsed(hirestime.MS))
}, 3000);

console.log(prettyMs(100));

console.log(prettyMs(18880981201,{verbose: true}));

var week = periods.week;
var twentyFourHoursLater = Date.now() + periods.day();
// console.log(Date.now());
console.log(twentyFourHoursLater);
// console.log(week());

fecha.masks = {
    default: 'ddd MMM DD YYYY HH:mm:ss',
    shortDate: 'M/D/YY',
    mediumDate: 'MMM D, YYYY',
    longDate: 'MMMM D, YYYY',
    fullDate: 'dddd, MMMM D, YYYY',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
};

// Create a new mask
fecha.masks.myMask = 'HH:mm:ss YY/MM/DD';
var time = fecha.format(new Date(2014, 5, 6, 14, 10, 45), 'myMask');
var date = fecha.parse('February 3rd, 2014', 'MMMM Do, YYYY');
console.log(date);
console.log(time);

timeRef.now().then(function(now) {
    console.log(now);
});

// console.log(timeRef.now());
// console.log(timeRef.now());
// console.log(timeRef.now());


const timeagoInstance = timeago();
// var time = timeagoInstance.format('2016-06-12');
var time = timeagoInstance.format('2016-06-12', 'zh_CN');
// var time = timeago().format(Date.now() - 11 * 1000 * 60 * 60);
console.log(time);
