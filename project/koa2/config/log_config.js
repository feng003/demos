/**
 * Created by User on 2017/8/20.
 */

var path = require('path');

//错误日志输出完整路径
var errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志输出完整路径
var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    appenders: {
        errorLogger: { type: 'dateFile', filename: errorLogPath,alwaysIncludePattern:true,pattern:"-yyyy-MM-dd-hh.log" },
        resLogger:{type: 'dateFile', filename: responseLogPath,alwaysIncludePattern:true,pattern:"-yyyy-MM-dd-hh.log" }
    },
    categories: {
        default: { appenders: ['resLogger'], level: 'all' },
        category: { appenders: ['errorLogger'], level: 'error' }
    }
};
