const path = require('path');
const fs = require('fs');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const noop = require('noop-webpack-plugin');
// For historyApiFallback:
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

// Read in package.json:
const packageJSON = JSON.parse(fs.readFileSync(path.join('.', 'package.json')));

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Extract PUBLIC_URL from either CLI or package.json:
const PUBLIC_URL = process.env.PUBLIC_URL || (
  isProd
  && Object.prototype.hasOwnProperty.call(packageJSON, 'homepage')
) ? packageJSON.homepage : undefined;
// Extract APP_TITLE from package.json:
const APP_TITLE = (
  Object.prototype.hasOwnProperty.call(packageJSON, 'title')
) ? packageJSON.title : 'My Sample App';
const publicPath = PUBLIC_URL ? url.parse(PUBLIC_URL).pathname : '';

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd
    ? 'hidden-source-map'
    : 'cheap-module-source-map',
  entry: {
    js: [
      'index',
    ],
  },
  output: {
    path: path.resolve('./build/'),
    filename: isProd ? 'bundle.[hash].js' : 'bundle.js',
    publicPath,
    libraryTarget: isProd ? 'umd' : 'var',
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Build the HTML file without having to include it in the app:
    new HtmlWebpackPlugin({
      title: APP_TITLE,
      template: path.join('.', 'app', 'template', 'index.html'),
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: isProd,
        collapseInlineTagWhitespace: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
      },
    }),
    // Define global variables:
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
      APP_TITLE: JSON.stringify(APP_TITLE),
      PUBLIC_URL: JSON.stringify(PUBLIC_URL),
    }),
    // Optimization & Build Plugins:
    isProd ? new webpack.optimize.AggressiveMergingPlugin() : noop(),
    isProd ? new webpack.optimize.OccurrenceOrderPlugin() : noop(),
  ],
  // Recommended Webpack optimizations:,
  optimization: {
    noEmitOnErrors: !isProd,
    concatenateModules: isProd,
    namedModules: !isProd,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            inline: false,
          },
          output: {
            comments: false,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    ],
  },
  resolve: {
    extensions: [
      '.js', '.jsx',
    ],
    modules: [
      path.resolve('./app/'),
      path.resolve('./node_modules'),
    ],
  },
  serve: {
    content: './app',
    hot: true,
    // For historyApiFallback:
    add: (app) => {
      app.use(convert(history({})));
    },
  },
};

module.exports = webpackConfig;
