const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.traceDeprecation = true;

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

const activePlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
      BROWSER: JSON.stringify(true),
    },
  }),
];

if (isProd) {
  activePlugins.push(new CleanWebpackPlugin());
  activePlugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
  activePlugins.push(new MiniCssExtractPlugin({
    filename: isProd ? 'bundle.[contenthash].css' : 'bundle.css',
  }));
}

activePlugins.push(new HtmlWebpackPlugin({
  template: './template.html',
  hash: false,
  inject: 'body',
  cache: true,
  filename: 'template.html',
}));

module.exports = {
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
  },
  context: sourcePath,
  entry: {
    main: [
      './index.js',
    ],
  },
  output: {
    path: distPath,
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    publicPath: '/',
  },
  devtool: isProd ? 'source-map' : 'eval',
  plugins: activePlugins,
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
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
              babelrc: false,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
              plugins: [
              //   'transform-object-rest-spread',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
                'lodash',
              ],
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
  stats: {
    colors: true,
    hash: false,
    modules: false,
    version: false,
    children: false,
  },
  devServer: {
    index: 'template.html',
    contentBase: './src',
    historyApiFallback: {
      index: '/',
      disableDotRule: true,
    },
    port: 3000,
    compress: isProd,
    stats: 'minimal',
    proxy: [{
      context: ['/media/**', '/api/**', '/get/**', '/rss*', '/rss/**'],
      target: 'http://localhost:8080',
    }],
  },
};
