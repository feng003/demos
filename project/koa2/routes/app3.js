/**
 * Created by zhang on 2016/12/12.
 */

const Koa = require('koa');

const app = new Koa();

//返回的是函数
const router = require('koa-router')();

app.use(async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    await next();
});

router.get('/hello/:name',async(ctx,next)=>{
    var name = ctx.params.name;
    ctx.response.body = `<h1>hello ${name}!</h1>`;
});

router.get('/',async(ctx,next)=>{
    ctx.response.body = "<h1>hello index</h1>";
});

app.use(router.routes());

app.listen(3300);
console.log('app started at port 3300');
