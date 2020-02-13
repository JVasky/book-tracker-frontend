import React, { ReactHTMLElement } from 'react';
import {Props} from '../../App'
import AuthenticationService from '../../services/authentication.service'
import UserService from '../../services/user.service'
import Button from 'react-bootstrap/Button';

interface State {
    auth: AuthenticationService,
    users?:any,
    userService: UserService
}

export class AdminPage extends React.Component<Props, State> {

    auth:AuthenticationService;
    userService: UserService;
    users:any;

    constructor(props:Props) {
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