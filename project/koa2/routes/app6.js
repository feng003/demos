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

const templating = require('./templating');

const cryptoFun = require('./cryptoFun');
console.log(cryptoFun.aesEncrypto('123','456'));
console.log(cryptoFun.aesDecrypto('bd7047c784edd9e8f667da0de76ab375','456'));

const Sequelize = require('sequelize');

const config = require('./config');

var sequelize = new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:30000
    }
});

var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    gender: Sequelize.BOOLEAN,
    birth: Sequelize.STRING(10),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
    timestamps: false
});

var now = Date.now();
(async () => {
    var dog = await Pet.create({
        id: 'd-' + now,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
        createdAt: now,
        updatedAt: now,
        version: 0
    });
    console.log('created: ' + JSON.stringify(dog));

    var pets = await Pet.findAll({
        where: {
            name: 'Odie'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
        //console.log(p);
        p.gender = true;
        p.updatedAt = Date.now();
        p.version ++;
        await p.save();
        if (p.version === 3) {
            await p.destroy();
            console.log(`${p.name} was destroyed.`);
        }
    }
})();

//middleware
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//注意顺序问题
app.use(bodyParser());

const isProduct = process.env.NODE_EV === 'production';
app.use(templating('views',{
    noCache:!isProduct,
    watch:!isProduct
}));

app.use(controller());

app.listen(3300);
console.log('app started at port 3300');
