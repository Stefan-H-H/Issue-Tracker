/*
  eslint-disable import/no-extraneous-dependencies
*/
const webpack = require('webpack');
const merge = require('webpack-merge');
// Uses 'serverConfig' from webpack.config.js
const serverConfig = require('./webpack.config.js')[1];

module.exports = merge(serverConfig, {
  entry: { server: ['./node_modules/webpack/hot/poll?1000'] },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});