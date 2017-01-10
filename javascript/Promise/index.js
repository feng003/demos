/**
 * Created by zhang on 2017/1/5.
 */
//TODO 嵌套回调与链式回调

listen("click",function handler(evt){
    setTimeout(function request(){
        ajax("http://url.com",function response(text){
            if(text == 'hello'){
                handler();
            }else if(text == 'world'){
                request();
            }
        });
    },2000);
});

doA(function(){
    doB();
    doC(function(){
        doD();
    });
    doE();
});
doF();

function add(xPromise,yPromise){
    return Promise.all([xPromise,yPromise])
            .then(function(values){
                return values[0] + values[1];
            });
}

add(fetchX(),fetchY())
.then(
    function(sum){
        console.log(sum);
    },

    function(err){
        console.error(err);
    }
);

var p = Promise.resolve(21);

var p2 = p.then(function(v){
    console.log(v);

    return new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve(v*2);
        },2000);
    });
});

p2.then(function(v){
    console.log(v);
});

function delay(time){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,time);
    });
}
delay(1000)
    .then(function step2(){
        console.log('step2 after 1000ms');
        return delay(2000);
    })
    .then(function step3(){
        console.log('step3 after 2000ms');
        return delay(3000);
    })
    .then(function step4(){
        console.log('step4 after 4000ms');
        return delay(4000);
    })