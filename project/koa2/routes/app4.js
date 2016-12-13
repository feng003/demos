/**
 * Created by zhang on 2016/12/12.
 */

const Koa = require('koa');

const app = new Koa();

//返回的是函数
const router = require('koa-router')();

//koa-bodyparser  解析原始request请求
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    await next();
});

router.get('/',async(ctx,next)=>{
    ctx.response.body = `<h1>hello index</h1>
        <form action="/signin" method="post">
            <p>Name: <input type="text" name="name" value="koa"></p>
            <p>Pwd: <input type="text" name="pwd" value="123456"></p>
            <p> <input type="submit" value="submit"> </p>
        </form>`;
});

// post
router.post('/signin',async(ctx,next)=>{
    var name = ctx.request.body.name || "",
        pwd = ctx.request.body.pwd || "";
    console.log("name:"+name+", pwd:"+pwd);
    if(name =='koa' && pwd === '123456')
    {
        ctx.response.body = `<h2>welcome ${name} !</h2>`
    }else{
        ctx.response.body = ` <h2>Login failed</h2>
            <p><a href="/"> Try again</a></p>`;
    }
});

app.use(router.routes());

app.listen(3300);
console.log('app started at port 3300');
