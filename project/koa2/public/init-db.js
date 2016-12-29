/**
 * Created by zhang on 2016/12/14.
 */

require('babel-core/register')({
    presets: ['stage-3']
});

const model = require('../model.js');
model.sync();

console.log('init db ok.');
//process.exit(0);

//http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001472286125147031e735933574ae099842afd31be80d1000
