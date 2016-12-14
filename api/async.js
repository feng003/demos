/**
 * Created by zhang on 2016/12/12.
 */
    //构建以生成器作为异步流程控制的代码模式
var x = 1;

//function *foo(){
//    x++;
//    console.log('x::',x);
//    yield ;
//    console.log("x:",x);
//}
//function bar(){
//    x++;
//}
//
//var it = foo(); //构造迭代器
//it.next();
//console.log(x); //2
//bar();
//console.log(x); //3
//it.next();

function *foo(x){
    var y = x*(yield "hello");
    return y;
}

var it = foo(6);

//启动生成器时一定要用不带参数的 next()
var res = it.next();
console.log(res.value); //hello

res = it.next(7);
console.log(res.value); //42