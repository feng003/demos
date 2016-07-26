/**
 * Created by zhang on 2016/7/14.
 */
    var express = require('express');
    var router  = express.Router();
    var blogEngine = require('./blog');
    //Express框架等于在http模块之上，加了一个中间层
    router.get('/',function(req,res){
        var sess = req.session;
        console.log(sess);
        if(sess.views){
            sess.views++;
            res.setHeader("Content-Type","text/html");
            res.write('<p>'+ sess.views +'</p>');
            res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
            res.end();
        }else{
            sess.views = 1;
            res.end('welcome to the session demo');
        }

        //res.render("login",{message:"hello home",title:"home",entries:blogEngine.getBlogEntries()});
    });

    router.get("/about",function(req,res){
        var body = "hello node";
        res.setHeader("Content-Type","text/plain");
        res.setHeader("Content-Length",body.length);
        res.end(body);
    });

    router.get("/article/:id",function(req,res){
        var entry = blogEngine.getBlogEntry(req.params.id);
        res.render("article",{title:entry.title,blog:entry});
    });

    router.get("/hello/:who?",function(req,res){
        if(req.params.who){
            res.end("hello "+ req.params.who + ".");
        }else{
            res.end("hello Guest");
        }
    });

    router.get('/admin',function(req,res){
        //res.send('hello admin');
        res.render("login",{message:"hello home",title:"home",entries:blogEngine.getBlogEntries()});
    });

    module.exports = router;