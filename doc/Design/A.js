/**
 * Created by zhang on 2016/3/31.
 */
"use strict";
var Z = {
    //array
    A : {
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
        isArray : function (obj)
        {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        /**
         * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
         * @param arr
         * @param fn
         */
        each : function (arr, fn)
        {
            for (var i in arr)
            {
                fn(arr[i], i);
            }
        },

        /**
         * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
         * 用的是hash表,把已经出现过的通过下标的形式存入一个object内。下标的引用要比用indexOf搜索数组快的多。
         * http://www.cnblogs.com/fumj/archive/2012/09/09/2677711.html
         * @param arr
         * @returns {Array}
         */
        uniqArray : function (arr)
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
    },
    //base function
    B : {
        /**
         *
         * @param url
         * @param callback
         */
        loadScript : function (url,callback)
        {
            var script = document.createElement('script');
            script.type = "text/javascript";
            if(script.readyState)
            {
                script.onreadystatechange = function()
                {
                    if(script.readyState == 'loaded' || script.readyState == 'complete')
                    {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }else{
                script.onload = function()
                {
                    callback();
                }
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    },
    //dom
    D : {
        $ : function (selector)
        {
            return document.querySelector(selector);
        }
    },
    //function
    F : {
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
        isFunction : function (fn)
        {
            return Object.prototype.toString.call(fn)=== '[object Function]';
        }
    },
    //object
    O : {},
    //string
    S : {

        /**
         * 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
         * stringObject.replace(regexp/substr,replacement) 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
         * @param str
         * @returns {*}
         */
        simpleTrim : function (str)
        {
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        }
    },
    //
    Util:{},
    //
    Tool:{},
    //ajax
    Ajax:{}
};

/**
 * 外观模式实现
 * @param dom
 * @param type
 * @param fn
 */
function addEvent(dom,type,fn)
{
    if(dom.addEventListener)
    {
        dom.addEventListener(type,fn,false);
    }else if(dom.attachEvent){
        dom.attachEvent('on'+type,fn);
    }else{
        dom['on'+type] = fn;
    }
}
//兼容性
//获取事件对象
var getEvent = function(event)
{
    //标准浏览器返回event ie下 window.event
    return event || window.event;
}
//获取元素
var getTarget = function(event)
{
    var event = getEvent(event);
    return event.target || event.srcElement;
}
//阻止默认行为
var preventDefault = function(event)
{
    var event = getEvent(event);
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}
//观察者模式
var Observer = (function(){
    var _message = {};
    return {
        regist:function(type,fn){
            if(typeof _message[type] === 'undefined')
            {
                _message[type] = [fn];
            }else{
                _message[type].push(fn);
            }
        },
        fire:function(type,args){
            if(!_message[type])
            {
                return;
            }
            var events = {type:type,args:args||{}};
            i = 0,len = _message[type].length;
            for(;i<len;i++)
            {
                _message[type][i].call(this,events);
            }
        },
        remove:function(type,fn){
            if(_message[type] instanceof  Array)
            {
                var i = _message[type].length-1;
                for(;i>=0;i--)
                {
                    _message[type][i] === fn && _message[type].splice(i,1);
                }
            }
        }
    }
})();

/**
 * 原型继承
 * 对模板引用类型的属性实质上进行了  浅复制（引用类型属性共享）
 * @returns {F}
 */
function prototypeExtend()
{
    var F = function(){},
        args = arguments,   //模板对象参数序列
        i = 0,
        len = args.length;
    for(;i<len;i++)
    {
        //遍历每个模板对象中的属性
        for(var j in args[i])
        {
            //将这些属性复制到缓存类原型中
            F.prototype[j] = args[i][j];
        }
    }
    return new F();
}
