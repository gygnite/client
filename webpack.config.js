'use strict';

var webpack = require('webpack');
var path = require('path');
var APP_DIR = path.resolve(__dirname, './scripts');
var BUILD_DIR = path.resolve(__dirname, './public');

var config = {
    devtool: 'dev',
    entry: APP_DIR + '/main.js',
    output: {
        path: BUILD_DIR,
        filename: '/js/bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react')
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015', 'stage-0']
            }
        }]
    }
};
module.exports = config;
