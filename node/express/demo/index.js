/**
 * Created by zhang on 2016/7/14.
 */

var express = require('express');
var http = require("http");
var path = require('path');
var app  = express();

//var routes = require('./routes')(app);

//app.use(function(req,res,next){
//    console.log(req.method + '@request@'+ req.url);
//    next();
//});
//app.use(function(req,res){
//    res.writeHead(200,{"Content-Type":"text/plain"});
//    res.end(req + "Hello express \n");
//});

//app.use(function(req,res,next){
//    if(req.url == "/"){
//        res.writeHead(200,{"Content-Type":"text/plain"});
//        res.end("welcome to home");
//    }else{
//        next();
//    }
//});
//
//app.use(function(req,res,next){
//    if(req.url == "/about"){
//        res.writeHead(200,{"Content-Type":"text/plain"});
//        res.end("welcome to about");
//    }else{
//        next();
//    }
//});
//app.use(function(req,res){
//    res.writeHead(404,{"Content-Type":"text/plain"});
//    res.end('404 error! \n');
//});

//app.all("*",function(req,res,next){
//    res.writeHead(200,{"Content-Type":"text/plain"});
//    next();
//});

app.get('/',function(req,res){
    //res.end('welecome to home');
    res.render("index",{message:"hello home",title:"home"});
});

app.get("/about",function(req,res){
    res.end('welecome to about');
});

app.get("/hello/:who?",function(req,res){
    if(req.params.who){
        res.end("hello "+ req.params.who + ".");
    }else{
        res.end("hello Guest");
    }
});

//app.get("*",function(req,res){
//    res.end('404!');
//});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.static(__dirname + "/public"));
app.listen(8080);
