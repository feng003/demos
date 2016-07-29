/**
 * Created by zhang on 2016/7/29.
 */

var util = require('util');


var Codes = {
    RequestError: 'RequestError',
    NotFound: 'NotFound',
    DBError: 'DBError',
    ServerError: 'ServerError',
    MongoPoolError: 'MongoPoolError'
};

function Execption(code,msg){
    if(!(this instanceof Execption)){
        return new Exception(code,msg);
    }

    Error.captureStackTrace(this,Execption);
    this.code = code;
    this.message = msg || "Exception:" + "[" + code + "]";
}

util.inherits(Execption,Error);

Object.keys(Codes).forEach(function(key){
    module.exports[key] = Codes[key];
});