通过回调表达程序异步和管理并发的两个主要缺陷：缺乏顺序下和可信任性

> 什么是Promise

1. 未来值
        
        现在值与将来值
        
        Promise值
        
        function add(xPromise,yPromise){
            return Promise.all([xPromise,yPromise])
                    .then(function(values){
                        return values[0] + values[1];
                    });
        }
        
        add(fetchX(),fetchY())
        .then(function(sum){
            console.log(sum);
        });
        
2. 完成事件

> 具有then方法的鸭子类型

> Promise 信任问题

> 链式流

> 错误处理

> Promise 模式

> Promise API

> Promise 局限性