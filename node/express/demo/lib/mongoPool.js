/**
 * Created by zhang on 2016/7/29.
 */

var MongoClient = require('mongodb').MongoClient;
var poolModule = require('generic-pool');

var url = "mongodb://localhost:27017/user";
var mongoPool = poolModule.Pool({
    name     : 'mongodb',
    create   : function(callback) {
        MongoClient.connect(url, {
            server: {poolSize: 1},
            native_parser: true
        },callback);
    },
    destroy  : function(client) { client.end(); },
    max      : 5,
    min      : 1,
    idleTimeoutMillis : 30,
    log : false
});

module.exports = mongoPool;