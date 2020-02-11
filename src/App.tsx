import React from 'react';
import ReactDOM from 'react-dom';
import {LandingPage} from './landing.page';
import {AppLayout} from './app.layout'
import logo from './logo.svg';
import './App.css';
import {Route, Switch} from 'react-router-dom';
import {ProtectedRoute} from './protected.route';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/' component={LandingPage} />
        <ProtectedRoute exact path='/app' component={AppLayout} />
      </Switch>
    </div>
  );
}

export default App;
