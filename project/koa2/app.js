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

const nunjucks = require('nunjucks');

function createEnv(path,opts)
{
    var autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views',{noCache:noCache,watch:watch,}),
            {autoescape:autoescape,throwOnUndefined:throwOnUndefined});
    if(opts.filters)
    {
        for(var f in opts.filters){
            env.addFilter(f,opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views',{
    watch:true,
    filters:{
    hex:function(n){
            return '0x' + n.toString(16);
        }
    }
});

//var s = env.render('hello.html', { name: '小明' });
//console.log(s);

//注意顺序问题
app.use(bodyParser());

app.use(controller());

app.listen(3300);
console.log('app started at port 3300');
