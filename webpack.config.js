const path = require('path');
const fs = require('fs');
const url = require('url');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const noop = require('noop-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// For historyApiFallback:
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

// Read in package.json:
const packageJSON = JSON.parse(fs.readFileSync(path.join('.', 'package.json')));

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const isTest = nodeEnv === 'test';

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

const postCSSplugins = () => [
  require('autoprefixer')({ browsers: 'last 3 versions' }), // eslint-disable-line global-require
  require('postcss-easings'), // eslint-disable-line global-require
  require('css-mqpacker'), // eslint-disable-line global-require
  require('postcss-clearfix'), // eslint-disable-line global-require
];

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
      isTest ? {
        test: /\.(js|jsx)$/,
        include: path.resolve('./app'),
        use: {
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true,
          },
        },
      } : {},
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
      }, /*
        CSS loader for the module files (in
        app/stylesheets/components). These are intended to be
        styles for individual React components, which will have a
        unique name space.
      */
      {
        test: /\.css$/,
        exclude: /global\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            /* CSS Modules Code */
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCSSplugins,
            },
          },
        ],
      }, /*
      Loader code for a universal SCSS file. These styles will
      be (as long as you remember to import them into
      app/index.js) loaded for every component and are not
      uniquely namespaced as the module SCSS code above is.
      This file lives in app/stylesheets/global.scss.
       */
      {
        test: /\.css$/,
        include: /global\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            /* CSS Modules Code */
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCSSplugins,
            },
          },
        ],
      }, /*
        SASS loader code for the module files (in
        app/stylesheets/components). These are intended to be
        styles for individual React components, which will have a
        unique name space.
      */
      {
        test: /\.scss$/,
        exclude: /global\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            /* CSS Modules Code */
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCSSplugins,
            },
          },
          'sass-loader',
        ],
      }, /*
        Loader code for a universal SCSS file. These styles will
        be (as long as you remember to import them into
        app/index.js) loaded for every component and are not
        uniquely namespaced as the module SCSS code above is.
        This file lives in app/stylesheets/global.scss.
      */
      {
        test: /\.scss$/,
        include: /global\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            /* CSS Modules Code */
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCSSplugins,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // Use a static directory:
    new CopyWebpackPlugin([
      {
        from: path.resolve('./assets'),
        to: 'assets',
      },
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
    }),
    // Build the HTML file without having to include it in the app:
    new HtmlWebpackPlugin({
      title: APP_TITLE,
      publicPath,
      template: path.join('.', 'app', 'template', 'index.html'),
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: isProd,
        collapseInlineTagWhitespace: isProd,
        removeComments: isProd,
        removeRedundantAttributes: isProd,
      },
    }),
    // Configure SASS:
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      options: {
        context: __dirname,
        sassLoader: {
          includePaths: [
            './node_modules',
            './bower_components',
            './app/stylesheets',
          ],
        },
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
    new CleanWebpackPlugin(['build']),
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
      new OptimizeCSSAssetsPlugin({}),
    ],
    // Load all CSS files into one file:
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: [
      '.js', '.jsx',
    ],
    modules: [
      path.resolve('./app/'),
      path.resolve('./node_modules'),
    ].concat(isTest ? [path.resolve('./test/')] : []),
    alias: {
      APP: path.resolve('./app/'),
      TEST: path.resolve('./test/'),
    },
  },
  serve: {
    content: './app',
    hot: true,
    // For historyApiFallback:
    add: (app) => {
      app.use(convert(history({})));
    },
  },
  externals: isTest ? [nodeExternals({
    whitelist: [],
  })] : [],
  target: isTest ? 'node' : 'web',
};

module.exports = webpackConfig;
