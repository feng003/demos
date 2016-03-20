/**
 * Created by zhang on 2016/3/12.
 */

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName)
{
    // your implement
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName)
{
    // your implement
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode)
{
    // your implement
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element)
{
    // your implement
}

// 实现一个简单的Query
// querySelector   querySelectorAll
function $(selector)
{
    return document.querySelector(selector);
}

// 可以通过id获取DOM对象，通过#标示，例如
$("#adom"); // 返回id为adom的DOM对象

// 可以通过tagName获取DOM对象，例如
$("a"); // 返回第一个<a>对象

// 可以通过样式名称获取DOM对象，例如
$(".classa"); // 返回第一个样式定义包含classa的对象

// 可以通过attribute匹配获取DOM对象，例如
$("[data-log]"); // 返回第一个包含属性data-log的对象

$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

// 可以通过简单的组合提高查询便利性，例如
$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象
