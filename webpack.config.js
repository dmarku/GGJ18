'use strict';
const path = require('path');

module.exports = {
    entry: {
        main: "./index.js",
        dev_stephan: "./dev_stephan.js",
        dev_markus: "./dev_markus.js",
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.[name].js'
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