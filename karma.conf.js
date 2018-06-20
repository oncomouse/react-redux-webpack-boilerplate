const webpackConfig = require('./webpack.config.js');

webpackConfig.entry = () => ({});

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadless'], // run in Chrome
    singleRun: true, // just run once by default
    frameworks: ['mocha'], // use the mocha test framework
    files: [
      'tests.webpack.js', // just load this file
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap'], // preprocess with webpack and our sourcemap loader
    },
    reporters: ['mocha', 'coverage'], // report results in this format
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true, // please don't spam the console when running in karma!
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'lcov' },
        { type: 'text' },
      ],
    },
  });
};
