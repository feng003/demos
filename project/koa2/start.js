/**
 * Created by zhang on 2016/12/12.
 */

var register = require('babel-core/register');

register({
    presets:['stage-3']
});

require('./app.js');
