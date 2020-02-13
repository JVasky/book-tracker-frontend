import React, { ReactHTMLElement } from 'react';
import {Props} from '../../App'
import AuthenticationService from '../../services/authentication.service'

interface State {
    auth: AuthenticationService
}

export class AppLayout extends React.Component<Props, State> {
    auth:AuthenticationService

    constructor(props:Props) {
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