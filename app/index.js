import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import configureStore from './store/configureStore';
import Router from './router';
import './stylesheets/global.scss';

const { store, persistor } = configureStore();

const ErrorBoundary = process.env.NODE_ENV === 'production' ? require('./components/utilities/Noop').default : require('./components/utilities/ErrorBoundary').default;

// This seems like an extra step, but it lets us reload on HMR:
const render = (Component) => {
  ReactDOM.render(
    <ErrorBoundary>
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <Component />
        </Provider>
      </PersistGate>
    </ErrorBoundary>
    , document.getElementById('root'),
  );
};
render(Router);
if (module.hot) {
  module.hot.accept(['router'], () => {
    import('router').then(x => render(x.default));
  });
}
