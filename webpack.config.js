const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();



module.exports = {
    entry: {
        main: './src/js/index.js',
        favorites: './src/js/favorites.js',
        list: './src/js/list.js'
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
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),

        new HtmlWebpackPlugin({
            template: './src/favorites.html',
            filename: 'favorites.html',
            chunks: ['favorites']
        }),

        new HtmlWebpackPlugin({
            template: './src/list.html',
            filename: 'list.html',
            chunks: ['list']
        }),
        new webpack.DefinePlugin({
            'process.env.TMDB_TOKEN': JSON.stringify(process.env.TMDB_TOKEN),
            'process.env.LASTFM_KEY': JSON.stringify(process.env.LASTFM_KEY),
            'process.env.GOOGLE_KEY': JSON.stringify(process.env.GOOGLE_KEY),
            'process.env.FIREBASE_KEY': JSON.stringify(process.env.FIREBASE_KEY)
        })
    ]
};