/**
 * Created by zhang on 2016/3/12.
 */
// 给一个element绑定一个针对event事件的响应，响应函数为listener
function addEvent(element, event, listener)
{
    // your implement
}

// 例如：
function clicklistener(event)
{

}
addEvent($("#doma"), "click", a);

// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener)
{
    // your implement
}

// 实现对click事件的绑定
function addClickEvent(element, listener)
{
    // your implement
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener)
{
    // your implement
}

// 先简单一些
function delegateEvent(element, tag, eventName, listener)
{
    // your implement
}

$.delegate = delegateEvent;

// 使用示例
// 还是上面那段HTML，实现对list这个ul里面所有li的click事件进行响应
$.delegate($("#list"), "li", "click", clickHandle);

$.on(selector, event, listener)
{
    // your implement
}

$.click(selector, listener)
{
    // your implement
}

$.un(selector, event, listener)
{
    // your implement
}

$.delegate(selector, tag, event, listener)
{
    // your implement
}

// 使用示例：
$.click("[data-log]", logListener);
$.delegate('#list', "li", "click", liClicker);
