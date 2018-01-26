'use strict';
const path = require('path');

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js'
    },
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname),
        overlay: {
            warnings: true,
            errors: true
        }
    }
}