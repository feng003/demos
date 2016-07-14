/**
 * Created by zhang on 2016/7/14.
 */

module.exports = function(app){
    app.get('/',function(req,res){
        res.send('hello node');
    });

    app.get('/admin',function(req,res){
        res.send('hello admin');
    });
};

