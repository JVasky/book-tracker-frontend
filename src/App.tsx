import React from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps} from 'react-router-dom'
import {LandingPage} from './views/landing.page';
import {AppLayout} from './views/user/app.layout'
import {AdminPage} from './views/admin/admin.page'
import Container from 'react-bootstrap/Container'
import {Route, Switch} from 'react-router-dom';
import {ProtectedRoute, AdminRoute} from './protected.route';

export interface Props extends RouteComponentProps {
  history: any;
}

class App extends React.Component {
  render() {
    return (
      <Container className="p-3">
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <ProtectedRoute exact path='/app' component={AppLayout} />
          <AdminRoute exact path='/admin' component={AdminPage} />
        </Switch>
      </Container>
    );
  }
}

export default App;
