const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  // 开发用 eval-cheap-module-source-map：快、行准、不进 bundle
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  devServer: {
    port: 8099,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    static: {
      directory: path.resolve(__dirname, '../public'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
      },
    ],
  },
})
