/**
 * Created by zhang on 2016/7/14.
 */

var express = require('express');
var path    = require('path');
var http    = require("http");
var favicon = require('serve-favicon');
var logger  = require('morgan');
var parseurl     = require('parseurl');
var cookieParser = require('cookie-parser');
var settings = require('./settings');
var session  = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser   = require('body-parser');
var app    = express();

var routes = require('./routes/index');
var api    = require('./routes/api');
app.get("/api",api.index);

app.set('port',process.env.PORT || 8880);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var sess = {
    secret:'keyboard',   //用来对session数据进行加密的字符串
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true,maxAge:6000},
    store: new MongoStore({
        url:settings.url,
        ttl:settings.ttl,
        autoRemove:settings.autoRemove
    })
};
//if(app.get('env') === 'production'){
//    app.set('trust proxy',1);
//    sess.cokkie.secure = true
//}
app.use(session(sess));

app.use(function (req, res, next) {
    var views = req.session.views;
    if (!views) {
        views = req.session.views = {}
    }
    // get the url pathname
    var pathname = parseurl(req).pathname;
    // count the views
    views[pathname] = (views[pathname] || 0) + 1;
    next()
});

app.use('/', routes);
//app.use('/user', user);

app.use(express.static(__dirname + "/public"));
app.listen(app.get('port'));
