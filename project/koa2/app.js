/**
 * Created by zhang on 2016/12/12.
 */
"use strict";
const Koa = require('koa');

const app = new Koa();

//koa-bodyparser  解析原始request请求
const bodyParser = require('koa-bodyparser');

const controller = require('./controller');
//console.log(controller());

const templating = require('./templating');

const cryptoFun = require('./cryptoFun');
console.log(cryptoFun.aesEncrypto('123','456'));
console.log(cryptoFun.aesDecrypto('bd7047c784edd9e8f667da0de76ab375','456'));

//middleware
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//注意顺序问题
app.use(bodyParser());

const isProduct = process.env.NODE_EV === 'production';
app.use(templating('views',{
    noCache:!isProduct,
    watch:!isProduct
}));

app.use(controller());

app.listen(3300);
console.log('app started at port 3300');
