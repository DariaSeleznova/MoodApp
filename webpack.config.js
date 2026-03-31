const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');



module.exports = {
    entry: {
        main: './src/js/index.js',
        favorites: './src/js/favorites.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true
    },

    mode: 'development',

    devServer: {
        static: './dist',
        port: 3000,
        open: true
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: 'favorites.html',
            filename: 'favorites.html',
            chunks: ['favorites']
        })
    ]
};