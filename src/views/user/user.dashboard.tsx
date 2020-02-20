import React from 'react';
import AuthenticationService from '../../services/authentication.service'

interface State {
    auth: AuthenticationService
}

export class UserDashboard extends React.Component<any, State> {
    auth:AuthenticationService

    constructor(props:any) {
        super(props);
        this.auth = new AuthenticationService();
    }

    render() {
        return (
            <div>
                <h1>App layout</h1>
            </div>
        );
    }
}