const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
// 可选：分析产物构成
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
  mode: 'production',
  // 生产：外部 sourcemap（不打进 JS，可选 hidden-source-map 表示不生成 sourceMappingURL 注释）
  devtool: 'source-map',
  output: {
    // 内容 hash 用于长期缓存
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    // 运行时单独文件，长期缓存
    runtimeChunk: 'single',
    // 关键：代码分割
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 20000,
      cacheGroups: {
        // React 单独分包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
          name: 'vendor-react',
          priority: 20,
        },
        wangeditor: {
          test: /[\\/]node_modules[\\/]@wangeditor[\\/]/,
          name: 'vendor-wangeditor',
          priority: 30,
          chunks: 'async',  // ⚡ 关键：只在异步 chunk 中打包，不进 initial
        },
        antd: {
          test: /[\\/]node_modules[\\/](antd|rc-[^\\/]+|@rc-component)[\\/]/,
          name: 'vendor-antd',
          priority: 25,
        },
        'antd-icons': {
          test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
          name: 'vendor-antd-icons',
          priority: 25,
        },
        // 其他 node_modules
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
        },
        // 项目内被多处引用的公共代码
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console
            drop_debugger: true,
          },
          format: {
            comments: false, // 移除注释
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 500 * 1024, // 单文件 > 500KB 警告
    maxEntrypointSize: 800 * 1024,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    // 构建时预压缩：Nginx 用 gzip_static/brotli_static 直接读，不消耗运行时 CPU
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    // 如果服务器装了 ngx_brotli，再加一份 brotli 预压缩
    // new CompressionPlugin({
    //   algorithm: 'brotliCompress',
    //   filename: '[path][base].br',
    //   test: /\.(js|css|html|svg)$/,
    //   compressionOptions: { level: 11 },
    //   threshold: 8192,
    //   minRatio: 0.8,
    // }),
    // 需要时打开，构建后浏览器自动打开分析报告
    new BundleAnalyzerPlugin(),
  ],
})
