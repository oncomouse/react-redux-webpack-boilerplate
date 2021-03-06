module.exports = {
  extends: 'eslint-config-airbnb',
  env: {
    browser: true,
    mocha: true,
  },
  parser: 'babel-eslint',
  globals: {
    process: false,
    APP_TITLE: false,
  },
  plugins: [
    'chai-friendly',
  ],
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': [
      2,
      { allowTaggedTemplates: true },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
