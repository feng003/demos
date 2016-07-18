/**
 * Created by zhang on 2016/7/14.
 */

var express = require('express');
var path    = require('path');
var http    = require("http");
var favicon = require('serve-favicon');
var logger  = require('morgan');
var bodyParser   = require('body-parser');
var app    = express();

var routes = require('./routes/index');
var api    = require('./routes/api');

app.get("/api",api.index);

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


//app.get("*",function(req,res){
//    res.end('404!');
//});

app.set('port',process.env.PORT || 8080);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);
//app.use('/user', user);

app.use(express.static(__dirname + "/public"));

app.listen(app.get('port'));
