import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../components/utilities/Loading';

// Code splitting:
const LoadableHome = Loadable({
  loader: () => import('../pages/Home'),
  loading: Loading,
});

export default () => (
  <Router>
    <div>
      <Route
        exact
        path="/"
        render={props => <LoadableHome {...props} />}
      />
    </div>
  </Router>
);
