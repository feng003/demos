/**
 * Created by zhang on 2016/7/14.
 */

var express = require('express');
var app = express();

var routes = require('./routes')(app);

//app.use(express.static(__dirname + "/public"));

app.listen(8080);
