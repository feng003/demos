/**
 * Created by zhang on 2016/7/14.
 */
var path     = require('path')
    ,express = require('express')
    ,favicon = require('serve-favicon')
    ,logger  = require('morgan')
    ,cookieParser = require('cookie-parser')
    ,bodyParser   = require('body-parser')
    ,session    = require('express-session')
    ,MongoStore = require('connect-mongo')(session)
    ,flash      = require('connect-flash');

var routes = require('./routes/index');
//var api    = require('./routes/api');

var config = require('./config');
var app = express();

//app.get("/api",api.index);

app.set('port',process.env.PORT || 8880);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//config.session.store = new MongoStore(config.mongo);
//console.log(config.session);
//app.use(session(config.session));
app.use(flash());
app.use(session({ secret: 'keyboard cat',resave:false,saveUninitialized:false, cookie: { maxAge: 60000 }}));
app.use(express.static(__dirname + "/public"));

app.use('/', routes);
//app.use('/user', user);

app.listen(process.env.PORT || config.app, function () {
    console.log('blog listening on port ' + (process.env.PORT || config.app));
});
