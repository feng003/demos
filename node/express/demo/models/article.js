/**
 * Created by zhang on 2016/7/28.
 */

var marked = require('marked');
var moment = require('moment');

var ObjectID  = require('mongodb').ObjectID;
var exception = require('../lib/exception');
var mongoPool = require('../lib/mongoPool');

exports.save = function(user,data,cb){
    var doc = {
        name:user.username,
        time:Date.now(),
        title:data.title,
        content:data.content,
        tags:data.tag
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

exports.getId = function(id,cb){
    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client
            .collection('articles')
            .findOne({"_id":new ObjectID(id)},function(err,doc){
                if(err){
                    mongoPool.release(client);
                    return cb(exception(exception.DBError,err.message));
                }
                if(!doc){
                    mongoPool.release(client);
                    return cb(exception(exception.NotFound, 'NotFound ' + id));
                }
                doc.content = marked(doc.content);
                doc.time    = moment(doc.time).format('YYYY-MM-DD HH:MM');
                mongoPool.release(client);
                cb(null,doc);
            });
    });
};

exports.getOne = function(id,cb){
    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client
            .collection('articles')
            .findAndModify({"_id":new ObjectID(id)},[],{"$inc":{pv:1}},{new:true},function(err,doc){
                if(err){
                    mongoPool.release(client);
                    return cb(exception(exception.DBError,err.message));
                }
                if(!doc){
                    mongoPool.release(client);
                    return cb(exception(exception.NotFound, 'NotFound ' + id));
                }

                console.log(doc.title);
                doc.content = doc.content;
                doc.time = moment(doc.time).format("YYYY-MM-DD HH:mm");
                //doc.comments.forEach(function(comment){
                //    comment.content = marked(comment.content);
                //    comment.time = moment(comment.time).format('YYYY-MM-DD HH:mm');
                //});
                mongoPool.release(client);
                cb(null,doc);
            })
    })
};

exports.getTen = function(name,page,cb){
    var query = {};
    if(name){
        query.name = name;
    }
    mongoPool.acquire(function(err,client){
        if(err){
            return cb(exception(exception.MongoPoolError,err.message));
        }
        client.collection('articles')
              .find(query)
              .sort({time:-1})
              .skip((page-1)*10)
              .limit(10)
              .toArray(function(err,docs){
                  if(err){
                      mongoPool.release(client);
                      return cb(exception(exception.DBError,err.message))
                  }
                  docs.forEach(function(doc){
                      doc.content = marked(doc.content);
                      doc.time = moment(doc.time).format('YYYY-MM-DD HH:MM');
                  });
                  mongoPool.release(client);
                  cb(null,docs);
              })
    })
};