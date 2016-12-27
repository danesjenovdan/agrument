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
      index: '/',
      disableDotRule: true,
    },
    port: 3000,
    compress: isProd,
    stats: { colors: true },
    setup: (app) => {
      // Here you can access the Express app object and add your own custom middleware to it.
      // TODO: move to separate file and require('filename')(app) it.
      app.get('/data/agrument.json', (req, res) => {
        res.json(
          {
            agrument_posts: [
              {
                id: +req.query.id || 100,
                title: req.query.id || '100',
                date: '12.12.2012',
                articleHTML: '<p>Paragraph with <a href="link">link</a></p>',
                imageURL: 'http://placehold.it/300x100',
                imageSource: 'placehold.it',
                shortLink: 'short.link/xxx',
              },
            ],
          }
        );
      });
    },
  },
};
