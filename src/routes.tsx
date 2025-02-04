
import React from 'react';
import LandingPage from './views/landing.page';
import {UserDashboard} from './views/user/user.dashboard';
import {AdminPage} from './views/admin/admin.dashboard';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {ProtectedRoute, AdminRoute} from './protected.route';
import {AdminUsersPage} from './views/admin/users.page';
import {AdminBooksPage} from './views/admin/books.page';
import {AdminAuthorsPage} from './views/admin/authors.page';

export interface RoutesProps {
  updateUser: () => void
}

class Routes extends React.Component<RoutesProps> {
  render() {
    return (
      <Switch>
          <Route exact path='/' render={(props) => <LandingPage updateUser={this.props.updateUser} {...props} />} />
          <ProtectedRoute exact path='/app' component={UserDashboard} />
          <AdminRoute exact path='/admin' component={AdminPage} />
          <AdminRoute exact path='/admin/users' component={AdminUsersPage} />
          <AdminRoute exact path='/admin/books' component={AdminBooksPage} />
          <AdminRoute exact path='/admin/authors' component={AdminAuthorsPage} />
      </Switch>
    );
  }
}

export default Routes;