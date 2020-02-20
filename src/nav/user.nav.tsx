import React from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarToggle from 'react-bootstrap/NavbarToggle';
import NavLink from 'react-bootstrap/NavLink';
import NavbarCollapse from 'react-bootstrap/NavbarCollapse'
import {Link, withRouter, RouteComponentProps} from 'react-router-dom'
import AuthenticationService from '../services/authentication.service'

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
            this.goToPage = this.goToPage.bind(this);
    }

    handleLogout() {
        this.state.auth.logout();
        this.props.updateUser();
        this.props.history.push('/');
    }

    goToPage(page:string) {
        this.props.history.push(page)
    }

    render() {
        if(this.props.display) {
            return (
                <Navbar bg="light" expand="lg">
                    <NavbarToggle/>
                    <NavbarCollapse>
                        <Nav className='mr-auto'>
                            <NavLink onClick={() => this.goToPage('/app')}>Dashboard</NavLink>
                        </Nav>
                        <Nav>
                            <NavLink><Button onClick={this.handleLogout}>Logout</Button></NavLink>
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