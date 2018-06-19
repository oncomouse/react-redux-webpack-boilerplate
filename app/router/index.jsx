import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../components/utilities/Loading';

// Code splitting is the process of splitting individual pieces (in this case
// routes) into separate packages in Webpack. Code splitting is important
// because it lets us create leaner initial bundles and/or only load big parts
// of our application when they are actually needed by our application.
//
// Code splitting with react-router is slightly more annoying than it should be,
// but we can use react-loadable's Loadable component to manage. For each route,
// create a new const Loadable<RouteName> and just change the argument passed to
// to the import() call. Below, inside the <div/> in <Router/>, add a new
// <Route/> and, in addition to any path arguments, set render to render your
// new Loadable<RouteName> component in the same way it's done here.
//
// IMPORTANT: Do not forget the {...props} destructuring or your route won't
// receive props (which is useful if you are using react-router's wildcard
// routes to extract things from the matched path).
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
