import React, { ReactHTMLElement } from 'react';
import {Props} from './App'
import AuthenticationService from './services/authentication.service'
import Button from 'react-bootstrap/Button';


export class AdminPage extends React.Component<Props> {
    auth:AuthenticationService

    constructor(props:any) {
        super(props);
        this.auth = new AuthenticationService();
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