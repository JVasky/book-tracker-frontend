import React from 'react';
import AuthenticationService from '../../services/authentication.service'
import UserService from '../../services/user.service'
import Button from 'react-bootstrap/Button';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
    auth: AuthenticationService,
    users?:any,
    userService: UserService
}

export class AdminPage extends React.Component<RouteComponentProps, State> {

    auth:AuthenticationService;
    userService: UserService;
    users:any;

    constructor(props:any) {
        super(props);
        this.auth = new AuthenticationService();
        this.userService = new UserService();
        this.users = this.userService.getAll().then(() => {

        });
        
    }

    render() {
        return (
            <div>
                <h1>Admin page</h1>
                <Button onClick={
                    () => {
                        this.auth.logout();
                        this.props.history.push("/");
                    }
                }>Logout</Button>
            </div>
        );
    }
}

export default withRouter(AdminPage);