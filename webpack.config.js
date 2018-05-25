'use strict';
var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
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
        path: __dirname + '/tmp',
        filename: '[name].bundle.js',
        publicPath: '/tmp/'
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
                        loader: "css-loader"
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
                test: /\.(png|jpg|gif)$/i,
                exclude: /node_modules/,
                loader: [ 'file-loader?limit=8888&name=img/[name].[ext]',
                    {
                        loader: 'image-webpack-loader'
                        // query: {
                        //     progressive: true,
                        // },
                        // options: {
                        //   gifsicle: {
                        //     interlaced: false,
                        //   },
                        //   optipng: {
                        //     optimizationLevel: 7,
                        //   },
                        //   pngquant: {
                        //     quality: '65-90',
                        //     speed: 4
                        //   },
                        //   mozjpeg: {
                        //     progressive: true,
                        //     quality: 65
                        //   },
                        //   webp: {
                        //     quality: 75
                        //   }
                        // }
                    }
                ]
            }

        ]
    },
    resolve: {
        extensions: [ '.web.js', '.js', '.jsx', '.json' ]
    },
    devServer: {
        contentBase: './',//本地服务器所加载的页面所在的目录
        port: 3110,
        hot: true,
        historyApiFallback: true,  //不跳转
        host: '0.0.0.0'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                // 'NODE_ENV': JSON.stringify('production'),
                'CINTRACT': JSON.stringify('http://qywx.test.shbaoyuantech.com/cc-contract'),//合同
                'CLUE': JSON.stringify("http://qywx.test.shbaoyuantech.com/cc-contract")  //线索
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        pxtorem({
                            rootValue: 100,
                            propWhiteList: []
                        })
                    ];
                }
            }
        }),
        //new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     output: {
        //         comments: false,
        //         },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.ProvidePlugin({
            React: "react",
            ReactDOM: "react-dom",
            ReactRouterDOM: "react-router-dom",
            ReactRedux: 'react-redux',
            Base: __dirname + '/src/base.js'
        }),
        new ExtractTextPlugin('styles.css'),
        // new HtmlWebpackPlugin({
        //  filename:'index.html',
        //  template:'index_tmp.html',
        //  title:'秦汉胡同',
        // }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'lib', filename: 'lib.bundle.js', minChunks: Infinity })
    ],
    cache: true
};


