'use strict';
const path = require('path');

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
    }
}