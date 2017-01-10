/**
 * Created by zhang on 2017/1/6.
 */

"use strict";

function $http(url){
    var core = {
        ajax:function(method,url,args){
            var promise = new Promise( function(resolve,reject){
                var client = new XMLHttpRequest();
                var uri = url;
                if(args && (method ==='POST' || method === "POST")){
                    uri += "?";
                    var argcount = 0;
                    for(var key in args){
                        if(args.hasOwnProperty(key)){
                            if(argcount++){
                                uri += "&";
                            }
                            uri += encodeURIComponent(key)+ '=' + encodeURIComponent(args[key]);
                        }
                    }
                }
                client.open(method,uri);
                client.send();

                client.onload = function(){
                    if(this.status>=200 && this.status<300){
                        resolve(this.response);
                    }else{
                        reject(this.statusText);
                    }
                };

                client.onerror = function(){
                    reject(this.statusText);
                };
            });
            return promise;
        }
    };

    return {
        'get' :function(args){
            return core.ajax("GET",url,args);
        },
        'post' :function(args){
            return core.ajax("POST",url,args);
        },
        'put' :function(args){
            return core.ajax("PUT",url,args);
        },
        'delete' :function(args){
            return core.ajax("DELETE",url,args);
        }
    };
};

// Promise.all(iterable); 当所有在可迭代参数中的 promises 已完成，或者第一个传递的 promise（指 reject）失败时，返回 promise。
// Promise.all 等待所有代码的完成（或第一个代码的失败）。

//Promise.resolve(value);   返回一个以给定值解析后的Promise对象
//Promise.resolve(promise);
//Promise.resolve(thenable);


//Promise.reject(reason); 返回一个用reason拒绝的Promise

//Promise.race(iterable); 返回一个 promise
