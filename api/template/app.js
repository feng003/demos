/**
 * Created by zhang on 2016/12/23.
 */

    //version 1
//var render = function(str,data){
//    var tpl = str.replace(/<%=([\s\S]+?)%>/g,function(match,code){
//        return " '+ obj." + code +" +'";
//    });
//
//    tpl = "var tpl='"+tpl+"' \n return tpl;";
//    var complied = new Function('obj',tpl);
//    return complied(data);
//};


// & < > " ' 不确定要输入的html标签的字符最好都转义
var escape = function(html){
    return String(html).replace(/&(?!\w+)/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039');
};

// version 2  with & new Function()
var render = function(str,data){
    var tpl = str.replace('/\n/g','\\n') //替换换行符
        .replace(/<%=([\s\S]+?)%>/g,function(match,code){
            //转义
            return " '+ obj." + code +" +'";
        }).replace(/<%-([\s\S]+?)%>/g,function(match,code){
            //正常输出
            return "'+ " + code + " +'"
        });
    //tpl = "var tpl='"+tpl+"' \n return tpl;";
    tpl = "tpl= '" + tpl + "' ";
    tpl = 'var tpl ="";\nwith(obj){'+tpl+'}\nreturn tpl;';
    console.log(tpl);
    var complied = new Function('obj','escape',tpl);
    return complied(data);
    //return new Function('obj','escape',tpl);
};

var tpl = 'hello <%=username%>';

console.log(render(tpl,{username:'<script>alert("xss")</script>'}));