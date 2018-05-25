'use strict';
var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ZipFilesPlugin = require('webpack-zip-files-plugin');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, '')  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];

module.exports = {
    entry: {
        app: [ "babel-polyfill", __dirname + '/src/app.js' ],
        lib: [ "babel-polyfill", 'react', 'react-dom', 'react-router-dom', 'react-redux', __dirname + '/src/base.js' ]
    },
    output: {
        path: __dirname + '/tmp/',
        filename: '[name].bundle-[chunkhash:5].js',
        publicPath: '/changgui-static/tmp/'
        // publicPath:'http://cc-contract.test.shbaoyuantech.com/tmp',

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [ 'react', 'es2015' ]
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [ 'babel-loader' ]
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [ {
                        loader: "css-loader?minimize"
                    },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: () => [
                                    autoprefixer({
                                        browsers: [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' ], // React doesn't support IE8 anyway
                                        flexbox: 'no-2009'
                                    }),
                                    pxtorem({ rootValue: 100, propWhiteList: [] })
                                ]
                            }
                        }, {
                            loader: "less-loader"
                        } ],
                    // use style-loader in development
                    fallback: "style-loader"
                })

            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: require.resolve('style-loader'),
                            use: [
                                {
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true
                                    }
                                },
                                {
                                    loader: require.resolve('postcss-loader'),
                                    options: {
                                        ident: 'postcss',
                                        plugins: () => [
                                            autoprefixer({
                                                browsers: [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' ], // React doesn't support IE8 anyway
                                                flexbox: 'no-2009'
                                            }),
                                            pxtorem({ rootValue: 100, propWhiteList: [] })
                                        ]
                                    }
                                }
                            ]
                        }
                    )
                )
            },
            {
                test: /\.(svg)$/i,
                loader: 'svg-sprite-loader',
                include: svgDirs
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|woff|woff2|eot|ttf)$/i,
                loader: 'file-loader?limit=8888&name=/imgs/[name]-[hash:5].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    devServer: {
        contentBase: './',//本地服务器所加载的页面所在的目录
        port: 8808,
        historyApiFallback: true,  //不跳转
        inline: true  //实时刷新
    },
    resolve: {
        extensions: [ '.web.js', '.js', '.jsx', '.json' ]
    },

    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({ //<--key to reduce React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'CINTRACT': JSON.stringify('http://cc-contract.shbaoyuantech.com'),//合同
                'CLUE': JSON.stringify("http://cc-contract.shbaoyuantech.com")  //线索
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            React: "react",
            ReactDOM: "react-dom",
            ReactRouterDOM: "react-router-dom",
            ReactRedux: 'react-redux',
            Base: __dirname + '/src/base.js'
        }),
        new ExtractTextPlugin('styles-[chunkhash:5].css', { allChunks: true }),
        new HtmlWebpackPlugin({
            filename: __dirname + '/index.html',
            template: 'index_tmp.html',
            title: '秦汉胡同',
            minify: {
                removeComments: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: 'lib.bundle-[chunkhash:5].js',
            minChunks: Infinity
        }),
        new ZipFilesPlugin({
            entries: [
                { src: path.join(__dirname, './tmp'), dist: 'tmp' },
                { src: path.join(__dirname, './index.html'), dist: 'index.html' }
            ],
            output: path.join(__dirname, './clue_contract_production'),
            format: 'zip'
        }),
        new CleanWebpackPlugin(
            [ 'tmp' ],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        )
    ]
};