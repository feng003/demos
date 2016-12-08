var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');

// / ：首页
// /login ：用户登录
// /reg ：用户注册
// /post ：发表文章
// /logout ：登出

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(req.body);
    res.render('index', { title: '首页' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: '首页' });
});

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: '注册' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '登陆' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: '发表' });
});

router.get('/login', function(req, res, next) {

});

router.get('/post', function(req, res, next) {

});

router.get('/logout', function(req, res, next) {

});

router.get('/start', function(req, res, next) {
  res.render('index', { title: 'start' });
});

router.get('/time',function(req, res, next){
    res.send(' The time is ' + new Date().toString());
});

router.get('/testM', function(req, res, next) {
  res.render('post', { title: '发表' });
});

router.get('/readme',function(req,res){
    res.send('../readme.md');
});

router.post('/reg',function(req,res){
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    if(password_re != password){
        req.flash('error',"两次输入的密码不一致");
        return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name :name,
        password:password,
        email:req.body.email
    });

    User.get(newUser.name,function(err,user){
        if(err){
            req.flash('error',err);
            return res.redirect('/');
        }
        if(user){
            req.flash('error','用户已存在');
            return res.redirect('/reg');
        }
        newUser.save(function(err,user){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功');
            res.redirect('/');
        });
    });
});

module.exports = router;
