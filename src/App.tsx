import React from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps} from 'react-router-dom'
import {LandingPage} from './landing.page';
import {AppLayout} from './app.layout'
import {AdminPage} from './admin.page'
import logo from './logo.svg';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import {ProtectedRoute, AdminRoute} from './protected.route';

export interface Props extends RouteComponentProps {
  history: any;
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <ProtectedRoute exact path='/app' component={AppLayout} />
          <AdminRoute exact path='/admin' component={AdminPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
