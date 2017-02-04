/**
 * Created by zhang on 2017/2/4.
 */

module.exports =  {
    watch: true,
    entry: './index.js',
    devtool: 'source-map', //配置生成Source Maps，选择合适的选项
    output: {
        path: path.resolve(process.cwd(),'dist/'),
        filename: '[name].js'
    },
    resolve: {
        alias:{ jquery: 'src/lib/jquery.js', }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'underscore',
            React: 'react'
        }),
        new WebpackNotifierPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },  {
            test: /\.less$/,
            loaders:['style-loader', 'css-loader','less-loader']
        }, {
            test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
            loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
        }, {
            test: /\.html/,
            loader: "html-loader?" + JSON.stringify({minimize: false })
        } ]
    }
};
