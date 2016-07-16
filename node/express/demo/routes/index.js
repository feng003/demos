/**
 * Created by zhang on 2016/7/14.
 */

module.exports = function(app){
    //Express框架等于在http模块之上，加了一个中间层。
    app.get('/',function(req,res){
        res.send('hello node');
    });

    app.get('/admin',function(req,res){
        res.send('hello admin');
    });
};

