import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { injectGlobal } from 'styled-components';
import { normalize } from 'polished';
import configureStore from './store/configureStore';
import App from './containers/App';

injectGlobal`${normalize()}`;

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
render(App);
if (module.hot) {
  module.hot.accept(['containers/App'], () => {
    import('containers/App').then(x => render(x.default));
  });
}
