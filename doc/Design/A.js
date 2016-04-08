/**
 * Created by zhang on 2016/3/31.
 */

var A = {
    Util:{},
    Tool:{},
    Ajax:{},
    other:{}
};

var $ = function(id)
{
    return document.getElementById(id);
}

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
