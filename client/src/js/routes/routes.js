import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'components/App';
import FuelSavingsPage from 'containers/FuelSavingsPage';
import AuthContainer from 'containers/AuthContainer';
// import AboutPage from './components/AboutPage.js';
// import NotFoundPage from './components/NotFoundPage.js';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={AuthContainer} />
  </Route>
);