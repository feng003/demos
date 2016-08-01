/**
 * Created by zhang on 2016/7/28.
 */

var ObjectID  = require('mongodb').ObjectID;
var exception = require('../lib/exception');
var mongoPool = require('../lib/mongoPool');

exports.save = function(user,data,cb){

    var doc = {
        name:user.username,
        time:Date.now(),
        title:data.title,
        content:data.content
    };

    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client
              .collection('articles')
              .insert(doc,function(err,res){
                  if(err){
                      mongoPool.release(client);
                      return cb(exception(exception.DBError,err.message));
                  }
                  mongoPool.release(client);
                  cb(null,res);
              });
    });
};

exports.get = function(name,cb){
    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client
            .collection('users')
            .findOne({"username":name},function(err,res){
                if(err){
                    mongoPool.release(client);
                    return cb(exception(exception.DBError,err.message));
                }
                mongoPool.release(client);
                cb(null,res);
            });
    });
};