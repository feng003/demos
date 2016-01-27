/**
 * Created by zhang on 2016/1/22.
 */

//var date = new Date();
//    var boo = new Boolean(true)
//    console.log(boo.toString());
//
//    var arr = new Array('array');
//    arr.push('push');
//    console.log(arr);
//    console.log(arr.pop());
var exam = document.getElementById('exam');
$(exam).hide().toggle();
console.log(exam);
console.log($('exam'));
function a()
{
    this.aa = function()
    {
        alert("a");
    }
}
function b()
{
    console.log(a.call(this));
}
//var c = new b();
//c.aa();
console.log(Object);
console.log(Object.prototype.toString.call(null)); //[object Null]
Object.prototype.toString.call(undefined);
Object.prototype.toString.call("abc");
Object.prototype.toString.call(123);
Object.prototype.toString.call(true);
