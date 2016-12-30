/**
 * Created by zhang on 2016/12/30.
 */

const model = require('../model');
var   Message   = model.Message;

var fn_message = async(ctx,next)=>{

    var data = await Message.findAll({order:[['username','DESC']]});
    //await Message.findOne().then(function(msg){
    //    console.log(msg.dataValues);
    //    data = msg.dataValues;
    //});
    var msg = [];
    for(var v in data){
        msg[v] = data[v]['dataValues'];
        //console.log(msg);
    }

    //console.log('message '+ JSON.stringify(ctx.response));
    ctx.render('message.html',{'title':'message','msg':msg});
};

var fn_addMessage = async(ctx,next)=>{
    //console.log('message '+ JSON.stringify(ctx.request));
    var username = ctx.request.body.username || "",
        title    = ctx.request.body.title || "",
        context  = ctx.request.body.context || "",
        email    = ctx.request.body.email || "";

    Message.create({
        email:email,
        username:username,
        title:title,
        context:context
    }).then(function(p){
        console.log('created.' + JSON.stringify(p));
    }).catch(function(err){
        console.log('failed: '+ err);
    });
    ctx.redirect('/message');
    ctx.status = 301;

    //await next();
};

module.exports = {
    'GET /message':fn_message,
    'POST /addMessage':fn_addMessage
};
