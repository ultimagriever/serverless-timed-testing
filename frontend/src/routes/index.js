import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';
import NoMatch from './NoMatch';

const Routes = () => (
  <Switch>
    {
      routes.map(route => <Route key={route.path} {...route} />)
    }
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
