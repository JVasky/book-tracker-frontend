
import React from 'react';
import {LandingPage} from './views/landing.page';
import {AppLayout} from './views/user/app.layout'
import {AdminPage} from './views/admin/admin.page'
import {Route, Switch} from 'react-router-dom'
import {ProtectedRoute, AdminRoute} from './protected.route'

class Routes extends React.Component {
  render() {
    return (
        <Switch>
            <Route exact path='/' component={LandingPage} />
            <ProtectedRoute exact path='/app' component={AppLayout} />
            <AdminRoute exact path='/admin' component={AdminPage} />
        </Switch>
    );
  }
}

export default Routes;