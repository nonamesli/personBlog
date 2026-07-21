const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    // 生产会覆盖成 hash 版
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    clean: true, // webpack 5：自动清理旧产物
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 加速二次构建
        },
      },
      // CSS/SCSS 放到 dev/prod 里，因为 loader 顺序不同
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // < 4kb 转 base64，否则单独出文件
          },
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    alias: {
      pages: path.resolve(__dirname, '../src/pages'),
      components: path.resolve(__dirname, '../src/components'),
      utils: path.resolve(__dirname, '../src/utils'),
      api: path.resolve(__dirname, '../src/api'),
      images: path.resolve(__dirname, '../src/images'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      // 生产环境额外做 HTML 压缩
    }),
  ],
}
