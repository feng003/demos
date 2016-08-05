/**
 * Created by zhang on 2016/7/14.
 */
    var express = require('express');
    var router   = express.Router();
    var md5 = require('../lib/md5');
    var User = require('../models/user.js');
    var Article = require('../models/article.js');

    function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('info',"未登陆");
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req,res,next){
        if(req.session.user){
            req.flash('info',"已登陆");
            return res.redirect('back');
        }
        next();
    }

    //Express框架等于在http模块之上，加了一个中间层
    router.get('/',function(req,res){
        console.log( req.session.user);
        var username = req.session.user?req.session.user.username:'';
        res.render("index",{
            message:"hello home",
            title:"home",
            user: req.session.user,
            flash:username + req.flash('info').toString()});
    });

    router.get('/login',checkNotLogin);
    router.get('/login',function(req,res){
        res.render('login',{
            message:"hello login",
            title:"login",
            user: req.session.user,
            flash:"登陆"});
    });

    router.post('/login',checkNotLogin);
    router.post('/login', function (req, res,next) {
        var username = req.body.username;
        var pwd = req.body.pwd;
        User.get(username,function(err,user){
            if(err){
                return next(err);
            }
            if(!user){
                req.flash('info',"用户不存在");
                return res.redirect('/login');
            }
            if(user.pwd != md5(pwd)){
                req.flash('info',"密码错误");
                return res.redirect('/login');
            }
            delete user.pwd;
            req.session.user = user;
            req.flash('info',"登陆成功");
            res.redirect('/');
        });
    });

    router.get('/reg',checkNotLogin);
    router.get('/reg',function(req,res){
        res.render('reg',{
            message:"hello reg",
            title:"reg",
            user:req.session.user,
            flash:"注册"});
    });

    router.post('/reg',checkNotLogin);
    router.post('/reg', function (req, res) {
        var body = req.body;
        var username = body.username;
        var pwd  = body.pwd;
        var re_pwd = body['re_pwd'];
        var email = body.email;
        if(pwd != re_pwd){
            req.flash('info',"两次输入密码不一致");
            return res.redirect('/reg');
        }

        User.get(username,function(err,user){
            if(err){
                return next(err);
            }
            if(user){
                req.flash('info','用户已存在');
                return res.redirect('/reg');
            }
            var newUser = {
                username:username,
                pwd:md5(pwd),
                email:email
            };

            User.save(newUser,function(err){
                if(err){
                    return next(err);
                }
                delete newUser.pwd;
                req.session.user = newUser;
                req.flash("info","注册成功");
                res.redirect('/');
            });
        });
    });

    router.get('/logout',checkLogin);
    router.get('/logout',function(req,res){
        req.session.user = null;
        req.flash('info','退出登陆');
        res.redirect('/');
    });

    router.get('/logout',checkLogin);
    router.get("/article",function(req,res){
        console.log(req.session.user.username);
        res.render("article",{
            message:"文章首页",
            title:"文章首页",
            user:req.session.user,
            flash:"文章首页"});
    });

    router.post('/logout',checkLogin);
    router.post('/article', function (req, res) {
        Article.save(req.session.user,req.body,function(err){
            if(err){
                return next(err);
            }
            req.flash('info',"发布成功");
            res.redirect('/');
        })
    });

    router.get("/about",function(req,res){
        var body = "hello node";
        res.setHeader("Content-Type","text/plain");
        res.setHeader("Content-Length",body.length);
        res.end(body);
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

    router.get('/test',function(req,res){
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            db.close();
        });
    });

    router.get('/insert',function(req,res){
        var insertDocument = function(db, callback) {
            db.collection('restaurants').insertOne( {
                "address" : {
                    "street" : "2 Avenue",
                    "zipcode" : "10075",
                    "building" : "1480",
                    "coord" : [ -73.9557413, 40.7720266 ]
                },
                "borough" : "Manhattan",
                "cuisine" : "Italian",
                "grades" : [
                    {
                        "date" : new Date("2014-10-01T00:00:00Z"),
                        "grade" : "A",
                        "score" : 11
                    },
                    {
                        "date" : new Date("2014-01-16T00:00:00Z"),
                        "grade" : "B",
                        "score" : 17
                    }
                ],
                "name" : "Vella",
                "restaurant_id" : "41704620"
            }, function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a document into the restaurants collection.");
                callback();
            });
        };

        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            insertDocument(db, function() {
                db.close();
            });
        });
    });

    router.get('/find',function(req,res){
        var findRestaurants = function(db, callback) {
            var cursor = db.collection('restaurants').find();
            cursor.each(function(err, doc) {
                assert.equal(err, null);
                if (doc != null) {
                    console.dir(doc);
                } else {
                    callback();
                }
            });
        };
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            findRestaurants(db, function() {
                db.close();
            });
        });
    });

    module.exports = router;