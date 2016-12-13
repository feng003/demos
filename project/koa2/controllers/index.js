/**
 * Created by zhang on 2016/12/13.
 */

var fn_index = async(ctx,next)=>{
    ctx.render('index.html',{
        title:'welcome'
    });
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
