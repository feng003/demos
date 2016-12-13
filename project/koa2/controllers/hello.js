/**
 * Created by zhang on 2016/12/13.
 */

var fn_hello = async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    await next();
};

module.exports = {
    'GET /hello/:name':fn_hello
};
