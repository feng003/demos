/**
 * Created by zhang on 2016/7/28.
 */
var exception = require('../lib/exception');
var mongoPool = require('../lib/mongoPool');

exports.save = function(doc,cb){
    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client
              .collection('users')
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