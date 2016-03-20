/**
 * Created by zhang on 2016/3/12.
 */

/**
 *
 * @param url
 * @param options   options是一个对象，里面可以包括的参数为：
                         type: post或者get，可以有一个默认值
                         data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
                         onsuccess: 成功时的调用函数
                         onfail: 失败时的调用函数
 */

function ajax(url, options)
{
    // your implement
}

// 使用示例：
ajax(
    'http://localhost:8080/server/ajaxtest',
    {
        data: {
            name: 'simon',
            password: '123456'
        },
        onsuccess: function (responseText, xhr) {
            console.log(responseText);
        }
    }
);
