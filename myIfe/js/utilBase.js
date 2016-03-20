/**
 * Created by zhang on 2016/3/6.
 */

// 判断arr是否为一个数组，返回一个bool值
/**
 *  Object.isArray(object) -> Boolean
 *  - object (Object): The object to test.
 *
 *  Returns `true` if `object` is an [[Array]]; `false` otherwise.
 *
 *  ##### Examples
 *
 *      Object.isArray([]);
 *      //-> true
 *
 *      Object.isArray({ });
 *      //-> false
 **/
function isArray(obj)
{
    return Object.prototype.toString.call(obj) === '[object Array]';
}


// 判断fn是否为一个函数，返回一个bool值
/**
 *  Object.isFunction(object) -> Boolean
 *  - object (Object): The object to test.
 *
 *  Returns `true` if `object` is of type [[Function]]; `false` otherwise.
 *
 *  ##### Examples
 *
 *      Object.isFunction($);
 *      //-> true
 *
 *      Object.isFunction(123);
 *      //-> false
 **/
function isFunction(fn)
{
    return Object.prototype.toString.call(fn)=== '[object Function]';
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
/**
 *  Object.clone(object) -> Object
 *  - object (Object): The object to clone.
 *
 *  Creates and returns a shallow duplicate of the passed object by copying
 *  all of the original's key/value pairs onto an empty object.
 *
 *  Do note that this is a _shallow_ copy, not a _deep_ copy. Nested objects
 *  will retain their references.
 *
 *  ##### Examples
 *
 *      var original = {name: 'primaryColors', values: ['red', 'green', 'blue']};
 *      var copy = Object.clone(original);
 *
 *      original.name;
 *      // -> "primaryColors"
 *      original.values[0];
 *      // -> "red"
 *      copy.name;
 *      // -> "primaryColors"
 *
 *      copy.name = "secondaryColors";
 *      original.name;
 *      // -> "primaryColors"
 *      copy.name;
 *      // -> "secondaryColors"
 *
 *      copy.values[0] = 'magenta';
 *      copy.values[1] = 'cyan';
 *      copy.values[2] = 'yellow';
 *      original.values[0];
 *      // -> "magenta" (it's a shallow copy, so they share the array)
 **/
function cloneObject(object)
{
    return extend({ }, object);
}

/**
 *  Object.extend(destination, source) -> Object
 *  - destination (Object): The object to receive the new properties.
 *  - source (Object): The object whose properties will be duplicated.
 *
 *  Copies all properties from the source to the destination object. Used by Prototype
 *  to simulate inheritance (rather statically) by copying to prototypes.
 *
 *  Documentation should soon become available that describes how Prototype implements
 *  OOP, where you will find further details on how Prototype uses [[Object.extend]] and
 *  [[Class.create]] (something that may well change in version 2.0). It will be linked
 *  from here.
 *
 *  Do not mistake this method with its quasi-namesake [[Element.extend]],
 *  which implements Prototype's (much more complex) DOM extension mechanism.
 **/
function extend(destination, source)
{
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

console.log(tarObj.a);      // 1
console.log(tarObj.b.b1[0]);    // "hello"

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
// 用的是hash表,把已经出现过的通过下标的形式存入一个object内。下标的引用要比用indexOf搜索数组快的多。
// http://www.cnblogs.com/fumj/archive/2012/09/09/2677711.html
function uniqArray(arr)
{
    var n={},r=[]; //n为hash r临时数组
    for(var i=0;i<arr.length;i++)
    {
        if(!n[arr[i]])
        {
            n[arr[i]] = true;
            r.push(arr[i]);
        }
    }
    return r;
}

// 使用示例
var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
console.log(b); // [1, 3, 5, 7]

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串

//stringObject.replace(regexp/substr,replacement) 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
function simpleTrim(str)
{
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str)
{
    // your implement
}

// 使用示例
//var str = '   hi!  ';
//str = trim(str);
//console.log(str); // 'hi!'

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn)
{
    for (var i in arr)
    {
        fn(arr[i], i);
    }
}

// 其中fn函数可以接受两个参数：item和index

// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item)
{
    console.log(item)
}
each(arr, output);  // java, c, php, html

// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item, index)
{
    console.log(index + ': ' + item)
}
each(arr, output);  // 0:java, 1:c, 2:php, 3:html

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj)
{

}

// 使用示例
var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
};

console.log(getObjectLength(obj)); // 3

// 判断是否为邮箱地址
function isEmail(emailStr)
{
    // your implement
}

// 判断是否为手机号
function isMobilePhone(phone)
{
    // your implement
}