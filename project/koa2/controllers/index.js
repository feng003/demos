/**
 * Created by zhang on 2016/12/13.
 */

var fn_index = async(ctx,next)=>{
    ctx.response.body = `<h1>hello index</h1>
        <form action="/signin" method="post">
            <p>Name: <input type="text" name="name" value="koa"></p>
            <p>Pwd: <input type="text" name="pwd" value="123456"></p>
            <p> <input type="submit" value="submit"> </p>
        </form>`;
};

var fn_signin = async(ctx,next)=>{
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
};

module.exports = {
    'GET /':fn_index,
    'POST /signin':fn_signin
};
