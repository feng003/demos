/**
 * Created by zhang on 2016/7/14.
 */
    var express = require('express');
    var MongoClient  = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var router  = express.Router();
    var blogEngine = require('./blog');
    var url = 'mongodb://localhost:27017/test';
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