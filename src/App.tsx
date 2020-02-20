import React from 'react';
import Container from 'react-bootstrap/Container'
import Routes from './routes'
import AuthenticationService from './services/authentication.service'
// import navbars
import UserNav from './nav/user.nav'
import AdminNav from './nav/admin.nav'

interface State {
  isUser: boolean,
  isAdmin: boolean
}

class App extends React.Component<any, State> {

  auth = new AuthenticationService();

  constructor(props:any) {
    super(props);
    this.state = {
      isUser: this.auth.isValid() && !this.auth.isValidAdmin(),
      isAdmin: this.auth.isValidAdmin()
    }
  }

  render() {
    const updateUser = () => {
      this.setState({
        isUser: this.auth.isValid() && !this.auth.isValidAdmin(),
        isAdmin: this.auth.isValidAdmin()
      });
    }
    return (
      <Container className="p-3">
            <UserNav display={this.state.isUser} updateUser={updateUser}/>
            <AdminNav display={this.state.isAdmin} updateUser={updateUser}/>
            <Routes updateUser={updateUser} />
      </Container>
    );
  }
}

export default App;
