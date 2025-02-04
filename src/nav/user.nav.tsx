import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarBrand from 'react-bootstrap/NavbarBrand'
import NavbarToggle from 'react-bootstrap/NavbarToggle';
import NavLink from 'react-bootstrap/NavLink';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import AuthenticationService from '../services/authentication.service';
import {LinkContainer} from 'react-router-bootstrap'

interface State {
    auth: AuthenticationService
}

interface NavProps extends RouteComponentProps {
    history:any,
    display:boolean,
    updateUser: () => void
}

class UserNav extends React.Component<NavProps, State> {
    constructor(props:NavProps) {
        super(props);
        this.state = {
            auth: new AuthenticationService()
        };
            this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.state.auth.logout();
        this.props.updateUser();
        this.props.history.push('/');
    }

    render() {
        if(this.props.display) {
            return (
                <Navbar bg="primary" className="navbar-dark" expand="lg">
                    <NavbarToggle/>
                    <NavbarCollapse>
                        <Nav className='mr-auto'>
                            <LinkContainer to='/app'><NavbarBrand>Dashboard</NavbarBrand></LinkContainer>
                        </Nav>
                        <Nav>
                            <NavLink><Button className="btn-danger" onClick={this.handleLogout}>Logout</Button></NavLink>
                        </Nav>
                    </NavbarCollapse>
                </Navbar>
            );
        } else {
            return null;
        }
    }
} 

export default withRouter(UserNav);