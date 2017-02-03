var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool:'cheap-module-eval-source-map',
    entry:[
        'webpack-hot-middleware/client',
        './main.js'
    ],
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js',
        publicPath:'/static/'
    },
    plugins:[
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module:{
        loaders:[
            {   test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader'],
                include: __dirname
            }
        ]
    }
};