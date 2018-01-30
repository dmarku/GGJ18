'use strict';
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: "./index.js",
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.[name].js'
    },
    devtool: 'source-map',
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname),
        overlay: {
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                drop_console: true,
                minimize: true,
                output: {
                    comments: false
                }
            }
        })
    ]
}