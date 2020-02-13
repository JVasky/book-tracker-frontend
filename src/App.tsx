import React from 'react';
import {RouteComponentProps} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Routes from './routes'

export interface Props extends RouteComponentProps {
  history: any;
}

class App extends React.Component {
  render() {
    return (
      <Container className="p-3">
        <Routes />
      </Container>
    );
  }
}

export default App;
