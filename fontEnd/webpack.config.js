const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: /src/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                include: /src/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    devtool: 'inline-source-map',
    optimization: {
        runtimeChunk: 'single',
    },
    resolve: {
        alias: {
            "pages": path.resolve(__dirname, './src/pages'),
            "components": path.resolve(__dirname, './src/components'),
            "utils": path.resolve(__dirname, './src/utils'),
            "api": path.resolve(__dirname, './src/api'),
            "images": path.resolve(__dirname, './src/images')
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),
        // new MiniCssExtractPlugin()
    ],
    devServer: {
        port: 8099,
        historyApiFallback: true,
        host: '0.0.0.0',
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    }
}