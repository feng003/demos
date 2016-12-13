/**
 * Created by zhang on 2016/12/13.
 */

var fn_hello = async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    var name = ctx.params.name;
    //var urlInfo = ctx.request;
    //console.log(urlInfo);
    ctx.response.body = `<h1>hello ${name}! </h1>`;
    await next();
};

module.exports = {
    'GET /hello/:name':fn_hello
};
