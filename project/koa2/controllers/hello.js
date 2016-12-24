/**
 * Created by zhang on 2016/12/13.
 */
var fs = require('fs');

var fn_hello = async(ctx,next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    var name = ctx.params.name;
    //var urlInfo = ctx.request;
    //console.log(urlInfo);
    ctx.response.body = `<h1>hello ${name}! </h1>`;
    await next();
};

var fn_danmu = async(ctx,next)=>{
    var config = JSON.parse(fs.readFileSync(__dirname + './../public/config.json'));

    //fs.watchFile('../txt.txt',function(err){
    //    if(err) throw err;
    //    console.log("file write complete");
    //});
    ctx.render('danmu.html',{
        title:'danmu',
        sizes:config.sizes,
        modes:config.modes,
        colors:config.colors,
        inits:config.inits
    });
};

module.exports = {
    'GET /hello/:name':fn_hello,
    'GET /danmu':fn_danmu
};
