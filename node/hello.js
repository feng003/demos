/**
 * Created by zhang on 2016/7/25.
 */
function hello(){
    console.log("hello node");
}

function greet(name){
    console.log("hello" + name);
}

module .exports = {
    hello:hello,
    greet:greet
};