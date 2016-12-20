const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

const activePlugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'manifest'],
    minChunks: Infinity,
  }),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
  }),
];

if (isProd) {
  activePlugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin({ filename: isProd ? 'bundle.[contenthash].css' : 'bundle.css', disable: false, allChunks: true }));
}

activePlugins.push(
  new HtmlWebpackPlugin({
    template: './index.html',
    hash: false,
    inject: 'body',
    cache: true,
  }),
  new WebpackMd5Hash());

module.exports = {
  context: sourcePath,
  entry: {
    vendor: [
      'react',
      'react-dom',
    ],
    main: [
      './index.js',
      //'./pages/Home',
    ],
  },
  output: {
    path: distPath,
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
  },
  devtool: isProd ? 'source-map' : 'eval',
  plugins: activePlugins,
  module: {
    rules: [
      /* {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },// */
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader?sourceMap',
          },
          {
            loader: isProd ? ExtractTextPlugin.extract({
              loader: 'css-loader?sourceMap',
            }) : 'css-loader?sourceMap',
          },
          {
            loader: 'sass-loader?sourceMap',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: './src',
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/\d{1,2}\.\d{1,2}\.\d{4}$/,
          to() {
            return '/';
          },
        },
      ],
    },
    port: 3000,
    compress: isProd,
    stats: { colors: true },
  },
};
