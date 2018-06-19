# react-redux-webpack-boilerplate

This is my starter app for [React](https://reactjs.org/), [Redux](https://redux.js.org/), and [Webpack](https://webpack.js.org/). It includes [redux-thunk](https://github.com/reduxjs/redux-thunk) for side effects, including calls to APIs. It also includes support for a [persistent](https://github.com/rt2zz/redux-persist) store. The development server supports hot reloading.

The starter includes [Ramda](https://ramdajs.org) for functional programming. ES2015+ features are available via [Babel](https://babeljs.io).

For stylesheets, [node-sass](https://github.com/sass/node-sass) and a variety of [PostCSS](http://postcss.org/) plugins are installed. You can use [CSS modules](https://github.com/css-modules/css-modules) for styling components.

Testing is supported through the [Mocha](https://mochajs.org/) framework (with help from [zinserjan/mocha-webpack](https://github.com/zinserjan/mocha-webpack/)). [Chai](http://chaijs.com/) (for assertions), [Sinon](http://sinonjs.org/) (for spies, mocks, and stubs), and [Enzyme](http://airbnb.io/enzyme/) (for React testing) are all also provided. Check the `.spec.js` files in `components/`, 	`containers/`, and `reducers/` to see some examples to get started writing unit tests.

Coverage testing is supplied by [Istanbul](https://istanbul.js.org/). Code quality is checked by [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/).

## Installation

Run `npm install` or `yarn install` to install packages.

## Developing

There are a number of scripts already available for supporting development:

* **Start Development Server** – `npm run start`
* **Build Production Code** – `npm run build`
* **Unit Testing** – `npm run mocha`
	* `npm run mocha:watch` to live update unit tests
* **Coverage Testing** – `npm run cover`
* **Checking Code Quality** – `npm run lint`
	* `npm run lint -- --fix` to fix errors automatically

Running `npm run test` will check code quality and run unit tests.

## Customizing

In `package.json`, set the key `title` to the name of the application. This will set the cache key for redux persistence and the HTML title for the landing page (which you can change using [react-helmet](https://github.com/nfl/react-helmet), if you install it).

## Deploying

Run `yarn build` or `npm run build` to build an optimized, production version of your app. It will be in the `build/` directory.

If you add a `homepage` key to `package.json` and set it equal to the root URL of your application, the path will be correct when you are ready to deploy.

## Debugging

Also: `env NODE_ENV=production webpack --json > stats.json` and upload to [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/)

## Conventions

Some notes on the thought process behind this boilerplate:

### File Extensions for JSX Files

Though this repo uses the [airbnb/javascript](https://github.com/airbnb/javascript) style guide, the rule regarding files containing JSX having to have the `.jsx` extension is loosened (see [discussion of this issue here](https://github.com/airbnb/javascript)). I do, however, continue to use `.jsx` extensions for components and pages, as the purpose of those files is display. Things like unit tests, the router, and the project's main file are all `.js` extensions to indicate their primary function, which is not display. So, to summarize, *use `.jsx` for files in `components/` and `pages/`; use `.js` everywhere else*.

### Directory Aliases For Tests

`webpack.config.js` aliases `app/` as `APP` and `test/` as `TEST`, so that you could type:

~~~
import Home from 'APP/pages/Home';
~~~

However, by convention, code in the `app/` directory uses relative imports for non-library code (ie. what you write yourself). These aliases, instead, are conveniences for writing tests, whose directory structure means writing *long* relative import statements for non-library code. So, to summarize, *only use `APP` and `TEST` import aliases in code in the `test/` directory.*
