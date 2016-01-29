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

//new Ajax.Request('index.php', {
//    method:'post',
//    data:{'username':"Anna"},
//    onSuccess: function(transport)
//    {
//        var response = transport.responseText || "no response text";
//        alert("Success! \n\n" + response);
//    },
//    onFailure: function() { alert('Something went wrong...'); }
//});

//new Ajax.Request('index.php', {
//    method: 'get',
//    parameters: {company: 'example', limit: 12}
//});

new Ajax.Request('index.php', {
    method:'get',
    parameters: {company: 'example', limit: 12},
    onSuccess: function(transport, json){
        alert(json ? Object.inspect(json) : "no JSON object");
    },
    onComplete:function()
    {
        //alert('200');
    }
});

//var exam = document.getElementById('exam');
//$(exam).hide().toggle();
//console.log(exam);
//console.log($('exam'));
//function a()
//{
//    this.aa = function()
//    {
//        alert("a");
//    }
//}
//function b()
//{
//    console.log(a.call(this));
//}
//var c = new b();
//c.aa();
//console.log(Object);
//console.log(Object.prototype.toString.call(null)); //[object Null]
//Object.prototype.toString.call(undefined);
//Object.prototype.toString.call("abc");
//Object.prototype.toString.call(123);
//Object.prototype.toString.call(true);
