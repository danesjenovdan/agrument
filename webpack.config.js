const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
  activePlugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
  activePlugins.push(new ExtractTextPlugin({
    filename: isProd ? 'bundle.[md5:contenthash:hex:20].css' : 'bundle.css',
    disable: false,
    allChunks: true,
  }));
}

activePlugins.push(new HtmlWebpackPlugin({
  template: './index.html',
  hash: false,
  inject: 'body',
  cache: true,
}));

module.exports = {
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
  },
  context: sourcePath,
  entry: {
    vendor: [
      'react',
      'react-dom',
    ],
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
        use: isProd
          ? (
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader'],
            })
          )
          : (
            [
              {
                loader: 'style-loader',
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
            ]
          ),
      },
      {
        test: /\.css$/,
        use: isProd
          ? (
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader',
            })
          )
          : (
            [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
            ]
          ),
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
                ['env', { modules: false }],
                'react',
              ],
              plugins: [
                'transform-object-rest-spread',
                'transform-class-properties',
                'transform-runtime',
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
    contentBase: './src',
    historyApiFallback: {
      index: '/',
      disableDotRule: true,
    },
    port: 3000,
    compress: isProd,
    stats: 'minimal',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      },
    },
  },
};
