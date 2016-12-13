/**
 * Created by zhang on 2016/12/12.
 */

const Koa = require('koa');

const app = new Koa();

app.use(async(ctx,next)=>{
    if(ctx.request.path === '/'){
        ctx.response.body = 'index page';
    }else{
        await next();
    }
});

app.use(async(ctx,next)=>{
    if(ctx.request.path === '/test'){
        ctx.response.body = 'test page';
    }else{
        await next();
    }
});

app.listen(3300);
console.log('app started at port 3300');
