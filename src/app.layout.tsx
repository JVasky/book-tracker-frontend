import React, { ReactHTMLElement } from 'react';
import {Props} from './App'
import AuthenticationService from './services/authentication.service'

export class AppLayout extends React.Component<Props> {
    auth:AuthenticationService

    constructor(props:any) {
        super(props);
        this.auth = new AuthenticationService();
    }

    render() {
        return (
            <div>
                <h1>App layout</h1>
                <button onClick={
                    () => {
                        this.auth.logout();
                        this.props.history.push("/");
                    }
                }>Logout</button>
            </div>
        );
    }
}