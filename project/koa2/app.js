/**
 * Created by zhang on 2016/12/12.
 */
"use strict";
const Koa = require('koa');

const app = new Koa();

//koa-bodyparser  解析原始request请求
const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

app.use(bodyParser());

app.use(controller());

app.listen(3300);

console.log('app started at port 3300');
