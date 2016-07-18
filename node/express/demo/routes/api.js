/**
 * Created by zhang on 2016/7/18.
 */
exports.index = function(req,res){
    res.status(200).json({name:"zhangsan",age:23});
};